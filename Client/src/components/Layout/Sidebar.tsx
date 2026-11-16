import { NavLink } from "react-router";

type NavItem = {
  label: string;
  path: string;
};

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/app" },
  { label: "My Files", path: "/app/files" },
];

function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white p-6 md:static md:z-auto md:block ${isOpen ? "block" : "hidden"}`}
      >
      <div className="mb-8 flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-gray-900">CloudVault</h1>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-blue-600 md:hidden"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <nav aria-label="Main navigation" className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            end={item.path === "/app"}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      </aside>
    </>
  );
}

export default Sidebar;
