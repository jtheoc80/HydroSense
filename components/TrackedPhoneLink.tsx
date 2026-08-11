"use client";

import type {
  AnchorHTMLAttributes,
  MouseEvent,
  PropsWithChildren,
} from "react";

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

type TrackedPhoneLinkProps = PropsWithChildren<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    trackingLocation?: string;
  }
>;

export default function TrackedPhoneLink({
  children,
  trackingLocation = "site",
  onClick,
  ...props
}: TrackedPhoneLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const analytics = window as AnalyticsWindow;

    analytics.gtag?.("event", "phone_click", {
      location: trackingLocation,
      phone_number: "+12816945754",
    });
    analytics.fbq?.("trackCustom", "PhoneClick", {
      location: trackingLocation,
    });

    onClick?.(event);
  }

  return (
    <a {...props} href="tel:+12816945754" onClick={handleClick}>
      {children}
    </a>
  );
}
