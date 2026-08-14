import { CATALOG_VERSION, PUBLIC_API_VERSION, serviceCatalog } from "./catalog";
import { calculateEstimate } from "./pricing";

const standardEstimateExample = {
  postalCode: "77494",
  incomingLineSize: "1.00",
  propertyType: "single_family_residential",
  incomingLineSizeVerified: true,
  domesticMainAccessible: true,
  standardPipework: true,
  nearbyPower: true,
  wifiAvailable: true,
  dualMain: false,
  electricalModificationRequired: false,
  correctiveRepairRequired: false,
  irrigationRequested: false,
  fireSprinklerPresent: false,
  sensorQuantity: 2,
  sensorCompatibilityConfirmed: true,
  batteryRequested: true,
  batteryCompatibilityConfirmed: true,
  annualCareRequested: true,
} as const;

const standardEstimateResponseExample = calculateEstimate(standardEstimateExample);

export function buildOpenApiDocument() {
  return {
    openapi: "3.1.0",
    info: {
      title: "HydroSense Public Pricing API",
      version: PUBLIC_API_VERSION,
      summary: "Read-only public service discovery and deterministic catalog pricing.",
      description:
        "No-auth Phase 1 interface. It collects no customer identity or address, cannot schedule work, accept a quote, or authorize payment, and never grants fire-suppression scope. Every estimate remains subject to a final written proposal.",
    },
    servers: [{ url: "https://hydrosensetx.com" }],
    security: [],
    tags: [
      { name: "Catalog", description: `Public catalog ${CATALOG_VERSION}` },
      { name: "Pricing", description: "Deterministic read-only calculations" },
      { name: "A2A", description: "A2A v1.0 discovery and synchronous SendMessage" },
    ],
    paths: {
      "/service-catalog.json": {
        get: {
          tags: ["Catalog"],
          operationId: "getServiceCatalogDocument",
          summary: "Get the stable public catalog document",
          responses: {
            "200": {
              description: "Active public catalog and scope boundary",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Catalog" } } },
            },
          },
        },
      },
      "/openapi.json": {
        get: {
          tags: ["Catalog"],
          operationId: "getOpenApiDocument",
          summary: "Get this OpenAPI 3.1 document",
          responses: { "200": { description: "OpenAPI document" } },
        },
      },
      "/.well-known/agent-card.json": {
        get: {
          tags: ["A2A"],
          operationId: "getAgentCard",
          summary: "Discover the HydroSense A2A v1.0 agent",
          responses: {
            "200": {
              description: "A2A v1.0 Agent Card with a JSONRPC interface",
              content: { "application/json": { schema: { $ref: "#/components/schemas/AgentCard" } } },
            },
            "304": { description: "Agent Card content has not changed" },
          },
        },
      },
      "/api/public/v1/services": {
        get: {
          tags: ["Catalog"],
          operationId: "listServices",
          summary: "List active public services",
          responses: {
            "200": {
              description: "Public services only; no owner notes or unpublished variables",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/ResponseMetadata" },
                      {
                        type: "object",
                        required: ["services"],
                        properties: {
                          services: { type: "array", items: { $ref: "#/components/schemas/Service" } },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      "/api/public/v1/services/{serviceId}": {
        get: {
          tags: ["Catalog"],
          operationId: "getService",
          summary: "Get one active public service",
          parameters: [
            {
              name: "serviceId",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "HS-INSTALL-100-001",
            },
          ],
          responses: {
            "200": {
              description: "Public service",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ServiceResponse" } } },
            },
            "404": {
              description: "Unknown or inactive service ID",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
          },
        },
      },
      "/api/public/v1/serviceability": {
        post: {
          tags: ["Pricing"],
          operationId: "checkServiceability",
          summary: "Check a five-digit ZIP without collecting an address or identity",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ServiceabilityRequest" },
                example: { postalCode: "77494" },
              },
            },
          },
          responses: {
            "200": {
              description: "Known ZIPs are serviceable; unknown ZIPs require manual review and are not rejected",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ServiceabilityResponse" } } },
            },
            "400": {
              description: "Malformed or invalid request",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            "413": { description: "Request body exceeds 16 KiB" },
          },
        },
      },
      "/api/public/v1/estimate": {
        post: {
          tags: ["Pricing"],
          operationId: "estimateStandardInstallation",
          summary: "Calculate published standard-scope pricing",
          description:
            "The one-time catalog total includes only installation and confirmed one-time add-ons. Recurring selections are returned separately. A catalog-exact result does not waive the final written proposal or grant scheduling authority.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/EstimateRequest" },
                example: standardEstimateExample,
              },
            },
          },
          responses: {
            "200": {
              description: "Deterministic estimate, conditions, missing inputs, and scope",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/EstimateResponse" },
                  example: standardEstimateResponseExample,
                },
              },
            },
            "400": {
              description: "Malformed or invalid request",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
            },
            "413": { description: "Request body exceeds 16 KiB" },
          },
        },
      },
      "/api/a2a": {
        post: {
          tags: ["A2A"],
          operationId: "sendA2AMessage",
          summary: "Send one synchronous A2A v1.0 read-only skill request",
          description:
            "Implements JSON-RPC 2.0 SendMessage only. Tasks, streaming, subscriptions, push notifications, booking, quote acceptance, payments, and extended cards are not implemented.",
          parameters: [
            {
              name: "A2A-Version",
              in: "header",
              required: false,
              schema: { type: "string", const: "1.0" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/A2ARequest" },
                example: {
                  jsonrpc: "2.0",
                  id: "req-1",
                  method: "SendMessage",
                  params: {
                    message: {
                      messageId: "msg-1",
                      role: "ROLE_USER",
                      parts: [
                        {
                          data: {
                            skill: "estimate_standard_installation",
                            input: standardEstimateExample,
                          },
                          mediaType: "application/json",
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Synchronous agent message or JSON-RPC method-not-found error",
              headers: { "A2A-Version": { schema: { type: "string", const: "1.0" } } },
              content: {
                "application/json": {
                  schema: { type: "object" },
                  example: {
                    jsonrpc: "2.0",
                    id: "req-1",
                    result: {
                      message: {
                        messageId: "msg-response-1",
                        contextId: "ctx-1",
                        role: "ROLE_AGENT",
                        parts: [
                          {
                            data: standardEstimateResponseExample,
                            mediaType: "application/json",
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
            "400": { description: "JSON parse, envelope, or parameter error" },
            "413": { description: "Request body exceeds 16 KiB" },
          },
        },
      },
    },
    components: {
      schemas: {
        ResponseMetadata: {
          type: "object",
          required: ["apiVersion", "catalogVersion"],
          properties: {
            apiVersion: { type: "string", const: PUBLIC_API_VERSION },
            catalogVersion: { type: "string", const: CATALOG_VERSION },
          },
        },
        FixedPrice: {
          type: "object",
          additionalProperties: false,
          required: ["type", "amount", "unit"],
          properties: {
            type: { type: "string", const: "fixed" },
            amount: { type: "number", minimum: 0 },
            unit: { type: "string", enum: ["project", "each", "system", "year", "assessment"] },
          },
        },
        QuoteRequiredPrice: {
          type: "object",
          additionalProperties: false,
          required: ["type"],
          properties: { type: { type: "string", const: "quote_required" } },
        },
        DeviceFamily: {
          type: "object",
          additionalProperties: false,
          required: ["slug", "name", "designation"],
          properties: {
            slug: { type: "string", example: "flologic" },
            name: { type: "string", example: "FloLogic" },
            designation: { type: "string", enum: ["supported", "designated"], example: "designated" },
          },
        },
        Service: {
          type: "object",
          additionalProperties: false,
          required: ["id", "name", "description", "category", "active", "price"],
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            category: {
              type: "string",
              enum: ["installation", "add_on", "care", "assessment", "quote_required"],
            },
            active: { type: "boolean", const: true },
            price: { oneOf: [{ $ref: "#/components/schemas/FixedPrice" }, { $ref: "#/components/schemas/QuoteRequiredPrice" }] },
            incomingLineSize: { type: "string", enum: ["0.75", "1.00", "1.25", "1.50", "2.00"] },
            deviceIncluded: { type: "boolean", const: true },
            commercialGradeDeviceIncluded: { type: "boolean" },
            deviceFamily: { $ref: "#/components/schemas/DeviceFamily" },
          },
        },
        Catalog: {
          type: "object",
          required: ["catalogVersion", "effectiveDate", "currency", "services", "scope"],
          properties: {
            catalogVersion: { type: "string", const: CATALOG_VERSION },
            effectiveDate: { type: "string", format: "date", const: serviceCatalog.effectiveDate },
            currency: { type: "string", const: "USD" },
            services: { type: "array", minItems: 11, maxItems: 11, items: { $ref: "#/components/schemas/Service" } },
            scope: { type: "object" },
          },
        },
        ServiceResponse: {
          allOf: [
            { $ref: "#/components/schemas/ResponseMetadata" },
            {
              type: "object",
              required: ["service"],
              properties: { service: { $ref: "#/components/schemas/Service" } },
            },
          ],
        },
        ServiceabilityRequest: {
          type: "object",
          additionalProperties: false,
          required: ["postalCode"],
          properties: { postalCode: { type: "string", pattern: "^[0-9]{5}$" } },
        },
        Serviceability: {
          type: "object",
          required: ["postalCode", "status", "markets", "nextAction"],
          properties: {
            postalCode: { type: "string" },
            status: { type: "string", enum: ["serviceable", "review_required"] },
            markets: {
              type: "array",
              items: {
                type: "object",
                required: ["slug", "name"],
                properties: { slug: { type: "string" }, name: { type: "string" } },
              },
            },
            nextAction: {
              type: "string",
              enum: ["request_compatibility_assessment", "manual_service_area_review"],
            },
          },
        },
        ServiceabilityResponse: {
          allOf: [
            { $ref: "#/components/schemas/ResponseMetadata" },
            {
              type: "object",
              required: ["serviceability"],
              properties: { serviceability: { $ref: "#/components/schemas/Serviceability" } },
            },
          ],
        },
        EstimateRequest: {
          type: "object",
          additionalProperties: false,
          required: ["postalCode"],
          properties: {
            postalCode: { type: "string", pattern: "^[0-9]{5}$" },
            incomingLineSize: { type: "string", enum: ["0.75", "1.00", "1.25", "1.50", "2.00"] },
            propertyType: { type: "string", enum: ["single_family_residential", "other", "unknown"] },
            incomingLineSizeVerified: { type: "boolean" },
            domesticMainAccessible: { type: "boolean" },
            standardPipework: { type: "boolean" },
            nearbyPower: { type: "boolean" },
            wifiAvailable: { type: "boolean" },
            dualMain: { type: "boolean" },
            electricalModificationRequired: { type: "boolean" },
            correctiveRepairRequired: { type: "boolean" },
            irrigationRequested: { type: "boolean" },
            fireSprinklerPresent: { type: "boolean" },
            fireSystemRoutingReviewed: { type: "boolean" },
            sensorQuantity: { type: "integer", minimum: 0, maximum: 20, default: 0 },
            sensorCompatibilityConfirmed: { type: "boolean" },
            batteryRequested: { type: "boolean", default: false },
            batteryCompatibilityConfirmed: { type: "boolean" },
            annualCareRequested: { type: "boolean", default: false },
          },
        },
        EstimateLineItem: {
          type: "object",
          additionalProperties: false,
          required: ["serviceId", "name", "quantity", "unitPrice", "total"],
          properties: {
            serviceId: { type: "string" },
            name: { type: "string" },
            quantity: { type: "integer", minimum: 1 },
            unitPrice: { type: "number", minimum: 0 },
            total: { type: "number", minimum: 0 },
            deviceFamily: { $ref: "#/components/schemas/DeviceFamily" },
          },
        },
        RecurringSelection: {
          type: "object",
          additionalProperties: false,
          required: [
            "serviceId",
            "name",
            "amount",
            "currency",
            "billingDuration",
          ],
          properties: {
            serviceId: { type: "string", const: "HS-CARE-ANNUAL-001" },
            name: { type: "string", const: "Annual system care" },
            amount: { type: "number", const: 99 },
            currency: { type: "string", const: "USD" },
            billingDuration: { type: "string", const: "P1Y" },
          },
        },
        EstimateResponse: {
          allOf: [
            { $ref: "#/components/schemas/ResponseMetadata" },
            {
              type: "object",
              required: [
                "currency",
                "serviceability",
                "baseService",
                "confirmedFixedAddOns",
                "conditionalAddOns",
                "oneTimeCatalogTotal",
                "publishedCatalogTotal",
                "recurringSelections",
                "estimateStatus",
                "missingInputs",
                "reviewReasons",
                "scope",
                "finalWrittenProposalRequired",
                "bookingAuthority",
              ],
              properties: {
                currency: { type: "string", const: "USD" },
                serviceability: { $ref: "#/components/schemas/Serviceability" },
                baseService: { oneOf: [{ type: "null" }, { $ref: "#/components/schemas/EstimateLineItem" }] },
                confirmedFixedAddOns: { type: "array", description: "Confirmed one-time sensor and battery add-ons only.", items: { $ref: "#/components/schemas/EstimateLineItem" } },
                conditionalAddOns: { type: "array", items: { type: "object" } },
                oneTimeCatalogTotal: {
                  description: "Installation plus confirmed one-time sensor and battery add-ons. Recurring selections are never included.",
                  oneOf: [{ type: "null" }, { type: "number", minimum: 0 }],
                },
                publishedCatalogTotal: {
                  description: "Backward-compatible alias for oneTimeCatalogTotal. It never includes recurring selections.",
                  deprecated: true,
                  oneOf: [{ type: "null" }, { type: "number", minimum: 0 }],
                },
                recurringSelections: { type: "array", description: "Recurring selections reported separately from the one-time total.", items: { $ref: "#/components/schemas/RecurringSelection" } },
                estimateStatus: {
                  type: "string",
                  enum: ["catalog_exact_standard_scope", "conditional", "review_required"],
                },
                missingInputs: { type: "array", items: { type: "string" } },
                reviewReasons: { type: "array", items: { type: "string" } },
                scope: { type: "object" },
                finalWrittenProposalRequired: { type: "boolean", const: true },
                bookingAuthority: { type: "string", const: "assessment_only" },
              },
            },
          ],
        },
        ErrorResponse: {
          allOf: [
            { $ref: "#/components/schemas/ResponseMetadata" },
            {
              type: "object",
              required: ["error"],
              properties: {
                error: {
                  type: "object",
                  required: ["code", "message"],
                  properties: { code: { type: "string" }, message: { type: "string" }, details: {} },
                },
              },
            },
          ],
        },
        AgentCard: {
          type: "object",
          required: [
            "name",
            "description",
            "supportedInterfaces",
            "version",
            "capabilities",
            "defaultInputModes",
            "defaultOutputModes",
            "skills",
          ],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            supportedInterfaces: {
              type: "array",
              items: {
                type: "object",
                required: ["url", "protocolBinding", "protocolVersion"],
                properties: {
                  url: { type: "string", format: "uri" },
                  protocolBinding: { type: "string", const: "JSONRPC" },
                  protocolVersion: { type: "string", const: "1.0" },
                },
              },
            },
            version: { type: "string", const: "1.0.0" },
            capabilities: { type: "object" },
            defaultInputModes: { type: "array", items: { type: "string" } },
            defaultOutputModes: { type: "array", items: { type: "string" } },
            skills: { type: "array", items: { type: "object" } },
          },
        },
        A2ARequest: {
          type: "object",
          additionalProperties: false,
          required: ["jsonrpc", "id", "method", "params"],
          properties: {
            jsonrpc: { type: "string", const: "2.0" },
            id: { oneOf: [{ type: "string" }, { type: "number" }] },
            method: { type: "string", const: "SendMessage" },
            params: { type: "object" },
          },
        },
      },
    },
  } as const;
}
