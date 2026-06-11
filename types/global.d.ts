/* ------------------------------------------------------------------ */
/*  Meta Pixel (fbq) global type declarations                         */
/* ------------------------------------------------------------------ */

type FbqEventName =
  | "AddPaymentInfo"
  | "AddToCart"
  | "AddToWishlist"
  | "CompleteRegistration"
  | "Contact"
  | "CustomizeProduct"
  | "Donate"
  | "FindLocation"
  | "InitiateCheckout"
  | "Lead"
  | "PageView"
  | "Purchase"
  | "Schedule"
  | "Search"
  | "StartTrial"
  | "SubmitApplication"
  | "Subscribe"
  | "ViewContent";

interface FbqFunction {
  (command: "init", pixelId: string): void;
  (command: "track", event: FbqEventName, params?: Record<string, unknown>): void;
  (command: "trackCustom", event: string, params?: Record<string, unknown>): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: (...args: unknown[]) => void;
}

interface Window {
  fbq: FbqFunction;
  _fbq: FbqFunction;
}
