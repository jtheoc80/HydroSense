export const PHYN_PRO_DIRECTORY_URL = "https://phyn.com/pages/find-a-phyn-pro";

export type ManufacturerProgramStatus =
  | "owner_verified_authorization"
  | "phyn_pro";

export type ManufacturerAuthority = {
  manufacturer: "FloLogic" | "Phyn";
  deviceSlug: "flologic" | "phyn-plus";
  relationshipType: "authorization" | "program_participation";
  programStatus: ManufacturerProgramStatus;
  publicLabel: string;
  publicStatement: string;
  exactProgramTitle: string | null;
  verificationUrl: string | null;
  publiclyCorroborated: boolean;
  ownerVerified: boolean;
};

export const manufacturerAuthorities: readonly ManufacturerAuthority[] = [
  {
    manufacturer: "FloLogic",
    deviceSlug: "flologic",
    relationshipType: "authorization",
    programStatus: "owner_verified_authorization",
    publicLabel: "Authorized by FloLogic",
    publicStatement: "HydroSense Texas is authorized by FloLogic.",
    exactProgramTitle: null,
    verificationUrl: null,
    publiclyCorroborated: false,
    ownerVerified: true,
  },
  {
    manufacturer: "Phyn",
    deviceSlug: "phyn-plus",
    relationshipType: "program_participation",
    programStatus: "phyn_pro",
    publicLabel: "Phyn Pro",
    publicStatement:
      "HydroSense Texas is listed in Phyn's Find a Phyn Pro Directory.",
    exactProgramTitle: "Phyn Pro Program",
    verificationUrl: PHYN_PRO_DIRECTORY_URL,
    publiclyCorroborated: true,
    ownerVerified: true,
  },
] as const;

export const manufacturerAuthoritySummary =
  "HydroSense Texas is authorized by FloLogic and listed in Phyn's Find a Phyn Pro Directory.";

export const manufacturerAuthorityShortLabel =
  "Authorized by FloLogic; Phyn Pro";

export function getManufacturerAuthority(deviceSlug: string) {
  return manufacturerAuthorities.find(
    (authority) => authority.deviceSlug === deviceSlug,
  );
}

export function hasManufacturerAuthority(deviceSlug: string) {
  return Boolean(getManufacturerAuthority(deviceSlug));
}

export function getManufacturerAuthorityStatement(deviceSlug: string) {
  return getManufacturerAuthority(deviceSlug)?.publicStatement ?? null;
}
