import { WorkspaceDashboard } from "@/components/WorkspaceDashboard";

export default function MyBookingsPage() {
  return (
    <WorkspaceDashboard
      defaultTab="bookings"
      title="My Bookings"
      subtitle="View, track, and manage all studio sessions you have reserved."
    />
  );
}
