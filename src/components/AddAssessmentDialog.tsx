
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Assessment, AssessmentType, Subject } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { WeightValidator } from "./WeightValidator";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  type: z.enum(["exam", "quiz", "assignment", "project", "midterm", "final", "other"]),
  weight: z.coerce.number().min(1).max(100),
  maxGrade: z.coerce.number().min(1).max(20),
  dueDate: z.date().optional(),
  description: z.string().optional(),
});

type AddAssessmentProps = {
  subject: Subject;
  onAddAssessment: (subjectId: string, assessment: Partial<Assessment>) => void;
};

export function AddAssessmentDialog({ subject, onAddAssessment }: AddAssessmentProps) {
  const [open, setOpen] = useState(false);
  const [isWeightValid, setIsWeightValid] = useState(true);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "exam" as AssessmentType,
      weight: 25,
      maxGrade: 20,
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isWeightValid) {
      toast({
        title: "Error",
        description: "El peso total de las evaluaciones no puede superar el 100%",
        variant: "destructive",
      });
      return;
    }
    
    const newAssessment: Partial<Assessment> = {
      ...values,
      subjectId: subject.id,
      completed: false,
    };
    
    onAddAssessment(subject.id, newAssessment);
    setOpen(false);
    form.reset();
    
    toast({
      title: "Evaluación añadida",
      description: `Se ha añadido "${values.name}" a la materia ${subject.name}.`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Añadir Evaluación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir nueva evaluación</DialogTitle>
          <DialogDescription>
            Agrega una evaluación a la materia {subject.name}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la evaluación*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Examen Parcial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="exam">Examen</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Tarea</SelectItem>
                      <SelectItem value="project">Proyecto</SelectItem>
                      <SelectItem value="midterm">Parcial</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calificación máxima</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="20" 
                        {...field} 
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value > 20) {
                            e.target.value = "20";
                          }
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <WeightValidator 
              assessments={subject.assessments} 
              currentWeight={form.watch('weight')} 
              onValid={setIsWeightValid}
            />
            
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de entrega</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Seleccionar fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción de la evaluación" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={!isWeightValid}>Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
