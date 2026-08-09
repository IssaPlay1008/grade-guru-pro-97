
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, BarChart2, AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { Subject } from "@/types";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ReferenceLine
} from "recharts";
import { Link } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface GradesProps {
  subjects: Subject[];
}

const Grades = ({ subjects }: GradesProps) => {
  const [selectedSemester, setSelectedSemester] = useState("Primavera");
  const [selectedYear, setSelectedYear] = useState(2025);

  // Filter subjects by semester and year
  const filteredSubjects = subjects.filter(
    subject => subject.semester === selectedSemester && subject.year === selectedYear
  );

  // Calculate average grades
  const overallAverage = filteredSubjects.length > 0
    ? filteredSubjects.reduce((sum, subject) => sum + (subject.currentGrade || 0), 0) / filteredSubjects.length
    : 0;

  // Prepare data for line chart - adaptados a escala vigesimal
  const simulateHistoricalData = (subjects: Subject[]) => {
    const currentSemesterData = subjects.map(subject => ({
      name: subject.name,
      grade: subject.currentGrade,
      target: subject.targetGrade
    }));
    
    // Simulate previous semester with slight variations
    const prevSemesterData = subjects.map(subject => ({
      name: subject.name,
      grade: (subject.currentGrade || 0) * (0.9 + Math.random() * 0.2), // 90-110% of current grade
      semester: 'Anterior'
    }));
    
    return { current: currentSemesterData, previous: prevSemesterData };
  };

  const historicalData = simulateHistoricalData(filteredSubjects);

  // Prepare combined data for bar chart
  const gradeComparisonData = filteredSubjects.map(subject => ({
    name: subject.name,
    actual: subject.currentGrade,
    target: subject.targetGrade,
  }));

  // Identify subjects with improvement or decline
  const improvingSubjects = filteredSubjects.filter((subject, index) => {
    const previousGrade = historicalData.previous[index]?.grade || 0;
    return (subject.currentGrade || 0) > previousGrade;
  });
  
  const decliningSubjects = filteredSubjects.filter((subject, index) => {
    const previousGrade = historicalData.previous[index]?.grade || 0;
    return (subject.currentGrade || 0) < previousGrade;
  });

  // Calcular si una asignatura está aprobada (nota >= 10 en escala vigesimal)
  const isSubjectPassing = (grade?: number) => {
    if (grade === undefined) return false;
    return grade >= 10;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Calificaciones</h1>
        <p className="text-gray-500">Análisis de tu rendimiento académico</p>
      </header>

      {/* Semester selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex-1 min-w-[120px]">
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger>
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Primavera">Primavera</SelectItem>
              <SelectItem value="Verano">Verano</SelectItem>
              <SelectItem value="Otoño">Otoño</SelectItem>
              <SelectItem value="Invierno">Invierno</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 min-w-[120px]">
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-1">Promedio General</p>
            <div className="flex items-center">
              <BarChart2 className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xl font-bold">{overallAverage.toFixed(1)}/20</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-1">Materias</p>
            <div className="flex items-center">
              <Book className="h-4 w-4 text-indigo-600 mr-2" />
              <span className="text-xl font-bold">{filteredSubjects.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-1">Mejorando</p>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-xl font-bold">{improvingSubjects.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-1">Retrocediendo</p>
            <div className="flex items-center">
              <TrendingDown className="h-4 w-4 text-orange-600 mr-2" />
              <span className="text-xl font-bold">{decliningSubjects.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Grade Overview Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Calificaciones vs Objetivos</CardTitle>
          </CardHeader>
          <CardContent>
            {gradeComparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeComparisonData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 20]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actual" name="Calificación Actual" fill="#4338ca" />
                  <Bar dataKey="target" name="Objetivo" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No hay datos suficientes
              </div>
            )}
          </CardContent>
        </Card>

        {/* Semester Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparación con Semestre Anterior</CardTitle>
          </CardHeader>
          <CardContent>
            {historicalData.current.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" type="category" allowDuplicatedCategory={false} />
                  <YAxis domain={[0, 20]} />
                  <Tooltip />
                  <Legend />
                  <ReferenceLine y={10} stroke="#d1d5db" strokeDasharray="3 3" label="Aprobado" />
                  <Line 
                    dataKey="grade" 
                    data={historicalData.current} 
                    name="Semestre Actual" 
                    stroke="#4338ca" 
                    strokeWidth={2}
                    dot={{ r: 5 }}
                  />
                  <Line 
                    dataKey="grade" 
                    data={historicalData.previous} 
                    name="Semestre Anterior" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No hay datos suficientes
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subject Grades List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalle de Calificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubjects.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asignatura</TableHead>
                    <TableHead>Profesor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Nota actual</TableHead>
                    <TableHead className="text-right">Meta</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.sort((a, b) => 
                    (b.currentGrade || 0) - (a.currentGrade || 0)
                  ).map((subject) => {
                    const previousIndex = historicalData.previous.findIndex(s => s.name === subject.name);
                    const previousGrade = previousIndex >= 0 ? historicalData.previous[previousIndex].grade : 0;
                    const isImproving = (subject.currentGrade || 0) > previousGrade;
                    const isDeclining = (subject.currentGrade || 0) < previousGrade;
                    
                    return (
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
                                    <div key={tag} className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-full">
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
                          <div className="flex items-center">
                            {isDeclining && (
                              <TrendingDown className="h-4 w-4 text-orange-500 mr-1" />
                            )}
                            {isImproving && (
                              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            )}
                            <span className={`text-sm px-2 py-0.5 rounded-full ${
                              isSubjectPassing(subject.currentGrade) ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                            }`}>
                              {isSubjectPassing(subject.currentGrade) ? 'Aprobado' : 'Desaprobado'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          <span className={isSubjectPassing(subject.currentGrade) ? 'text-green-600' : 'text-orange-600'}>
                            {subject.currentGrade?.toFixed(1) || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-gray-600">
                          {subject.targetGrade?.toFixed(1) || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Link to={`/subjects/${subject.id}`} className="text-gray-400 hover:text-gray-700">
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertTriangle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-600">No hay asignaturas</h3>
              <p className="text-gray-500">
                No hay asignaturas registradas para {selectedSemester} {selectedYear}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Grades;
