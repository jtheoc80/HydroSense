"use client";

import { useEffect, useRef } from "react";

/**
 * Wrapper for lite-youtube-embed web component.
 * Dynamically imports the JS + CSS to register <lite-youtube>.
 */
export default function LiteYouTube({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    // Inject CSS
    if (!document.querySelector('link[href*="lite-yt-embed"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/lite-youtube-embed@0.3.3/src/lite-yt-embed.min.css";
      document.head.appendChild(link);
    }

    // Register web component
    import("lite-youtube-embed");
  }, []);

  return (
    <div className="rounded-xl overflow-hidden border border-ink-700/30">
      {/* @ts-expect-error lite-youtube is a web component, not a React element */}
      <lite-youtube videoid={videoId} playlabel={title} />
    </div>
  );
}
