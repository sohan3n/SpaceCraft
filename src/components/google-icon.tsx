/**
 * Official multi-color Google "G" brand mark.
 *
 * Note: lucide-react does not ship third-party brand icons, so the logo itself
 * is an inline SVG while Lucide icons (e.g. Loader2) handle all other button
 * states throughout the app.
 */
export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="currentColor"
    >
      <path d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.12-5.35 4.12-3.22 0-5.85-2.67-5.85-5.95S8.78 6.3 12 6.3c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.66 3.7 14.55 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12S6.9 21.3 12 21.3c5.74 0 9.56-4.03 9.56-9.7 0-.65-.07-1.14-.21-1.5z" />
    </svg>
  );
}
