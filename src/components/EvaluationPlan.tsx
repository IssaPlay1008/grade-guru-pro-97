
import { useState, useEffect } from "react";
import { Plus, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WeightValidator } from "./WeightValidator";
import { Subject, Assessment } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EvaluationPlanProps {
  subject: Subject;
  onAddAssessment: (subjectId: string, assessment: Partial<Assessment>) => void;
}

export function EvaluationPlan({ subject, onAddAssessment }: EvaluationPlanProps) {
  const { toast } = useToast();
  const [evaluations, setEvaluations] = useState<Array<Partial<Assessment>>>([]);
  const [isValid, setIsValid] = useState(true);
  const [totalWeight, setTotalWeight] = useState(0);

  // Calculate the total weight of existing assessments
  useEffect(() => {
    const existingWeight = subject.assessments.reduce((sum, assessment) => sum + assessment.weight, 0);
    setTotalWeight(existingWeight);
  }, [subject.assessments]);

  // Add a new empty evaluation to the list
  const addEmptyEvaluation = () => {
    setEvaluations([...evaluations, {
      name: "",
      type: "exam",
      weight: 0,
      maxGrade: 20,
      completed: false
    }]);
  };

  // Remove an evaluation from the list
  const removeEvaluation = (index: number) => {
    const updatedEvaluations = [...evaluations];
    updatedEvaluations.splice(index, 1);
    setEvaluations(updatedEvaluations);
  };

  // Update an evaluation field
  const updateEvaluation = (index: number, field: string, value: any) => {
    const updatedEvaluations = [...evaluations];
    updatedEvaluations[index] = {
      ...updatedEvaluations[index],
      [field]: field === 'weight' ? parseInt(value) : value
    };
    setEvaluations(updatedEvaluations);
  };

  // Check if all evaluations are valid
  const validateEvaluations = () => {
    const planWeight = evaluations.reduce((sum, eval_) => sum + (eval_.weight || 0), 0);
    const totalPlanWeight = totalWeight + planWeight;
    return {
      valid: totalPlanWeight <= 100,
      totalWeight: totalPlanWeight
    };
  };

  // Save all evaluations
  const saveEvaluations = () => {
    const validation = validateEvaluations();
    
    if (!validation.valid) {
      toast({
        title: "Error de ponderación",
        description: "El peso total de las evaluaciones no puede superar el 100%.",
        variant: "destructive"
      });
      return;
    }
    
    // Check for empty names
    const hasEmptyNames = evaluations.some(eval_ => !eval_.name);
    if (hasEmptyNames) {
      toast({
        title: "Campos incompletos",
        description: "Todas las evaluaciones deben tener un nombre.",
        variant: "destructive"
      });
      return;
    }
    
    // Add all evaluations to the subject
    evaluations.forEach(evaluation => {
      onAddAssessment(subject.id, evaluation);
    });
    
    // Clear the list
    setEvaluations([]);
    
    toast({
      title: "Plan de evaluación guardado",
      description: `Se han añadido ${evaluations.length} evaluaciones a ${subject.name}.`,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Plan de Evaluación</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Añade múltiples evaluaciones a esta materia hasta completar el 100% de la ponderación.
          </p>
          
          {/* Evaluation list */}
          {evaluations.map((evaluation, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor={`name-${index}`} className="text-xs">Nombre</Label>
                <Input
                  id={`name-${index}`}
                  value={evaluation.name}
                  onChange={(e) => updateEvaluation(index, 'name', e.target.value)}
                  placeholder="Ej: Examen Parcial 1"
                />
              </div>
              
              <div className="w-28">
                <Label htmlFor={`type-${index}`} className="text-xs">Tipo</Label>
                <Select
                  value={evaluation.type}
                  onValueChange={(value) => updateEvaluation(index, 'type', value)}
                >
                  <SelectTrigger id={`type-${index}`}>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exam">Examen</SelectItem>
                    <SelectItem value="midterm">Parcial</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Tarea</SelectItem>
                    <SelectItem value="project">Proyecto</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-20">
                <Label htmlFor={`weight-${index}`} className="text-xs">Peso (%)</Label>
                <Input
                  id={`weight-${index}`}
                  type="number"
                  min="0"
                  max={100 - (totalWeight + evaluations.reduce((sum, e, i) => i !== index ? sum + (e.weight || 0) : sum, 0))}
                  value={evaluation.weight || 0}
                  onChange={(e) => updateEvaluation(index, 'weight', e.target.value)}
                />
              </div>
              
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-500"
                onClick={() => removeEvaluation(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {/* Weight indicator */}
          <div className="mt-4">
            <WeightValidator
              assessments={subject.assessments}
              currentWeight={evaluations.reduce((sum, eval_) => sum + (eval_.weight || 0), 0)}
              onValid={setIsValid}
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={addEmptyEvaluation}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Añadir evaluación
            </Button>
            
            <Button
              size="sm"
              onClick={saveEvaluations}
              disabled={!isValid || evaluations.length === 0}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Guardar plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
