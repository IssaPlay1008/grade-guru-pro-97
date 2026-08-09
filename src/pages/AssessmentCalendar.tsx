
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Subject, Assessment } from "@/types";
import { format, getDay, startOfToday, eachDayOfInterval, startOfMonth, endOfMonth, isToday, isSameMonth, addMonths, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface AssessmentCalendarProps {
  subjects: Subject[];
  onAddAssessment: (subjectId: string, assessment: Partial<Assessment>) => void;
  onDeleteAssessment: (assessmentId: string, subjectId: string) => void;
  onToggleAssessmentCompleted: (assessmentId: string, subjectId: string, completed: boolean, grade?: number) => void;
}

const AssessmentCalendar = ({
  subjects,
  onAddAssessment,
  onDeleteAssessment,
  onToggleAssessmentCompleted,
}: AssessmentCalendarProps) => {
  const [today] = useState(startOfToday());
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today);
  const [assessmentsByDate, setAssessmentsByDate] = useState<Record<string, (Assessment & { subject: Subject })[]>>({});
  const [showAddAssessmentDialog, setShowAddAssessmentDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Organize assessments by date
    const assessmentMap: Record<string, (Assessment & { subject: Subject })[]> = {};
    
    subjects.forEach((subject) => {
      subject.assessments.forEach((assessment) => {
        if (assessment.dueDate) {
          const dateStr = format(assessment.dueDate, "yyyy-MM-dd");
          if (!assessmentMap[dateStr]) {
            assessmentMap[dateStr] = [];
          }
          assessmentMap[dateStr].push({ ...assessment, subject });
        }
      });
    });
    
    setAssessmentsByDate(assessmentMap);
  }, [subjects]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToSubjects = () => {
    navigate('/subjects');
  };

  const getAssessmentsForDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return assessmentsByDate[dateStr] || [];
  };

  const selectedDayAssessments = getAssessmentsForDay(selectedDay);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={goToSubjects} 
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver a Materias
        </Button>
        <h1 className="text-2xl font-bold">Calendario de Evaluaciones</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between bg-white rounded-t-lg border border-b-0 p-4">
            <h2 className="font-semibold">
              {format(currentMonth, "MMMM yyyy", { locale: es })}
            </h2>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="icon"
                onClick={previousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="bg-white border rounded-b-lg p-4">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map((day) => (
                <div key={day} className="text-center text-sm font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {daysInMonth.map((day) => {
                const dateAssessments = getAssessmentsForDay(day);
                const isSelected = format(selectedDay, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
                const hasAssessments = dateAssessments.length > 0;
                
                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDay(day)}
                    className={`
                      relative h-12 rounded-md flex flex-col items-center justify-center
                      ${!isSameMonth(day, currentMonth) ? "text-gray-300" : ""}
                      ${isToday(day) ? "bg-blue-50 text-blue-600 font-bold" : ""}
                      ${isSelected ? "ring-2 ring-blue-500" : "hover:bg-gray-50"}
                    `}
                  >
                    <span className="text-sm">{format(day, "d")}</span>
                    
                    {hasAssessments && (
                      <div className="absolute bottom-1 flex space-x-1">
                        {dateAssessments.length > 3 ? (
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                        ) : (
                          dateAssessments.slice(0, 3).map((assessment, idx) => (
                            <span
                              key={idx}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: assessment.subject.color }}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="font-semibold">
                  {format(selectedDay, "EEEE, d 'de' MMMM", { locale: es })}
                </h2>
              </div>
            </div>
            
            {selectedDayAssessments.length > 0 ? (
              <div className="space-y-3">
                {selectedDayAssessments.map((assessment) => (
                  <Card key={assessment.id} className="overflow-hidden">
                    <div
                      className="h-1.5 w-full"
                      style={{ backgroundColor: assessment.subject.color }}
                    ></div>
                    <CardContent className="p-3">
                      <div className="font-medium">{assessment.name}</div>
                      <div className="text-sm text-gray-500">
                        {assessment.subject.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {assessment.type} • {assessment.weight}%
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No hay evaluaciones para este día</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCalendar;
