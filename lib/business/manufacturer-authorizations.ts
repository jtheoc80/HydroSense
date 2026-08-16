export type ManufacturerAuthorizationStatus = "authorized";

export interface ManufacturerAuthorization {
  manufacturer: "FloLogic" | "Phyn";
  deviceSlug: "flologic" | "phyn-plus";
  status: ManufacturerAuthorizationStatus;
  publicLabel: `Authorized by ${string}`;
  exactProgramTitle: string | null;
  verificationUrl: string | null;
  ownerVerified: boolean;
}

export const manufacturerAuthorizations = [
  {
    manufacturer: "FloLogic",
    deviceSlug: "flologic",
    status: "authorized",
    publicLabel: "Authorized by FloLogic",
    exactProgramTitle: null,
    verificationUrl: null,
    ownerVerified: true,
  },
  {
    manufacturer: "Phyn",
    deviceSlug: "phyn-plus",
    status: "authorized",
    publicLabel: "Authorized by Phyn",
    exactProgramTitle: null,
    verificationUrl: null,
    ownerVerified: true,
  },
] as const satisfies readonly ManufacturerAuthorization[];

export const manufacturerAuthorizationSummary =
  "HydroSense Texas is authorized by FloLogic and Phyn.";

export const manufacturerAuthorizationShortLabel =
  "Authorized by FloLogic and Phyn.";

export function getManufacturerAuthorization(deviceSlug: string) {
  return manufacturerAuthorizations.find(
    (authorization) => authorization.deviceSlug === deviceSlug,
  );
}

export function isManufacturerAuthorized(deviceSlug: string) {
  return getManufacturerAuthorization(deviceSlug) !== undefined;
}

export function getManufacturerAuthorizationStatement(deviceSlug: string) {
  const authorization = getManufacturerAuthorization(deviceSlug);

  return authorization
    ? `HydroSense Texas is authorized by ${authorization.manufacturer}.`
    : null;
}
