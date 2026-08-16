# Google Business Profile recommendation

Last validated: 2026-08-15

Google Business Profile Help currently limits a business description to 750 characters and instructs businesses to omit URLs, HTML, promotions, prices, and sales language. Official source: https://support.google.com/business/answer/3039617

Recommended description:

> HydroSense Texas specializes in professional smart water shutoff installation across Greater Houston. We evaluate the incoming domestic water line, select a compatible system, complete plumbing installation and device setup, test automatic shutoff operation, and provide an itemized installation record. HydroSense Texas is authorized by FloLogic and Phyn. We also support additional compatible systems. Published standard installation pricing is available online. Work is coordinated under Texas Master Plumber License MPL 43057.

The governed string and the validated limit are exported from `lib/business/google-business-profile.ts`. Recheck Google’s official requirements before a future material rewrite.

## Profile fields

| Field | Recommended value | Status |
| --- | --- | --- |
| Business name | HydroSense Texas | OWNER VERIFY |
| Website | https://hydrosensetx.com | OWNER VERIFY |
| Phone | (281) 694-5754 | OWNER VERIFY |
| Primary area | Greater Houston | OWNER VERIFY |
| Authorization statement | HydroSense Texas is authorized by FloLogic and Phyn. | OWNER VERIFY |
| Primary category | Do not change without owner confirmation; no category is fabricated in this sprint. | OWNER VERIFY |
| Storefront/public address | Do not publish a residential or unverified storefront address. | OWNER VERIFY |
| Hours | Confirm current customer-facing hours before editing GBP. | OWNER VERIFY |

## Custom services and prices

Use the exact governed service name in the custom service name field and keep the price in GBP's separate price field. Do not append a price to a custom service name.

| Custom service name | Separate price field |
| --- | --- |
| 3/4-inch smart shutoff installation | $999 |
| 1-inch smart shutoff installation | $1,450 |
| 1 1/4-inch smart shutoff installation | $1,875 |
| 1 1/2-inch smart shutoff installation | $3,456 |
| 2-inch commercial-grade smart shutoff installation | $4,175 |
| Additional compatible sensor | $75 |
| Compatible battery backup | $475 |
| Annual system care | $99 |
| Installation compatibility assessment | $0 |
| Irrigation shutoff scope | Quote required |
| Corrective plumbing | Quote required |

The owner must verify GBP supports the intended service and price fields before publishing. Quote-required services must not be assigned a fabricated numeric price.
