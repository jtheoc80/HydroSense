"use client";

import { trackContact } from "@/lib/meta-pixel";

interface PhoneLinkProps {
  className?: string;
  children?: React.ReactNode;
}

export default function PhoneLink({ className, children }: PhoneLinkProps) {
  return (
    <a
      href="tel:+12816945754"
      className={className}
      onClick={trackContact}
    >
      {children ?? "(281) 694-5754"}
    </a>
  );
}
