
import { Button } from "@/components/ui/button";
import { GraduationCap, BarChart2, Calendar, Book } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center">
        <div className="flex items-center">
          <GraduationCap className="h-8 w-8 text-brand-600" />
          <h1 className="ml-2 text-xl font-bold text-brand-900">Grade Genius</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">Iniciar Sesión</Link>
        </Button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 px-4 py-10 flex flex-col items-center">
        <div className="text-center mb-12 mt-10">
          <h1 className="text-4xl font-bold text-brand-900 mb-4">
            Controla tus calificaciones académicas
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Registra, calcula y visualiza tu progreso académico desde cualquier dispositivo.
            Establecer metas y logra mejores resultados.
          </p>
          <Button size="lg" className="mt-8 bg-brand-600 hover:bg-brand-700" asChild>
            <Link to="/dashboard">Comenzar ahora</Link>
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-10">
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="bg-indigo-100 p-3 rounded-full mb-4">
              <Book className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Gestión de Asignaturas</h3>
            <p className="text-gray-600">Registra tus materias, evaluaciones y pondera tus calificaciones automáticamente.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="bg-indigo-100 p-3 rounded-full mb-4">
              <BarChart2 className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Análisis Visual</h3>
            <p className="text-gray-600">Visualiza tu rendimiento con gráficos interactivos y detecta áreas de mejora.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="bg-indigo-100 p-3 rounded-full mb-4">
              <Calendar className="h-6 w-6 text-brand-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Planificación</h3>
            <p className="text-gray-600">Establece metas académicas y recibe recordatorios de fechas importantes.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-white border-t border-gray-200">
        <div className="text-center text-gray-500 text-sm">
          <p>© 2025 Grade Genius. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
