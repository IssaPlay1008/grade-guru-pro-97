
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Book, 
  GraduationCap, 
  BarChart2, 
  Settings, 
  Home, 
  Calendar,
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";

export function SideNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [tabVisible, setTabVisible] = useState(false);

  // Hide sidebar after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isVisible) {
        setIsVisible(false);
        setTabVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  const navItems = [
    { 
      icon: Home, 
      label: "Inicio", 
      path: "/dashboard",
      active: location.pathname === "/dashboard"
    },
    { 
      icon: Book, 
      label: "Materias", 
      path: "/subjects",
      active: location.pathname === "/subjects" || location.pathname.includes("/subjects/")
    },
    { 
      icon: Calendar, 
      label: "Calendario", 
      path: "/calendar",
      active: location.pathname === "/calendar"
    },
    { 
      icon: GraduationCap, 
      label: "Calificaciones", 
      path: "/grades",
      active: location.pathname === "/grades"
    },
    { 
      icon: Settings, 
      label: "Ajustes", 
      path: "/settings",
      active: location.pathname === "/settings"
    },
  ];

  const handleNavigation = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
    setTabVisible(false);
  };

  return (
    <>
      {/* Sidebar navigation */}
      <div 
        className={cn(
          "fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 z-20 transition-transform duration-300",
          !isVisible && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-14 flex items-center justify-center border-b border-gray-100">
            <GraduationCap className="h-7 w-7 text-indigo-600" />
          </div>
          
          {/* Navigation items */}
          <div className="flex flex-col flex-1 pt-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={(e) => handleNavigation(item.path, e)}
                className={cn(
                  "flex flex-col items-center justify-center py-5 text-xs transition-colors relative",
                  item.active 
                    ? "text-indigo-600"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
                {item.active && (
                  <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
                )}
              </button>
            ))}
          </div>

          {/* Logout */}
          {user && (
            <button
              onClick={async () => {
                await signOut();
                navigate("/auth", { replace: true });
              }}
              className="flex flex-col items-center justify-center py-5 text-xs text-gray-500 hover:text-red-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
            >
              <LogOut className="h-5 w-5 mb-1" />
              <span className="text-xs">Salir</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab to show sidebar again */}
      {tabVisible && (
        <div 
          className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 border-l-0 rounded-r-lg p-2 cursor-pointer z-20 hover:bg-gray-50"
          onClick={toggleSidebar}
        >
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </div>
      )}
    </>
  );
}
