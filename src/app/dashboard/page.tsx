import { WorkspaceDashboard } from "@/components/WorkspaceDashboard";

export default function DashboardPage() {
  return (
    <WorkspaceDashboard
      defaultTab="studios"
      title="Creator & Host Dashboard"
      subtitle="Overview of your listed studios, incoming host requests, and booked sessions."
    />
  );
}
