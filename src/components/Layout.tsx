
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import { SideNavigation } from "./SideNavigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Grade Tracker");
  const isMobile = useIsMobile();

  // Update the title based on the route
  useEffect(() => {
    switch (location.pathname) {
      case '/dashboard':
        setPageTitle("Panel Principal");
        break;
      case '/subjects':
        setPageTitle("Asignaturas");
        break;
      case '/grades':
        setPageTitle("Calificaciones");
        break;
      case '/calendar':
        setPageTitle("Calendario");
        break;
      case '/settings':
        setPageTitle("Configuración");
        break;
      default:
        if (location.pathname.includes('/subjects/')) {
          setPageTitle("Detalle de Asignatura");
        } else {
          setPageTitle("Grade Tracker");
        }
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      {/* Mobile header */}
      <header className="sticky top-0 z-10 w-full bg-white border-b border-gray-100 md:hidden">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-lg font-semibold">{pageTitle}</h1>
          <button 
            className="relative text-gray-500 hover:text-gray-900"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Side Navigation */}
      <SideNavigation />

      {/* Main content with padding adjustment for sidebar */}
      <main className="flex-1 md:pl-20 pb-20 md:pb-0 overflow-auto transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
