export const TEXAS_PUBLIC_LICENSE_SEARCH_URL =
  "https://vo.licensing.hpc.texas.gov/datamart/selSearchType.do";

// Governed internal evidence. Do not render or serialize these private fulfillment
// details into public pages, generated discovery files, or structured data.
export const plumbingLicenseEvidence = {
  licenseNumber: "43057",
  publicIdentifier: "M-43057",
  licenseType: "Master Plumber",
  licenseStatus: "Current",
  licensePubliclyVerified: true,
  licenseHolderName: "Jamyron L. Davis",
  stateListedCompanyName: "Davis Quality Plumbing LLC",
  rmpEndorsementVerified: true,
  certificateOfInsuranceVerified: true,
  hydroSenseContractualRelationshipOwnerVerified: true,
  plumbingExecutionRelationshipOwnerVerified: true,
  rmpBusinessRelationshipPubliclyCorroborated: false,
  verificationUrl: TEXAS_PUBLIC_LICENSE_SEARCH_URL,
} as const;

export const publicPlumbingAuthorityStatement =
  "Plumbing work is performed through a Texas-licensed plumbing partner under Responsible Master Plumber M-43057.";

export const fullServiceAuthorityStatement =
  "HydroSense manages device selection, plumbing coordination, installation, setup, shutoff testing, and homeowner handoff in one complete service. Plumbing work is performed through a Texas-licensed plumbing partner under Responsible Master Plumber M-43057.";

export const homepagePlumbingTrustStatement =
  "Licensed plumbing execution under RMP M-43057.";

export const googleBusinessProfilePlumbingStatement =
  "Plumbing execution is performed under RMP M-43057.";

export const footerPlumbingTrustStatement =
  "Plumbing execution under RMP M-43057.";
