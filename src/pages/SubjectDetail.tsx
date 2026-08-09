import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  BarChart2, 
  Calendar, 
  ChevronLeft, 
  Edit, 
  GraduationCap, 
  Plus, 
  CheckCircle2,
  XCircle,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { generateMockSubjects, calculateSubjectGrade, predictFinalGrade } from "@/lib/mock-data";
import { Subject, Assessment } from "@/types";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { AddAssessmentDialog } from "@/components/AddAssessmentDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

interface SubjectDetailProps {
  subjects: Subject[];
  onDeleteSubject: (subjectId: string) => void;
  onAddAssessment: (subjectId: string, assessment: Partial<Assessment>) => void;
  onDeleteAssessment: (assessmentId: string, subjectId: string) => void;
  onToggleAssessmentCompleted: (assessmentId: string, subjectId: string, completed: boolean, grade?: number) => void;
}

const SubjectDetail = ({ 
  subjects, 
  onDeleteSubject, 
  onAddAssessment, 
  onDeleteAssessment, 
  onToggleAssessmentCompleted 
}: SubjectDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const foundSubject = subjects.find(s => s.id === id);
    
    if (foundSubject) {
      setSubject(foundSubject);
    }
    
    setLoading(false);
  }, [id, subjects]);

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (!subject) {
    return (
      <div className="p-6">
        <div className="mb-4">
          <Link to="/subjects" className="flex items-center text-blue-600 hover:underline">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver a Asignaturas
          </Link>
        </div>
        <div className="text-center py-10">
          <h2 className="text-xl font-bold mb-2">Asignatura no encontrada</h2>
          <p className="text-gray-500 mb-4">La asignatura que estás buscando no existe.</p>
          <Button asChild>
            <Link to="/subjects">Ver todas las asignaturas</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-ES', { 
      day: 'numeric', 
      month: 'short'
    }).format(date);
  };

  const completionPercentage = 
    (subject.assessments.filter(a => a.completed).length / subject.assessments.length) * 100;

  const predictedGrade = predictFinalGrade(subject);

  const gradeData = subject.assessments
    .filter(a => a.completed && a.grade !== undefined)
    .map(a => ({
      name: a.name,
      grade: a.grade,
      average: subject.currentGrade
    }));

  const assessmentTypeData = [
    {
      name: 'Exámenes',
      value: subject.assessments
        .filter(a => a.type === 'exam' || a.type === 'midterm' || a.type === 'final')
        .reduce((sum, a) => sum + a.weight, 0)
    },
    {
      name: 'Tareas',
      value: subject.assessments
        .filter(a => a.type === 'assignment')
        .reduce((sum, a) => sum + a.weight, 0)
    },
    {
      name: 'Proyectos',
      value: subject.assessments
        .filter(a => a.type === 'project')
        .reduce((sum, a) => sum + a.weight, 0)
    },
    {
      name: 'Quizzes',
      value: subject.assessments
        .filter(a => a.type === 'quiz')
        .reduce((sum, a) => sum + a.weight, 0)
    },
    {
      name: 'Otros',
      value: subject.assessments
        .filter(a => a.type === 'other')
        .reduce((sum, a) => sum + a.weight, 0)
    }
  ].filter(item => item.value > 0);

  const COLORS = ['#4338ca', '#16a34a', '#d97706', '#be185d', '#475569'];

  const handleAddAssessment = (subjectId: string, newAssessment: Partial<Assessment>) => {
    onAddAssessment(subjectId, newAssessment);
  };

  const handleDeleteAssessment = (assessmentId: string) => {
    if (!subject) return;
    onDeleteAssessment(assessmentId, subject.id);
  };

  const handleToggleAssessmentCompleted = (assessmentId: string, completed: boolean, grade?: number) => {
    if (!subject) return;
    
    let validGrade = grade;
    if (validGrade !== undefined && validGrade > 20) {
      validGrade = 20;
      toast({
        title: "Nota máxima excedida",
        description: "La nota ha sido ajustada al máximo de 20 puntos.",
        variant: "warning"
      });
    }
    
    onToggleAssessmentCompleted(assessmentId, subject.id, completed, validGrade);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link to="/subjects" className="flex items-center text-blue-600 hover:underline mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver a Asignaturas
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <div className="w-4 h-8 rounded-sm mr-3" style={{ backgroundColor: subject.color }}></div>
              <h1 className="text-2xl font-bold">{subject.name}</h1>
            </div>
            <p className="text-gray-500 mt-1">{subject.code} • {subject.professor}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/calendar">
                <Calendar className="h-4 w-4 mr-1" />
                Ver Calendario
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-1">Calificación Actual</p>
            <div className="flex items-center">
              <GraduationCap className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xl font-bold">{subject.currentGrade?.toFixed(1)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-1">Meta</p>
            <div className="flex items-center">
              <BarChart2 className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-xl font-bold">{subject.targetGrade}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-1">Predicción Final</p>
            <div className="flex items-center">
              <GraduationCap className="h-4 w-4 text-orange-600 mr-2" />
              <span className="text-xl font-bold">{predictedGrade.toFixed(1)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-1">Completado</p>
            <div className="flex items-center">
              <span className="text-xl font-bold">{completionPercentage.toFixed(0)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="evaluations">
        <TabsList className="mb-6">
          <TabsTrigger value="evaluations">Evaluaciones</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="evaluations">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Evaluaciones</h2>
            <AddAssessmentDialog 
              subject={subject}
              onAddAssessment={handleAddAssessment}
            />
          </div>
          
          <div className="space-y-4">
            {subject.assessments.sort((a, b) => {
              if (a.completed && !b.completed) return 1;
              if (!a.completed && b.completed) return -1;
              
              if (a.dueDate && b.dueDate) {
                return a.dueDate.getTime() - b.dueDate.getTime();
              }
              
              return 0;
            }).map(assessment => (
              <Card key={assessment.id} className={`${assessment.completed ? 'bg-gray-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={assessment.completed}
                        onChange={(e) => {
                          handleToggleAssessmentCompleted(assessment.id, e.target.checked);
                          toast({
                            title: e.target.checked ? "Evaluación completada" : "Evaluación pendiente",
                            description: `${assessment.name} ha sido marcada como ${e.target.checked ? 'completada' : 'pendiente'}.`,
                          });
                        }}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      
                      <div className="ml-3">
                        <h3 className={`font-medium ${assessment.completed ? 'line-through text-gray-500' : ''}`}>
                          {assessment.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">{assessment.type}</p>
                        {assessment.description && (
                          <p className="text-xs text-gray-500 mt-1">{assessment.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {assessment.completed && assessment.grade !== undefined ? (
                        <div>
                          <span className={`text-lg font-bold ${assessment.grade / assessment.maxGrade >= 0.7 ? 'text-green-600' : 'text-orange-600'}`}>
                            {assessment.grade}
                          </span>
                          <span className="text-sm text-gray-500">/{assessment.maxGrade}</span>
                        </div>
                      ) : (
                        assessment.dueDate && (
                          <div className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(assessment.dueDate)}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-xs text-gray-500">
                      Peso: {assessment.weight}%
                    </div>
                    <div className="flex space-x-2">
                      {assessment.completed ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            className="w-16 h-7 px-2 text-sm border rounded"
                            value={assessment.grade || ''}
                            onChange={(e) => {
                              const grade = parseFloat(e.target.value);
                              if (!isNaN(grade) && grade >= 0 && grade <= 20) {
                                handleToggleAssessmentCompleted(assessment.id, true, grade);
                              }
                            }}
                            min="0"
                            max="20"
                            step="0.1"
                            placeholder="Nota"
                          />
                          <span className="text-xs text-gray-500">/ {assessment.maxGrade}</span>
                        </div>
                      ) : (
                        <button 
                          className="text-xs text-blue-600 hover:underline"
                          onClick={() => {
                            handleToggleAssessmentCompleted(assessment.id, true);
                            toast({
                              title: "Evaluación completada",
                              description: `${assessment.name} ha sido marcada como completada.`,
                            });
                          }}
                        >
                          Completar
                        </button>
                      )}
                      <DeleteConfirmDialog 
                        title="Eliminar evaluación"
                        description={`¿Estás seguro de que quieres eliminar "${assessment.name}"? Esta acción no se puede deshacer.`}
                        onConfirm={() => {
                          handleDeleteAssessment(assessment.id);
                          toast({
                            title: "Evaluación eliminada",
                            description: `Se ha eliminado "${assessment.name}" correctamente.`,
                          });
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Historial de Calificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                {gradeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={gradeData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="grade" fill="#4338ca" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-500">
                    No hay datos suficientes
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribución de Evaluaciones</CardTitle>
              </CardHeader>
              <CardContent>
                {assessmentTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Pie
                        data={assessmentTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {assessmentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-gray-500">
                    No hay datos suficientes
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Progreso hacia Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Calificación Actual</span>
                      <span>{subject.currentGrade?.toFixed(1) || 0}/100</span>
                    </div>
                    <Progress 
                      value={subject.currentGrade} 
                      max={100}
                      className="h-3"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Meta</span>
                      <span>{subject.targetGrade}/100</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full">
                      <div 
                        className="h-full bg-green-100 rounded-full"
                        style={{ width: `${subject.targetGrade}%` }}
                      >
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${Math.min(100, (subject.currentGrade || 0) / (subject.targetGrade || 100) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-gray-700 mb-2">Necesitas:</p>
                    {subject.currentGrade !== undefined && subject.targetGrade !== undefined ? (
                      subject.currentGrade >= subject.targetGrade ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span>¡Ya alcanzaste tu meta!</span>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <p>
                            Necesitas un mínimo de <strong>{
                              Math.max(0, 
                                Math.ceil(
                                  (subject.targetGrade - 
                                    ((subject.currentGrade * (subject.assessments.filter(a => a.completed).reduce((sum, a) => sum + a.weight, 0))) / 100)
                                  ) / (subject.assessments.filter(a => !a.completed).reduce((sum, a) => sum + a.weight, 0) / 100)
                                )
                              )
                            }%</strong> en las evaluaciones restantes para alcanzar tu meta.
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="text-gray-500">No hay datos suficientes</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estado de Finalización</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Progreso General</span>
                    <span>{completionPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-3" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Completadas</span>
                    <span>{subject.assessments.filter(a => a.completed).length} evaluaciones</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pendientes</span>
                    <span>{subject.assessments.filter(a => !a.completed).length} evaluaciones</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Próxima evaluación</span>
                    <span>
                      {(() => {
                        const nextAssessment = subject.assessments
                          .filter(a => !a.completed && a.dueDate)
                          .sort((a, b) => {
                            if (a.dueDate && b.dueDate) {
                              return a.dueDate.getTime() - b.dueDate.getTime();
                            }
                            return 0;
                          })[0];
                        
                        return nextAssessment ? formatDate(nextAssessment.dueDate) : 'N/A';
                      })()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="resources">
          <div className="text-center py-16">
            <h3 className="text-lg font-medium mb-2">Próximamente</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Los recursos y materiales de estudio para esta asignatura estarán disponibles en la próxima actualización.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubjectDetail;
