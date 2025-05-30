
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserMenu } from "@/components/UserMenu";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Content from "./pages/Content";
import Analytics from "./pages/Analytics";
import Database from "./pages/Database";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full bg-background">
                    <AppSidebar />
                    <main className="flex-1 p-6 overflow-auto">
                      <div className="flex justify-end mb-4">
                        <UserMenu />
                      </div>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/users" element={
                          <ProtectedRoute requireAdmin>
                            <Users />
                          </ProtectedRoute>
                        } />
                        <Route path="/content" element={
                          <ProtectedRoute requireEditor>
                            <Content />
                          </ProtectedRoute>
                        } />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/database" element={
                          <ProtectedRoute requireAdmin>
                            <Database />
                          </ProtectedRoute>
                        } />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
