"use client";

/**
 * Signature motif: a cross-section of tree growth rings, used as a section
 * divider. The ring count and spacing are irregular on purpose (real growth
 * rings vary with each year), so it never looks like a generated gradient.
 */
export default function WoodRingDivider({ className = "", align = "center" }) {
  const justify =
    align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";

  return (
    <div className={`flex ${justify} ${className}`} aria-hidden="true">
      <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
        <ellipse cx="60" cy="20" rx="6" ry="4" stroke="#B5652D" strokeWidth="1.4" opacity="0.9" />
        <ellipse cx="60" cy="20" rx="16" ry="10.5" stroke="#B5652D" strokeWidth="1.2" opacity="0.65" />
        <ellipse cx="60" cy="20" rx="28" ry="17" stroke="#B5652D" strokeWidth="1" opacity="0.45" />
        <ellipse cx="60" cy="20" rx="42" ry="24" stroke="#B5652D" strokeWidth="0.8" opacity="0.3" />
        <ellipse cx="60" cy="20" rx="58" ry="30" stroke="#B5652D" strokeWidth="0.6" opacity="0.18" />
      </svg>
    </div>
  );
}
