
import { Subject, Assessment } from "@/types";

export const generateMockSubjects = (): Subject[] => {
  return [
    {
      id: "1",
      name: "Matemáticas",
      code: "MATH101",
      professor: "Dr. Ramírez",
      color: "#4338ca",
      credits: 4,
      gradeFormat: "twenty",
      targetGrade: 85,
      currentGrade: 78,
      semester: "Primavera",
      year: 2025,
      assessments: [
        {
          id: "1-1",
          subjectId: "1",
          name: "Examen Parcial 1",
          type: "exam",
          weight: 25,
          dueDate: new Date("2025-05-15"),
          grade: 75,
          maxGrade: 100,
          completed: true,
          description: "Álgebra y cálculo básico"
        },
        {
          id: "1-2",
          subjectId: "1",
          name: "Tarea Semanal",
          type: "assignment",
          weight: 15,
          dueDate: new Date("2025-05-07"),
          grade: 90,
          maxGrade: 100,
          completed: true,
          description: "Problemas de práctica"
        },
        {
          id: "1-3",
          subjectId: "1",
          name: "Proyecto de Semestre",
          type: "project",
          weight: 30,
          dueDate: new Date("2025-06-20"),
          maxGrade: 100,
          completed: false,
          description: "Aplicación práctica de conceptos"
        },
        {
          id: "1-4",
          subjectId: "1",
          name: "Examen Final",
          type: "final",
          weight: 30,
          dueDate: new Date("2025-07-01"),
          maxGrade: 100,
          completed: false,
          description: "Evaluación final del curso"
        }
      ]
    },
    {
      id: "2",
      name: "Historia",
      code: "HIST202",
      professor: "Dra. Martínez",
      color: "#16a34a",
      credits: 3,
      gradeFormat: "twenty",
      targetGrade: 90,
      currentGrade: 92,
      semester: "Primavera",
      year: 2025,
      assessments: [
        {
          id: "2-1",
          subjectId: "2",
          name: "Ensayo Histórico",
          type: "assignment",
          weight: 30,
          dueDate: new Date("2025-04-22"),
          grade: 95,
          maxGrade: 100,
          completed: true,
          description: "Análisis de evento histórico"
        },
        {
          id: "2-2",
          subjectId: "2",
          name: "Examen Parcial",
          type: "exam",
          weight: 25,
          dueDate: new Date("2025-05-10"),
          grade: 88,
          maxGrade: 100,
          completed: true,
          description: "Historia mundial"
        },
        {
          id: "2-3",
          subjectId: "2",
          name: "Presentación Grupal",
          type: "project",
          weight: 20,
          dueDate: new Date("2025-06-15"),
          maxGrade: 100,
          completed: false,
          description: "Presentación sobre período histórico"
        },
        {
          id: "2-4",
          subjectId: "2",
          name: "Examen Final",
          type: "final",
          weight: 25,
          dueDate: new Date("2025-07-05"),
          maxGrade: 100,
          completed: false,
          description: "Evaluación final"
        }
      ]
    },
    {
      id: "3",
      name: "Física",
      code: "PHYS201",
      professor: "Dr. Gutiérrez",
      color: "#d97706",
      credits: 4,
      gradeFormat: "twenty",
      targetGrade: 80,
      currentGrade: 72,
      semester: "Primavera",
      year: 2025,
      assessments: [
        {
          id: "3-1",
          subjectId: "3",
          name: "Quiz 1",
          type: "quiz",
          weight: 10,
          dueDate: new Date("2025-04-05"),
          grade: 65,
          maxGrade: 100,
          completed: true,
          description: "Conceptos básicos"
        },
        {
          id: "3-2",
          subjectId: "3",
          name: "Laboratorio 1",
          type: "assignment",
          weight: 20,
          dueDate: new Date("2025-04-20"),
          grade: 78,
          maxGrade: 100,
          completed: true,
          description: "Experimentos prácticos"
        },
        {
          id: "3-3",
          subjectId: "3",
          name: "Examen Parcial",
          type: "exam",
          weight: 30,
          dueDate: new Date("2025-05-25"),
          grade: 72,
          maxGrade: 100,
          completed: true,
          description: "Mecánica y termodinámica"
        },
        {
          id: "3-4",
          subjectId: "3",
          name: "Proyecto Final",
          type: "project",
          weight: 15,
          dueDate: new Date("2025-06-10"),
          maxGrade: 100,
          completed: false,
          description: "Aplicación de conceptos físicos"
        },
        {
          id: "3-5",
          subjectId: "3",
          name: "Examen Final",
          type: "final",
          weight: 25,
          dueDate: new Date("2025-07-03"),
          maxGrade: 100,
          completed: false,
          description: "Evaluación completa del curso"
        }
      ]
    },
    {
      id: "4",
      name: "Literatura",
      code: "LIT303",
      professor: "Dra. González",
      color: "#be185d",
      credits: 3,
      gradeFormat: "twenty",
      targetGrade: 85,
      currentGrade: 88,
      semester: "Primavera",
      year: 2025,
      assessments: [
        {
          id: "4-1",
          subjectId: "4",
          name: "Análisis Literario 1",
          type: "assignment",
          weight: 15,
          dueDate: new Date("2025-04-12"),
          grade: 92,
          maxGrade: 100,
          completed: true,
          description: "Análisis de texto clásico"
        },
        {
          id: "4-2",
          subjectId: "4",
          name: "Ensayo Comparativo",
          type: "assignment",
          weight: 25,
          dueDate: new Date("2025-05-03"),
          grade: 85,
          maxGrade: 100,
          completed: true,
          description: "Comparación de dos obras"
        },
        {
          id: "4-3",
          subjectId: "4",
          name: "Examen Parcial",
          type: "exam",
          weight: 20,
          dueDate: new Date("2025-05-20"),
          grade: 88,
          maxGrade: 100,
          completed: true,
          description: "Teoría literaria"
        },
        {
          id: "4-4",
          subjectId: "4",
          name: "Proyecto Creativo",
          type: "project",
          weight: 15,
          dueDate: new Date("2025-06-15"),
          maxGrade: 100,
          completed: false,
          description: "Escritura creativa basada en estilos estudiados"
        },
        {
          id: "4-5",
          subjectId: "4",
          name: "Examen Final",
          type: "final",
          weight: 25,
          dueDate: new Date("2025-07-02"),
          maxGrade: 100,
          completed: false,
          description: "Evaluación final del curso"
        }
      ]
    }
  ];
};

