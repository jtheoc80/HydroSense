# HydroSense manufacturer and license authority ledger

Updated: 2026-08-16

This ledger governs public authority wording for HydroSense Texas. It distinguishes owner evidence, public corroboration, program participation, and license evidence. A public manufacturer directory is corroboration of the stated program relationship; it is not a HydroSense social profile and must not be used as `sameAs`.

## Manufacturer records

| Manufacturer | Governed relationship | Program status | Owner verified | Publicly corroborated | Public wording | Public evidence |
| --- | --- | --- | --- | --- | --- | --- |
| FloLogic | Authorization | `owner_verified_authorization` | Yes | No | Authorized by FloLogic | Owner-provided evidence; public URL and exact program title remain unconfirmed |
| Phyn | Program participation | `phyn_pro` | Yes | Yes | Listed in Phyn's Find a Phyn Pro Directory; short label: Phyn Pro | https://phyn.com/pages/find-a-phyn-pro |

### Phyn governed state

- programStatus: `phyn_pro`
- publiclyCorroborated: `true`
- ownerVerified: `true`
- relationship type: program participation
- exact program title: Phyn Pro Program
- corroboration URL: https://phyn.com/pages/find-a-phyn-pro
- the directory must not be encoded as `sameAs`

Do not use Phyn Certified, Phyn Authorized Installer, Phyn Approved Installer, or Phyn Endorsed Installer unless separate written evidence grants that exact designation.

### FloLogic governed state

FloLogic remains an owner-verified authorization without a public corroboration URL or confirmed exact program designation. Do not change the public wording until owner documentation confirms the actual designation. FloLogic's official program vocabulary may include `Referral Installer` and `Dealer`; use only the exact term shown by the owner's evidence.

Do not invent Certified, Preferred, or Authorized Dealer wording.

## Texas plumbing license evidence

Owner-provided official Texas Public License Search evidence establishes:

- license number: 43057
- license type: Master Plumber
- status: Current
- licensePubliclyVerified: `true`
- rmpBusinessRelationshipVerified: `false`
- durable verification destination: https://vo.licensing.hpc.texas.gov/datamart/selSearchType.do

The public search evidence does not yet corroborate HydroSense's Responsible Master Plumber or company relationship. Until the detail record is reviewed, public pages must retain this cautious sentence:

> Work coordinated under Texas Master Plumber License MPL 43057.

The session-specific `list.do?anchor` URL is not durable evidence and must not be stored.

## Schema and entity policy

- HydroSense's global business entity remains `https://hydrosensetx.com/#business`.
- The Phyn directory is visible corroboration only and is excluded from `sameAs`.
- Manufacturer sites and directories are not HydroSense identity profiles.
- The business schema must not include `hasCredential` while `rmpBusinessRelationshipVerified` is false.
- Current public phone: (281) 694-5754.
- Supported device compatibility does not imply authorization, certification, endorsement, or program participation.
