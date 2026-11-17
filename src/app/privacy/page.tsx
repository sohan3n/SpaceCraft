import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SpaceCraft",
  description:
    "How SpaceCraft collects, uses, and protects your personal information.",
};

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide when creating an account (such as your name, email address, and profile details), details related to your bookings and listings, and technical data such as device and usage information that helps us improve the platform.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your information to operate the marketplace — creating and managing accounts, processing bookings, sending transactional notifications, providing customer support, keeping the platform secure, and improving the experience for guests and hosts.",
  },
  {
    title: "3. How We Share Information",
    body: "We share information only as needed to provide the service: with the other party of a booking you make, with payment and infrastructure providers who process data on our behalf, and when required by law. We do not sell your personal information.",
  },
  {
    title: "4. Sign-In & Third-Party Providers",
    body: "If you choose to sign in with a provider such as Google, we receive the basic profile information that provider shares with us to complete authentication. That provider's own privacy policy governs their handling of your data.",
  },
  {
    title: "5. Cookies",
    body: "We use cookies and similar technologies to keep you signed in, remember your preferences, and understand how the platform is used. Session cookies are essential to authentication — blocking them will prevent you from staying signed in.",
  },
  {
    title: "6. Data Retention & Security",
    body: "We retain personal information only as long as needed for the purposes described here, including legal and accounting requirements. We use reasonable technical and organisational measures to protect your data, though no method of transmission is completely secure.",
  },
  {
    title: "7. Your Rights & Choices",
    body: "You can review and update your profile information from your account settings at any time, and you may request access to, correction of, or deletion of your personal data by contacting us.",
  },
  {
    title: "8. Children's Privacy",
    body: "SpaceCraft is not directed to children under 16, and we do not knowingly collect personal information from them. If you believe a child has provided us with data, contact us so we can remove it.",
  },
  {
    title: "9. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Material changes will be posted on this page with an updated date, and we will notify you when appropriate.",
  },
  {
    title: "10. Contact",
    body: "If you have questions about this Privacy Policy or how your data is handled, please reach out to our support team through the contact channels listed on the site.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 py-12">
      <div className="container mx-auto max-w-3xl space-y-8">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: November 17, 2026 — how we collect, use, and protect
            your information.
          </p>
        </div>

        {/* Privacy Sections */}
        {SECTIONS.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="font-heading text-xl font-semibold tracking-tight">
              {section.title}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
