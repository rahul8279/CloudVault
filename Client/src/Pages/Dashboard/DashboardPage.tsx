import { dashboardStats } from "./dashboard.data";
import StatCard from "../../components/Dashboard/StatCard";
import { formatBytes } from "../../utils/formatBytes";
import { Link } from "react-router";
import { recentFiles } from "./recentFiles.data";
import RecentFileRow from "../../components/Dashboard/RecentFileRow";

type DashboardCard = {
  label: string;
  value: string | number;
};

function DashboardPage() {
  const sortedRecentFiles = [...recentFiles].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const cards: DashboardCard[] = [
    { label: "Total Files", value: dashboardStats.totalFiles },
    {
      label: "Storage Used",
      value: formatBytes(dashboardStats.storageUsed),
    },
    { label: "Shared Files", value: dashboardStats.sharedFiles },
    { label: "Recent Activity", value: dashboardStats.recentActivityCount },
  ];

  return (
    <div className="space-y-6">
      <section aria-label="Dashboard statistics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            title={card.label}
            value={card.value}
            description="Example data only"
          />
        ))}
      </section>
      <section aria-labelledby="recent-files-title" className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-4 px-6 py-4">
          <h2 id="recent-files-title" className="text-lg font-semibold text-gray-900">Recent Files</h2>
          <Link to="/app/files" className="text-sm font-medium text-blue-700 hover:underline">
            View all
          </Link>
        </div>
        {sortedRecentFiles.length === 0 ? (
          <p className="border-t border-gray-100 px-6 py-8 text-sm text-gray-600">
            No files uploaded yet. Your recently uploaded files will appear here.
          </p>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Recent files with size and last updated date</caption>
            <thead className="border-t border-gray-100 bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">Name</th>
                <th scope="col" className="px-6 py-3 font-medium">Size</th>
                <th scope="col" className="px-6 py-3 font-medium">Last updated</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecentFiles.map((file) => <RecentFileRow key={file.id} file={file} />)}
            </tbody>
          </table>
        </div>
        )}
        <p className="border-t border-gray-100 px-6 py-4 text-xs text-gray-500">Example dashboard design with mock file data.</p>
      </section>
    </div>
  );
}

export default DashboardPage;

