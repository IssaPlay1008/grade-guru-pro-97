
import { useState, useEffect } from "react";
import { Assessment } from "@/types";
import { Progress } from "./ui/progress";
import { AlertTriangle } from "lucide-react";

interface WeightValidatorProps {
  assessments: Assessment[];
  currentWeight: number;
  onValid: (isValid: boolean) => void;
}

export function WeightValidator({ assessments, currentWeight, onValid }: WeightValidatorProps) {
  const [totalWeight, setTotalWeight] = useState(0);
  const [isValid, setIsValid] = useState(true);
  
  useEffect(() => {
    const existingWeight = assessments.reduce((sum, assessment) => sum + assessment.weight, 0);
    const newTotalWeight = existingWeight + currentWeight;
    
    setTotalWeight(newTotalWeight);
    const valid = newTotalWeight <= 100;
    setIsValid(valid);
    onValid(valid);
  }, [assessments, currentWeight, onValid]);
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Peso total de evaluaciones</span>
        <span className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          {totalWeight}%/100%
        </span>
      </div>
      <Progress 
        value={totalWeight} 
        max={100} 
        className={`h-2 ${isValid ? 'bg-slate-200' : 'bg-red-100'}`}
      />
      {!isValid && (
        <div className="flex items-center text-red-600 text-sm mt-1">
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span>El peso total no puede superar el 100%</span>
        </div>
      )}
    </div>
  );
}
