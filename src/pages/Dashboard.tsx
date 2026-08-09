import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart2, Calendar, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { generateMockSubjects, getUpcomingAssessments, isSubjectAtRisk, calculateSubjectGrade } from "@/lib/mock-data";
import { Subject, Assessment } from "@/types";
import { cn } from "@/lib/utils";

interface DashboardProps {
  subjects: Subject[];
}

const Dashboard = ({ subjects }: DashboardProps) => {
  const [upcomingAssessments, setUpcomingAssessments] = useState<Assessment[]>([]);
  
  useEffect(() => {
    // Extract upcoming assessments from provided subjects
    setUpcomingAssessments(getUpcomingAssessments(subjects));
  }, [subjects]);

  // Calcular promedio general
  const overallAverage = subjects.length > 0
    ? subjects.reduce((sum, subject) => sum + (subject.currentGrade || 0), 0) / subjects.length
    : 0;

  // Obtener materias en riesgo
  const atRiskSubjects = subjects.filter(isSubjectAtRisk);

  // Formatear fecha para mostrar
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    }).format(date);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Panel Principal</h1>
        <p className="text-gray-500 text-sm">Resumen de tu progreso académico</p>
      </header>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-white/50 border border-gray-100 shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-1">Promedio General</p>
            <div className="flex items-center">
              <BarChart2 className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{overallAverage.toFixed(1)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 border border-gray-100 shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-1">Materias</p>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{subjects.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso de materias */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Progreso de Materias</h2>
          <Button asChild variant="ghost" size="sm" className="text-indigo-600">
            <Link to="/subjects">Ver todas</Link>
          </Button>
        </div>
        
        <div className="space-y-3">
          {subjects.slice(0, 3).map((subject) => (
            <Link to={`/subjects/${subject.id}`} key={subject.id} className="block">
              <Card className="hover:shadow-md transition-all duration-200 border border-gray-100 bg-white/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: subject.color }}></div>
                      <h3 className="font-medium">{subject.name}</h3>
                    </div>
                    <span className="text-sm font-semibold">
                      {subject.currentGrade?.toFixed(1) || 'N/A'} / 100
                    </span>
                  </div>
                  <Progress 
                    value={subject.currentGrade} 
                    className={cn(
                      "h-2",
                      subject.currentGrade < (subject.targetGrade || 70) ? "bg-secondary [&>div]:bg-orange-500" : "bg-secondary [&>div]:bg-green-500"
                    )} 
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">{subject.code}</span>
                    <span className="text-xs text-gray-500">Meta: {subject.targetGrade}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {subjects.length > 3 && (
            <div className="flex justify-center mt-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/subjects">Ver todas las materias</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Próximas evaluaciones */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Próximas Evaluaciones</h2>
          <Button asChild variant="ghost" size="sm" className="text-indigo-600">
            <Link to="/assessments">Ver todas</Link>
          </Button>
        </div>
        
        {upcomingAssessments.length > 0 ? (
          <div className="space-y-3">
            {upcomingAssessments.slice(0, 3).map((assessment) => {
              const subject = subjects.find(s => s.id === assessment.subjectId);
              
              return (
                <Card key={assessment.id} className="hover:shadow-md transition-all duration
                -200 border border-gray-100 bg-white/50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{assessment.name}</h3>
                        <p className="text-sm text-gray-500">{subject?.name} • {assessment.type}</p>
                      </div>
                      <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(assessment.dueDate)}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Peso: {assessment.weight}%
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {upcomingAssessments.length > 3 && (
              <div className="flex justify-center mt-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/assessments">Ver todas las evaluaciones</Link>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card className="bg-gray-50/70 border border-gray'100">
            <CardContent className="p-6 text-center text-gray-500">
              No hay evaluaciones próximas en la siguiente semana.
            </CardContent>
          </Card>
        )}
      </section>

      {/* Materias en riesgo */}
      {atRiskSubjects.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
            Materias en Riesgo
          </h2>
          
          <div className="space-y-3">
            {atRiskSubjects.map((subject) => (
              <Card key={subject.id} className="border-l-4 border-l-red-500 border-y border-r border-gray-100 bg-white/50 hover:shadow-md transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{subject.name}</h3>
                      <p className="text-sm text-gray-500">
                        Actual: {subject.currentGrade?.toFixed(1)} / Meta: {subject.targetGrade}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                      <Link to={`/subjects/${subject.id}`}>
                        Ver detalles
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
