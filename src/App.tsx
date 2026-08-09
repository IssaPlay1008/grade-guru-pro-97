
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "./components/ui/toaster";
import LayoutWrapper from "./components/LayoutWrapper";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import SubjectDetail from "./pages/SubjectDetail";
import Assessments from "./pages/Assessments";
import Grades from "./pages/Grades";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import AssessmentCalendar from "./pages/AssessmentCalendar";
import { useState, useEffect } from "react";
import { Subject, Assessment, UserPreferences } from "./types";
import { generateMockSubjects, calculateSubjectGrade } from "./lib/mock-data";
import { useIsMobile } from "./hooks/use-mobile";

// Default user preferences
const defaultPreferences: UserPreferences = {
  language: "es",
  gradeFormat: "twenty",
  theme: "indigo",
  darkMode: false,
  largeText: false,
  animations: true,
  notificationsEnabled: true,
  emailNotifications: true,
  autoBackup: true,
};

// Create the query client for React Query
const queryClient = new QueryClient();

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);
  const isMobile = useIsMobile();

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedSubjects = localStorage.getItem('subjects');
    const storedPreferences = localStorage.getItem('userPreferences');
    
    if (storedSubjects) {
      // Parse the dates properly from localStorage
      const parsedSubjects = JSON.parse(storedSubjects, (key, value) => {
        if (key === 'dueDate' && value) {
          return new Date(value);
        }
        return value;
      });
      setSubjects(parsedSubjects);
    } else {
      // Generate mock data if no stored data
      const mockSubjects = generateMockSubjects();
      const updatedSubjects = mockSubjects.map(subject => ({
        ...subject,
        currentGrade: calculateSubjectGrade(subject)
      }));
      setSubjects(updatedSubjects);
    }
    
    if (storedPreferences) {
      setUserPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem('subjects', JSON.stringify(subjects));
    }
  }, [subjects]);
  
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    
    // Apply theme based on preferences
    document.documentElement.classList.toggle('dark', userPreferences.darkMode);
    document.documentElement.classList.toggle('text-lg', userPreferences.largeText);
    
    // Apply theme color as CSS variable
    document.documentElement.style.setProperty('--theme-color', getThemeColor(userPreferences.theme));
    document.documentElement.dataset.theme = userPreferences.theme;
  }, [userPreferences]);

  // Get theme color based on theme name
  const getThemeColor = (theme: string): string => {
    const themeColors: Record<string, string> = {
      indigo: '#4338ca',
      blue: '#2563eb',
      green: '#16a34a',
      red: '#dc2626',
      purple: '#9333ea',
      pink: '#db2777',
      orange: '#ea580c',
      amber: '#d97706'
    };
    
    return themeColors[theme] || themeColors.indigo;
  };

  // Handler for updating user preferences
  const handleUpdatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  };

  // Handler for adding subjects
  const handleAddSubject = (newSubject: Partial<Subject>) => {
    const subjectToAdd: Subject = {
      id: `${Date.now()}`,
      name: newSubject.name || "Nueva Materia",
      code: newSubject.code || "",
      professor: newSubject.professor || "",
      color: newSubject.color || "#4338ca",
      credits: newSubject.credits || 3,
      gradeFormat: "twenty",
      targetGrade: newSubject.targetGrade || 14,
      currentGrade: 0,
      assessments: [],
      semester: newSubject.semester || "Primavera",
      year: newSubject.year || 2025,
      tags: newSubject.tags || []
    };
    
    setSubjects(prev => [...prev, subjectToAdd]);
  };

  // Handler for deleting subjects
  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
  };

  // Handler for adding assessments
  const handleAddAssessment = (subjectId: string, newAssessment: Partial<Assessment>) => {
    setSubjects(prev => {
      const updatedSubjects = prev.map(subject => {
        if (subject.id === subjectId) {
          const assessmentToAdd: Assessment = {
            id: `${subjectId}-${Date.now()}`,
            subjectId: subjectId,
            name: newAssessment.name || "Nueva Evaluación",
            type: newAssessment.type || "exam",
            weight: newAssessment.weight || 25,
            dueDate: newAssessment.dueDate,
            maxGrade: 20,
            completed: newAssessment.completed || false,
            description: newAssessment.description,
          };
          
          const updatedSubject = {
            ...subject,
            assessments: [...subject.assessments, assessmentToAdd]
          };
          
          // Recalcular la calificación actual
          updatedSubject.currentGrade = calculateSubjectGrade(updatedSubject);
          
          return updatedSubject;
        }
        return subject;
      });
      
      return updatedSubjects;
    });
  };

  // Handler for deleting assessments
  const handleDeleteAssessment = (assessmentId: string, subjectId: string) => {
    setSubjects(prev => {
      const updatedSubjects = prev.map(subject => {
        if (subject.id === subjectId) {
          const updatedAssessments = subject.assessments.filter(
            assessment => assessment.id !== assessmentId
          );
          
          const updatedSubject = {
            ...subject,
            assessments: updatedAssessments
          };
          
          // Recalcular la calificación actual
          updatedSubject.currentGrade = calculateSubjectGrade(updatedSubject);
          
          return updatedSubject;
        }
        return subject;
      });
      
      return updatedSubjects;
    });
  };

  // Handler for marking assessments as completed/pending
  const handleToggleAssessmentCompleted = (assessmentId: string, subjectId: string, completed: boolean, grade?: number) => {
    setSubjects(prev => {
      const updatedSubjects = prev.map(subject => {
        if (subject.id === subjectId) {
          const updatedAssessments = subject.assessments.map(assessment => {
            if (assessment.id === assessmentId) {
              // Asegurarse de que la nota no exceda 20 puntos
              let validGrade = grade;
              if (validGrade && validGrade > 20) {
                validGrade = 20;
              }
              
              return {
                ...assessment,
                completed,
                grade: validGrade !== undefined ? validGrade : assessment.grade
              };
            }
            return assessment;
          });
          
          const updatedSubject = {
            ...subject,
            assessments: updatedAssessments
          };
          
          // Recalcular la calificación actual
          updatedSubject.currentGrade = calculateSubjectGrade(updatedSubject);
          
          return updatedSubject;
        }
        return subject;
      });
      
      return updatedSubjects;
    });
  };

  // Create the router
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutWrapper />,
      children: [
        {
          index: true,
          element: <Index />,
        },
        {
          path: "dashboard",
          element: <Dashboard subjects={subjects} />,
        },
        {
          path: "subjects",
          element: (
            <Subjects 
              subjects={subjects} 
              onAddSubject={handleAddSubject} 
              onDeleteSubject={handleDeleteSubject}
              onAddAssessment={handleAddAssessment}
            />
          ),
        },
        {
          path: "subjects/:id",
          element: (
            <SubjectDetail 
              subjects={subjects}
              onDeleteSubject={handleDeleteSubject}
              onAddAssessment={handleAddAssessment}
              onDeleteAssessment={handleDeleteAssessment}
              onToggleAssessmentCompleted={handleToggleAssessmentCompleted}
            />
          ),
        },
        {
          path: "grades",
          element: <Grades subjects={subjects} />,
        },
        {
          path: "settings",
          element: (
            <Settings 
              userPreferences={userPreferences}
              onUpdatePreferences={handleUpdatePreferences}
            />
          ),
        },
        {
          path: "calendar",
          element: (
            <AssessmentCalendar 
              subjects={subjects}
              onAddAssessment={handleAddAssessment}
              onDeleteAssessment={handleDeleteAssessment}
              onToggleAssessmentCompleted={handleToggleAssessmentCompleted}
            />
          ),
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
