import { randomUUID } from "node:crypto";
import { z } from "zod";
import { CATALOG_VERSION, PUBLIC_API_VERSION, publicCatalogProjection } from "./catalog";
import { calculateEstimate, estimateRequestSchema, serviceabilityRequestSchema } from "./pricing";
import { checkServiceability } from "./serviceability";

const jsonRpcIdSchema = z.union([z.string(), z.number()]);

const textPartSchema = z
  .object({
    text: z.string(),
    mediaType: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict();

const rawPartSchema = z
  .object({
    raw: z.string(),
    filename: z.string().optional(),
    mediaType: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict();

const urlPartSchema = z
  .object({
    url: z.string().url(),
    filename: z.string().optional(),
    mediaType: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict();

export const a2aDataPartSchema = z
  .object({
    data: z.unknown(),
    mediaType: z.literal("application/json"),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict();

export const a2aPartSchema = z.union([
  textPartSchema,
  rawPartSchema,
  urlPartSchema,
  a2aDataPartSchema,
]);

export const a2aMessageSchema = z
  .object({
    messageId: z.string().min(1),
    contextId: z.string().min(1).optional(),
    taskId: z.string().min(1).optional(),
    role: z.enum(["ROLE_USER", "ROLE_AGENT"]),
    parts: z.array(a2aPartSchema).min(1),
    metadata: z.record(z.unknown()).optional(),
    extensions: z.array(z.string().url()).optional(),
    referenceTaskIds: z.array(z.string().min(1)).optional(),
  })
  .strict();

const sendMessageParamsSchema = z
  .object({
    tenant: z.string().optional(),
    message: a2aMessageSchema,
    configuration: z
      .object({
        acceptedOutputModes: z.array(z.string()).optional(),
        historyLength: z.number().int().min(0).optional(),
        returnImmediately: z.boolean().optional(),
      })
      .strict()
      .optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict();

const jsonRpcEnvelopeSchema = z
  .object({
    jsonrpc: z.literal("2.0"),
    id: jsonRpcIdSchema,
    method: z.string().min(1),
    params: z.unknown(),
  })
  .strict();

const skillRequestSchema = z
  .object({
    skill: z.enum([
      "get_service_catalog",
      "check_serviceability",
      "estimate_standard_installation",
    ]),
    input: z.unknown().optional(),
  })
  .strict();

export const agentCardSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    supportedInterfaces: z
      .array(
        z
          .object({
            url: z.string().url(),
            protocolBinding: z.literal("JSONRPC"),
            protocolVersion: z.literal("1.0"),
          })
          .strict(),
      )
      .min(1),
    provider: z
      .object({
        organization: z.string().min(1),
        url: z.string().url(),
      })
      .strict(),
    version: z.literal("1.0.0"),
    documentationUrl: z.string().url(),
    capabilities: z
      .object({
        streaming: z.literal(false),
        pushNotifications: z.literal(false),
        extendedAgentCard: z.literal(false),
      })
      .strict(),
    securitySchemes: z.record(z.never()),
    securityRequirements: z.array(z.never()),
    defaultInputModes: z.array(z.literal("application/json")).min(1),
    defaultOutputModes: z.array(z.literal("application/json")).min(1),
    skills: z
      .array(
        z
          .object({
            id: z.enum([
              "get_service_catalog",
              "check_serviceability",
              "estimate_standard_installation",
            ]),
            name: z.string().min(1),
            description: z.string().min(1),
            tags: z.array(z.string()).min(1),
            examples: z.array(z.string()).min(1),
            inputModes: z.array(z.literal("application/json")).min(1),
            outputModes: z.array(z.literal("application/json")).min(1),
          })
          .strict(),
      )
      .length(3),
  })
  .strict();

export function createAgentCard() {
  return agentCardSchema.parse({
    name: "HydroSense Public Pricing Agent",
    description:
      "Read-only discovery, serviceability, and deterministic standard-scope pricing for HydroSense Texas smart water shutoff installation.",
    supportedInterfaces: [
      {
        url: "https://hydrosensetx.com/api/a2a",
        protocolBinding: "JSONRPC",
        protocolVersion: "1.0",
      },
    ],
    provider: {
      organization: "HydroSense Texas",
      url: "https://hydrosensetx.com",
    },
    version: "1.0.0",
    documentationUrl: "https://hydrosensetx.com/agent-ready",
    capabilities: {
      streaming: false,
      pushNotifications: false,
      extendedAgentCard: false,
    },
    securitySchemes: {},
    securityRequirements: [],
    defaultInputModes: ["application/json"],
    defaultOutputModes: ["application/json"],
    skills: [
      {
        id: "get_service_catalog",
        name: "Get service catalog",
        description: "Return active public HydroSense service records, pricing, and scope boundaries.",
        tags: ["catalog", "pricing", "read-only"],
        examples: ["Return the current HydroSense public service catalog."],
        inputModes: ["application/json"],
        outputModes: ["application/json"],
      },
      {
        id: "check_serviceability",
        name: "Check ZIP serviceability",
        description: "Check a five-digit ZIP against published Greater Houston service markets without collecting an address or identity.",
        tags: ["serviceability", "postal-code", "read-only"],
        examples: ["Check whether postal code 77494 is in a published service market."],
        inputModes: ["application/json"],
        outputModes: ["application/json"],
      },
      {
        id: "estimate_standard_installation",
        name: "Estimate standard installation",
        description: "Calculate a deterministic one-time published-catalog total, return recurring selections separately, and identify missing inputs, conditions, and quote-required scope.",
        tags: ["estimate", "pricing", "scope", "read-only"],
        examples: ["Estimate a standard 1-inch installation in postal code 77494."],
        inputModes: ["application/json"],
        outputModes: ["application/json"],
      },
    ],
  });
}

export type JsonRpcOutcome = {
  readonly status: number;
  readonly body: Record<string, unknown>;
};

function jsonRpcError(
  id: string | number | null,
  code: number,
  message: string,
  reason: string,
  details?: unknown,
): JsonRpcOutcome {
  return {
    status: code === -32601 ? 200 : 400,
    body: {
      jsonrpc: "2.0",
      id,
      error: {
        code,
        message,
        data: [
          {
            "@type": "type.googleapis.com/google.rpc.ErrorInfo",
            reason,
            domain: "hydrosensetx.com",
            metadata: {
              apiVersion: PUBLIC_API_VERSION,
              catalogVersion: CATALOG_VERSION,
            },
          },
          ...(details === undefined
            ? []
            : [
                {
                  "@type": "type.googleapis.com/google.rpc.BadRequest",
                  details,
                },
              ]),
        ],
      },
    },
  };
}

export function jsonRpcParseError(): JsonRpcOutcome {
  return jsonRpcError(null, -32700, "Invalid JSON payload", "JSON_PARSE_ERROR");
}

export function jsonRpcRequestTooLarge(): JsonRpcOutcome {
  const outcome = jsonRpcError(null, -32600, "Request payload validation error", "REQUEST_TOO_LARGE");
  return { ...outcome, status: 413 };
}

export function processA2ARequest(payload: unknown): JsonRpcOutcome {
  const envelopeResult = jsonRpcEnvelopeSchema.safeParse(payload);
  if (!envelopeResult.success) {
    return jsonRpcError(
      null,
      -32600,
      "Request payload validation error",
      "INVALID_REQUEST",
      envelopeResult.error.flatten(),
    );
  }

  const envelope = envelopeResult.data;
  if (envelope.method !== "SendMessage") {
    return jsonRpcError(
      envelope.id,
      -32601,
      "Method not found",
      "METHOD_NOT_FOUND",
    );
  }

  const paramsResult = sendMessageParamsSchema.safeParse(envelope.params);
  if (!paramsResult.success || paramsResult.data.message.role !== "ROLE_USER") {
    return jsonRpcError(
      envelope.id,
      -32602,
      "Invalid parameters",
      "INVALID_PARAMS",
      paramsResult.success
        ? { role: "SendMessage requests must use ROLE_USER" }
        : paramsResult.error.flatten(),
    );
  }

  const dataPart = paramsResult.data.message.parts.find(
    (part): part is z.infer<typeof a2aDataPartSchema> => "data" in part,
  );
  const skillResult = skillRequestSchema.safeParse(dataPart?.data);
  if (!dataPart || !skillResult.success) {
    return jsonRpcError(
      envelope.id,
      -32602,
      "Invalid parameters",
      "INVALID_SKILL_REQUEST",
      skillResult.success ? undefined : skillResult.error.flatten(),
    );
  }

  let resultData: unknown;
  try {
    switch (skillResult.data.skill) {
      case "get_service_catalog":
        resultData = {
          apiVersion: PUBLIC_API_VERSION,
          ...publicCatalogProjection(),
        };
        break;
      case "check_serviceability": {
        const input = serviceabilityRequestSchema.parse(skillResult.data.input);
        resultData = {
          apiVersion: PUBLIC_API_VERSION,
          catalogVersion: CATALOG_VERSION,
          serviceability: checkServiceability(input.postalCode),
        };
        break;
      }
      case "estimate_standard_installation":
        resultData = calculateEstimate(estimateRequestSchema.parse(skillResult.data.input));
        break;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonRpcError(
        envelope.id,
        -32602,
        "Invalid parameters",
        "INVALID_SKILL_INPUT",
        error.flatten(),
      );
    }
    return jsonRpcError(
      envelope.id,
      -32603,
      "Internal error",
      "INTERNAL_ERROR",
    );
  }

  return {
    status: 200,
    body: {
      jsonrpc: "2.0",
      id: envelope.id,
      result: {
        message: {
          messageId: randomUUID(),
          contextId: paramsResult.data.message.contextId ?? randomUUID(),
          role: "ROLE_AGENT",
          parts: [
            {
              data: resultData,
              mediaType: "application/json",
            },
          ],
        },
      },
    },
  };
}
