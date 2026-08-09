
import { useState, useEffect } from "react";
import { Calendar, CheckCircle2, ChevronLeft, Search, AlertTriangle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Subject, Assessment } from "@/types";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AddAssessmentDialog } from "@/components/AddAssessmentDialog";

interface AssessmentsProps {
  subjects: Subject[];
  onAddAssessment: (subjectId: string, assessment: Partial<Assessment>) => void;
  onDeleteAssessment: (assessmentId: string, subjectId: string) => void;
  onToggleAssessmentCompleted: (assessmentId: string, subjectId: string, completed: boolean, grade?: number) => void;
}

const Assessments = ({ 
  subjects,
  onAddAssessment,
  onDeleteAssessment,
  onToggleAssessmentCompleted
}: AssessmentsProps) => {
  const [assessments, setAssessments] = useState<(Assessment & { subject?: Subject })[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedSubjectForAssessment, setSelectedSubjectForAssessment] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Extract all assessments
    const allAssessments = subjects.flatMap(subject => 
      subject.assessments.map(assessment => ({
        ...assessment,
        subject
      }))
    );
    
    setAssessments(allAssessments);
  }, [subjects]);

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-ES', { 
      day: 'numeric', 
      month: 'short'
    }).format(date);
  };

  // Helper to get subject by id
  const getSubjectById = (id: string): Subject | undefined => {
    return subjects.find(s => s.id === id);
  };

  // Check if adding a new assessment would exceed 100% total weight
  const validateAssessmentWeight = (subjectId: string, newWeight: number): boolean => {
    const subject = getSubjectById(subjectId);
    if (!subject) return false;
    
    const currentTotalWeight = subject.assessments.reduce((total, assessment) => total + assessment.weight, 0);
    return currentTotalWeight + newWeight <= 100;
  };
  
  // Custom handler to validate weight before adding assessment
  const handleAddAssessment = (subjectId: string, assessment: Partial<Assessment>) => {
    if (!validateAssessmentWeight(subjectId, assessment.weight || 0)) {
      toast({
        title: "Error al añadir evaluación",
        description: "El peso total de las evaluaciones no puede superar el 100%",
        variant: "destructive",
      });
      return;
    }
    
    onAddAssessment(subjectId, assessment);
    toast({
      title: "Evaluación añadida",
      description: `Se ha añadido "${assessment.name}" correctamente.`,
    });
  };

  // Filter assessments based on search and filters
  const filteredAssessments = assessments.filter((assessment: Assessment & { subject?: Subject }) => {
    const matchesSearch = assessment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = filterSubject === "all" || assessment.subjectId === filterSubject;
    
    const matchesType = filterType === "all" || assessment.type === filterType;
    
    return matchesSearch && matchesSubject && matchesType;
  });

  // Group upcoming assessments by date
  const today = new Date();
  const groupedUpcoming = filteredAssessments
    .filter(a => !a.completed && a.dueDate && a.dueDate >= today)
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      return 0;
    })
    .reduce((groups, assessment) => {
      if (!assessment.dueDate) return groups;
      
      const dateStr = assessment.dueDate.toDateString();
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(assessment);
      return groups;
    }, {} as Record<string, Assessment[]>);

  // Get past assessments
  const pastAssessments = filteredAssessments
    .filter(a => (a.completed || (a.dueDate && a.dueDate < today)))
    .sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return b.dueDate.getTime() - a.dueDate.getTime(); // Most recent first
      }
      return 0;
    });
    
  const goBackToSubjects = () => {
    navigate('/subjects');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6">
        <Button 
          variant="outline" 
          onClick={goBackToSubjects}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver a Materias
        </Button>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Evaluaciones</h1>
            <p className="text-gray-500">Gestiona todas tus evaluaciones</p>
          </div>
          
          <div>
            <Select
              value={selectedSubjectForAssessment || ""}
              onValueChange={(value) => setSelectedSubjectForAssessment(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar materia" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedSubjectForAssessment && (
              <AddAssessmentDialog 
                subject={getSubjectById(selectedSubjectForAssessment)!} 
                onAddAssessment={(subjectId, assessment) => handleAddAssessment(subjectId, assessment)}
              />
            )}
          </div>
        </div>
      </header>

      {/* Search and filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Buscar evaluaciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[120px]">
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Asignatura" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las asignaturas</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[120px]">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="exam">Exámenes</SelectItem>
                <SelectItem value="quiz">Quizzes</SelectItem>
                <SelectItem value="assignment">Tareas</SelectItem>
                <SelectItem value="project">Proyectos</SelectItem>
                <SelectItem value="midterm">Parciales</SelectItem>
                <SelectItem value="final">Finales</SelectItem>
                <SelectItem value="other">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" className="flex-none">
            <Filter className="h-4 w-4 mr-1" />
            Más Filtros
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="past">Completadas</TabsTrigger>
        </TabsList>
        
        {/* Upcoming Tab */}
        <TabsContent value="upcoming">
          {Object.keys(groupedUpcoming).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedUpcoming).map(([dateStr, dayAssessments]) => {
                const date = new Date(dateStr);
                const isToday = new Date().toDateString() === dateStr;
                const isTomorrow = new Date(Date.now() + 86400000).toDateString() === dateStr;
                
                let dateLabel = '';
                if (isToday) dateLabel = 'Hoy';
                else if (isTomorrow) dateLabel = 'Mañana';
                else dateLabel = formatDate(date);
                
                return (
                  <div key={dateStr}>
                    <div className="flex items-center mb-3">
                      <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                      <h3 className="font-medium">{dateLabel}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {dayAssessments.map(assessment => {
                        const subject = getSubjectById(assessment.subjectId);
                        
                        return (
                          <Card key={assessment.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex items-start">
                                  {subject && (
                                    <div 
                                      className="w-3 h-10 rounded-sm mr-3 mt-0.5"
                                      style={{ backgroundColor: subject.color }}
                                    ></div>
                                  )}
                                  
                                  <div>
                                    <h3 className="font-medium">{assessment.name}</h3>
                                    <p className="text-sm text-gray-500">
                                      {subject?.name} • <span className="capitalize">{assessment.type}</span>
                                    </p>
                                    {assessment.description && (
                                      <p className="text-xs text-gray-500 mt-1">{assessment.description}</p>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="text-xs text-gray-500 mb-1">
                                    Peso: {assessment.weight}%
                                  </div>
                                  <Link 
                                    to={`/subjects/${assessment.subjectId}`}
                                    className="flex items-center text-blue-600 text-xs hover:underline"
                                  >
                                    Ver materia
                                    <ChevronLeft className="h-3 w-3 ml-1" />
                                  </Link>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-md">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-600">No hay evaluaciones próximas</h3>
              <p className="text-gray-500 mb-4">Puedes añadir nuevas evaluaciones desde la página de asignaturas.</p>
            </div>
          )}
        </TabsContent>
        
        {/* Past Tab */}
        <TabsContent value="past">
          {pastAssessments.length > 0 ? (
            <div className="space-y-3">
              {pastAssessments.map(assessment => {
                const subject = getSubjectById(assessment.subjectId);
                
                return (
                  <Card key={assessment.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          {assessment.completed && (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                          )}
                          
                          {subject && (
                            <div 
                              className="w-3 h-10 rounded-sm mr-3 mt-0.5"
                              style={{ backgroundColor: subject.color }}
                            ></div>
                          )}
                          
                          <div>
                            <h3 className="font-medium">{assessment.name}</h3>
                            <p className="text-sm text-gray-500">
                              {subject?.name} • <span className="capitalize">{assessment.type}</span>
                            </p>
                            {assessment.dueDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Fecha: {formatDate(assessment.dueDate)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {assessment.grade !== undefined ? (
                            <div>
                              <span className={`text-lg font-bold ${assessment.grade >= 10 ? 'text-green-600' : 'text-orange-600'}`}>
                                {assessment.grade.toFixed(1)}
                              </span>
                              <span className="text-sm text-gray-500">/20</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Sin calificación</span>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            Peso: {assessment.weight}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-md">
              <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-600">No hay evaluaciones completadas</h3>
              <p className="text-gray-500">Aquí verás tus evaluaciones una vez las completes.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assessments;
