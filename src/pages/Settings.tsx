
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { UserPreferences } from "@/types";

interface SettingsProps {
  userPreferences: UserPreferences;
  onUpdatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const Settings = ({ userPreferences, onUpdatePreferences }: SettingsProps) => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>(userPreferences);
  
  useEffect(() => {
    setPreferences(userPreferences);
  }, [userPreferences]);

  const handleChange = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePreferences(preferences);
    
    toast({
      title: "Configuraciones guardadas",
      description: "Tus preferencias han sido actualizadas correctamente.",
    });
    
    // Apply theme changes immediately
    document.documentElement.classList.toggle('dark', preferences.darkMode);
    document.documentElement.classList.toggle('text-lg', preferences.largeText);
    
    // Apply theme color
    if (preferences.theme) {
      document.documentElement.dataset.theme = preferences.theme;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Apariencia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Tema de color</Label>
                <div className="grid grid-cols-4 gap-2">
                  {['indigo', 'blue', 'green', 'red', 'purple', 'pink', 'orange', 'amber'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        preferences.theme === color ? 'border-black dark:border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: getThemeColor(color) }}
                      onClick={() => handleChange('theme', color)}
                      aria-label={`Tema ${color}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Modo oscuro</Label>
                <Switch
                  id="darkMode"
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => handleChange('darkMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="largeText">Texto grande</Label>
                <Switch
                  id="largeText"
                  checked={preferences.largeText}
                  onCheckedChange={(checked) => handleChange('largeText', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="animations">Animaciones</Label>
                <Switch
                  id="animations"
                  checked={preferences.animations}
                  onCheckedChange={(checked) => handleChange('animations', checked)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Calificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Formato de calificación</Label>
                <RadioGroup
                  value={preferences.gradeFormat}
                  onValueChange={(value) => handleChange('gradeFormat', value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="twenty" id="twenty" />
                    <Label htmlFor="twenty">Escala de 20 puntos</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label>Idioma</Label>
                <RadioGroup
                  value={preferences.language}
                  onValueChange={(value) => handleChange('language', value)}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="es" id="es" />
                    <Label htmlFor="es">Español</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Button type="submit" className="mt-6">
          Guardar configuración
        </Button>
      </form>
    </div>
  );
};

// Helper function to get theme color
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

export default Settings;
