
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Subject } from "@/types";
import { Plus, X, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  code: z.string().optional(),
  professor: z.string().optional(),
  targetGrade: z.coerce.number().min(0).max(20),
  credits: z.coerce.number().min(1).max(10),
});

type AddSubjectProps = {
  onAddSubject: (subject: Partial<Subject>) => void;
};

export function AddSubjectDialog({ onAddSubject }: AddSubjectProps) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      professor: "",
      targetGrade: 15,
      credits: 3,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Assign a random color from a set of colors
    const colors = ["#4338ca", "#16a34a", "#d97706", "#be185d", "#475569", "#0891b2", "#7c3aed"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newSubject: Partial<Subject> = {
      ...values,
      color: randomColor,
      gradeFormat: "twenty",
      semester: "Primavera", // Puedes obtener esto de un estado global
      year: 2025, // Puedes obtener esto de un estado global
      assessments: [],
      tags: tags,
    };
    
    onAddSubject(newSubject);
    setOpen(false);
    form.reset();
    setTags([]);
    setTagInput("");
    
    toast({
      title: "Materia añadida",
      description: `Se ha añadido "${values.name}" a tus materias.`,
    });
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Nueva Materia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir nueva materia</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la materia*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Matemáticas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: MAT101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="professor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profesor</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Dr. Martínez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Etiquetas</FormLabel>
              <div className="flex">
                <div className="flex-grow">
                  <Input 
                    placeholder="Ej: Importante, Difícil, etc." 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={handleAddTag}
                  className="ml-2"
                  variant="outline"
                >
                  <Tag className="h-4 w-4 mr-1" />
                  Añadir
                </Button>
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(tag => (
                    <div 
                      key={tag} 
                      className="bg-slate-100 text-slate-800 px-2 py-1 rounded-full text-sm flex items-center"
                    >
                      <span>{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)} 
                        className="ml-1 rounded-full hover:bg-slate-200 p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetGrade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calificación objetivo</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Créditos</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
