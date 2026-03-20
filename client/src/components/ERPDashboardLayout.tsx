import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  FileText,
  Wrench,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
  AlertCircle,
} from "lucide-react";

interface ERPDashboardLayoutProps {
  children: React.ReactNode;
}

export default function ERPDashboardLayout({ children }: ERPDashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, setCurrentPath] = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Clientes", path: "/clients" },
    { icon: FileText, label: "Ordens de Serviço", path: "/service-orders" },
    { icon: Wrench, label: "Equipamentos", path: "/equipment" },
    { icon: Search, label: "Buscar", path: "/search" },
    { icon: AlertCircle, label: "Log de Exclusões", path: "/deletion-logs" },
    { icon: Settings, label: "Configurações", path: "/settings" },
  ];

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              EP
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <h1 className="text-sm font-bold text-gray-900">EPSOLUÇÕES</h1>
                <p className="text-xs text-gray-500">Impressoras</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => setCurrentPath(item.path)}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          {sidebarOpen && (
            <div className="px-2 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full justify-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {sidebarOpen && "Sair"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              EPSOLUÇÕES EM IMPRESSORAS
            </h2>
          </div>
          <div className="text-sm text-gray-600">
            Sistema de Gestão de Ordens de Serviço
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
