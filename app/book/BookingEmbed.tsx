"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function BookingEmbed() {
  const calUsername = process.env.NEXT_PUBLIC_CAL_USERNAME;

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  if (!calUsername) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-fog-300">
        <p>
          Booking calendar not configured. Set NEXT_PUBLIC_CAL_USERNAME in
          environment variables.
        </p>
      </div>
    );
  }

  return (
    <Cal
      calLink={`${calUsername}/hydrosense-quote`}
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{
        layout: "month_view",
        theme: "dark",
      }}
    />
  );
}
