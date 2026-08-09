import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const action = mode === "login" ? signIn : signUp;
    const { error } = await action(username, password);
    setSubmitting(false);

    if (error) {
      toast({ title: "No se pudo continuar", description: error, variant: "destructive" });
      return;
    }

    toast({
      title: mode === "login" ? "¡Bienvenido de nuevo!" : "Cuenta creada",
      description: mode === "login" ? "Sesión iniciada correctamente." : "Ya puedes empezar a registrar tus notas.",
    });
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex items-center justify-center">
            <GraduationCap className="h-10 w-10 text-brand-600" />
          </div>
          <CardTitle className="text-2xl">Acceso</CardTitle>
          <CardDescription>Solo necesitas un usuario y una contraseña.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={setMode} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="tu_usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-brand-600 hover:bg-brand-700" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "login" ? "Entrar" : "Registrarme"}
              </Button>
            </form>

            <TabsContent value="login" />
            <TabsContent value="signup" />
          </Tabs>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            No usamos correo electrónico: tu usuario es tu identificador. Guarda bien tu contraseña,
            no se puede recuperar por email.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
