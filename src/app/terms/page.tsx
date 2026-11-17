import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SpaceCraft",
  description:
    "The terms and conditions that govern your use of the SpaceCraft studio booking platform.",
};

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "1. Agreement to Terms",
    body: "By accessing or using SpaceCraft, you agree to be bound by these Terms of Service and all policies referenced here. If you do not agree with any part of these terms, you may not use the platform.",
  },
  {
    title: "2. Accounts & Registration",
    body: "You must provide accurate and complete information when creating an account and keep your credentials secure. You are responsible for all activity that occurs under your account, including any bookings made through it.",
  },
  {
    title: "3. Bookings & Payments",
    body: "Studio bookings are made directly between guests and hosts at the listed hourly rate. By confirming a reservation you authorize the associated charges, and you agree to the host's cancellation and rescheduling policy as shown at checkout.",
  },
  {
    title: "4. Host Responsibilities",
    body: "Hosts must list accurate descriptions, pricing, and availability for their studios, maintain their spaces in a safe and usable condition, and honour every confirmed booking. Listing misleading information may result in removal from the platform.",
  },
  {
    title: "5. Acceptable Use",
    body: "You agree not to misuse the platform — including scraping data, interfering with other users, posting unlawful or infringing content, or attempting to circumvent security or booking protections.",
  },
  {
    title: "6. Content & Intellectual Property",
    body: "You retain ownership of the content you submit, but you grant SpaceCraft a worldwide licence to host, display, and process that content as needed to operate the service. The SpaceCraft brand, logos, and site design remain the property of SpaceCraft.",
  },
  {
    title: "7. Limitation of Liability",
    body: "SpaceCraft provides the marketplace that connects guests and hosts. To the maximum extent permitted by law, we are not liable for indirect or consequential damages arising from bookings, interactions, or use of the platform.",
  },
  {
    title: "8. Termination",
    body: "We may suspend or terminate accounts that violate these terms or create risk for other users. You may stop using the platform at any time by signing out or requesting account deletion.",
  },
  {
    title: "9. Changes to These Terms",
    body: "We may update these terms from time to time. Material changes will be posted on this page with an updated date, and continued use of the platform after changes take effect constitutes acceptance of them.",
  },
  {
    title: "10. Contact",
    body: "Questions about these Terms of Service can be sent to our support team through the contact channels listed on the site.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 py-12">
      <div className="container mx-auto max-w-3xl space-y-8">
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: November 17, 2026 — the terms that govern your use of
            SpaceCraft.
          </p>
        </div>

        {/* Terms Sections */}
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
