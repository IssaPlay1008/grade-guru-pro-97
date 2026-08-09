
import { useState } from "react";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, BookOpen, Calendar, Tag } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Subject } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AddSubjectDialog } from "@/components/AddSubjectDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { EvaluationPlan } from "@/components/EvaluationPlan";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface SubjectsProps {
  subjects: Subject[];
  onAddSubject: (subject: Partial<Subject>) => void;
  onDeleteSubject: (subjectId: string) => void;
  onAddAssessment: (subjectId: string, assessment: Partial<Assessment>) => void;
}

const isSubjectPassing = (grade?: number) => {
  if (grade === undefined) return false;
  return grade >= 10;
};

const Subjects = ({ subjects, onAddSubject, onDeleteSubject, onAddAssessment }: SubjectsProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentSemester, setCurrentSemester] = useState("Primavera");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { id: subjectId } = useParams<{ id: string }>();
  
  // Find the current subject if we're on a subject detail page
  const currentSubject = subjectId ? subjects.find(s => s.id === subjectId) : null;

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = 
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (subject.code && subject.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (subject.professor && subject.professor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (subject.tags && subject.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesSemester = subject.semester === currentSemester && subject.year === currentYear;
    
    return matchesSearch && matchesSemester;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <header className={`flex ${isMobile ? 'flex-col space-y-3' : 'justify-between items-center'} mb-6`}>
        <div>
          <h1 className="text-2xl font-bold">Asignaturas</h1>
          <p className="text-gray-500">Gestiona tus materias y evaluaciones</p>
        </div>
        <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-2'}`}>
          <AddSubjectDialog onAddSubject={onAddSubject} />
          <Button variant="outline" onClick={() => navigate('/calendar')}>
            <Calendar className="h-4 w-4 mr-1" />
            Ver Calendario
          </Button>
        </div>
      </header>

      {/* Show EvaluationPlan component when on a subject detail page */}
      {currentSubject && (
        <EvaluationPlan subject={currentSubject} onAddAssessment={onAddAssessment} />
      )}

      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-9"
            placeholder="Buscar por nombre, código, profesor o etiquetas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="current">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Semestre Actual</TabsTrigger>
            <TabsTrigger value="all">Todos los Semestres</TabsTrigger>
          </TabsList>
          <TabsContent value="current" className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium">{currentSemester} {currentYear}</span>
              </div>
            </div>
            <SubjectsList 
              subjects={filteredSubjects} 
              onDeleteSubject={onDeleteSubject}
              onAddSubject={onAddSubject}
            />
          </TabsContent>
          <TabsContent value="all" className="mt-4">
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-2'} mb-4`}>
              <select 
                className="border rounded-md p-2 text-sm"
                value={currentSemester}
                onChange={(e) => setCurrentSemester(e.target.value)}
              >
                <option value="Primavera">Primavera</option>
                <option value="Verano">Verano</option>
                <option value="Otoño">Otoño</option>
                <option value="Invierno">Invierno</option>
              </select>
              <select 
                className="border rounded-md p-2 text-sm"
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <SubjectsList 
              subjects={filteredSubjects} 
              onDeleteSubject={onDeleteSubject}
              onAddSubject={onAddSubject}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const SubjectsList = ({ 
  subjects,
  onDeleteSubject,
  onAddSubject
}: { 
  subjects: Subject[],
  onDeleteSubject: (subjectId: string) => void,
  onAddSubject: (subject: Partial<Subject>) => void
}) => {
  const isMobile = useIsMobile();
  
  if (subjects.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-md">
        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-600">No hay asignaturas</h3>
        <p className="text-gray-500 mb-4">Añade tu primera asignatura para comenzar</p>
        <AddSubjectDialog onAddSubject={onAddSubject} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Asignatura</TableHead>
            <TableHead>Profesor</TableHead>
            <TableHead>Progreso</TableHead>
            <TableHead className="text-right">Nota</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map(subject => (
            <TableRow key={subject.id} className="hover:bg-gray-50">
              <TableCell>
                <Link to={`/subjects/${subject.id}`} className="flex items-center">
                  <div className="w-3 h-10 rounded-sm mr-3" style={{ backgroundColor: subject.color }}></div>
                  <div>
                    <div className="font-medium">{subject.name}</div>
                    <div className="text-xs text-gray-500">{subject.code}</div>
                    {subject.tags && subject.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {subject.tags.map(tag => (
                          <div key={tag} className="flex items-center text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-full">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <span className="text-sm">{subject.professor || "Sin asignar"}</span>
              </TableCell>
              <TableCell>
                <div className="w-full">
                  <div className="text-xs text-gray-500 mb-1">
                    {subject.assessments.filter(a => a.completed).length} / {subject.assessments.length}
                  </div>
                  <Progress 
                    value={(subject.assessments.filter(a => a.completed).length / Math.max(1, subject.assessments.length)) * 100} 
                    className="h-2 w-full" 
                  />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className={`text-base font-bold ${
                  isSubjectPassing(subject.currentGrade) ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {subject.currentGrade !== undefined ? subject.currentGrade.toFixed(1) : 'N/A'}/20
                </div>
                <div className="text-xs text-gray-500">
                  Meta: {subject.targetGrade}/20
                </div>
              </TableCell>
              <TableCell>
                <DeleteConfirmDialog 
                  title="Eliminar materia"
                  description={`¿Estás seguro de que quieres eliminar "${subject.name}"? Esta acción eliminará todas las evaluaciones asociadas y no se puede deshacer.`}
                  onConfirm={() => onDeleteSubject(subject.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Subjects;
