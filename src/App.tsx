
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Content from "./pages/Content";
import Settings from "./pages/Settings";
import Database from "./pages/Database";
import Auth from "./pages/Auth";
import LeisureActivities from "./pages/LeisureActivities";
import Accommodations from "./pages/Accommodations";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <main className="flex-1 p-6">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/users" element={<Users />} />
                          <Route path="/content" element={<Content />} />
                          <Route path="/leisure-activities" element={<LeisureActivities />} />
                          <Route path="/accommodations" element={<Accommodations />} />
                          <Route path="/database" element={<Database />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
