import { WorkspaceDashboard } from "@/components/WorkspaceDashboard";

export default function MyStudiosDashboardPage() {
  return (
    <WorkspaceDashboard
      defaultTab="studios"
      title="My Studio Listings"
      subtitle="Manage your listed creative spaces and review incoming booking requests."
    />
  );
}
