import { Outlet, useLocation } from "react-router";
import Sidebar from "./Layout/Sidebar";
import Header from "./Layout/Header";
import { useState } from "react";
import StorageProvider from "../Contexts/StorageProvider";


function AppLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const location = useLocation();
    const pageTitle = location.pathname === "/app/files" || location.pathname.startsWith("/app/files/") ? "My Files" : "Dashboard"
  return (
    <StorageProvider>
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={pageTitle}
          onMenuClick={() => setIsSidebarOpen(true)}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
    </StorageProvider>
  );
}

export default AppLayout;

