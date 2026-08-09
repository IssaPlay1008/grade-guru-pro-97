import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// El login es por usuario y contraseña (sin correo). Internamente se genera
// un correo sintético determinista a partir del nombre de usuario.
const EMAIL_DOMAIN = "app.local";

export const normalizeUsername = (username: string) =>
  username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");

export const usernameToEmail = (username: string) =>
  `${normalizeUsername(username)}@${EMAIL_DOMAIN}`;

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signUp: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (username: string, password: string) => {
    const clean = normalizeUsername(username);
    if (!clean) return { error: "Escribe un nombre de usuario válido." };
    const { error } = await supabase.auth.signInWithPassword({
      email: usernameToEmail(clean),
      password,
    });
    if (error) {
      return { error: "Usuario o contraseña incorrectos." };
    }
    return { error: null };
  };

  const signUp = async (username: string, password: string) => {
    const clean = normalizeUsername(username);
    if (clean.length < 3) return { error: "El usuario debe tener al menos 3 caracteres (letras, números, . _ -)." };
    if (password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres." };

    const { error } = await supabase.auth.signUp({
      email: usernameToEmail(clean),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { username: clean },
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        return { error: "Ese nombre de usuario ya está registrado." };
      }
      return { error: error.message };
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
