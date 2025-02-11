import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/auth-context";
import { useAuth } from "./context/auth-context";
import Home from "./pages/home";
import LoginForm from "./components/auth/login-form";
import RegisterForm from "./components/auth/register-form";
import NotFound from "@/pages/not-found";
import { Toaster } from "@/components/ui/toaster";


function AuthenticatedApp() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Home /> : <LoginForm />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthenticatedApp} />
      <Route path="/login" component={LoginForm} />
      <Route path="/register" component={RegisterForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;