// Helper to calculate current grade based on completed assessments
export const calculateSubjectGrade = (subject: Subject): number => {
  const completedAssessments = subject.assessments.filter(a => a.completed && a.grade !== undefined);
  
  if (completedAssessments.length === 0) return 0;
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  completedAssessments.forEach(assessment => {
    if (assessment.grade !== undefined) {
      totalWeight += assessment.weight;
      weightedSum += (assessment.grade / assessment.maxGrade) * assessment.weight;
    }
  });
  
  return totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
};

// Helper to predict final grade
export const predictFinalGrade = (subject: Subject): number => {
  const completedAssessments = subject.assessments.filter(a => a.completed && a.grade !== undefined);
  const pendingAssessments = subject.assessments.filter(a => !a.completed);
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  // Calculate current weighted average
  completedAssessments.forEach(assessment => {
    if (assessment.grade !== undefined) {
      totalWeight += assessment.weight;
      weightedSum += (assessment.grade / assessment.maxGrade) * assessment.weight;
    }
  });
  
  // For pending assessments, use target grade as predicted
  pendingAssessments.forEach(assessment => {
    totalWeight += assessment.weight;
    const targetPercentage = subject.targetGrade ? subject.targetGrade / 100 : 0.8; // Default to 80% if no target
    weightedSum += targetPercentage * assessment.weight;
  });
  
  return totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
};

// Helper to determine if a subject is at risk
export const isSubjectAtRisk = (subject: Subject): boolean => {
  return (subject.currentGrade !== undefined && subject.targetGrade !== undefined) 
    ? subject.currentGrade < subject.targetGrade - 10 
    : false;
};

// Get assessments due soon (within the next 7 days)
export const getUpcomingAssessments = (subjects: Subject[]): Assessment[] => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const allAssessments = subjects.flatMap(s => s.assessments);
  
  return allAssessments.filter(a => 
    !a.completed && 
    a.dueDate && 
    a.dueDate >= today && 
    a.dueDate <= nextWeek
  ).sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    return 0;
  });
};
