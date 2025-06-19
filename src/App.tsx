
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UserMenu } from "@/components/UserMenu";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Users from "./pages/Users";
import Analytics from "./pages/Analytics";
import Content from "./pages/Content";
import Database from "./pages/Database";
import Settings from "./pages/Settings";
import Restaurants from "./pages/Restaurants";
import Accommodations from "./pages/Accommodations";
import Concerts from "./pages/Concerts";
import LeisureActivities from "./pages/LeisureActivities";
import LeisureActivityDetail from "./pages/LeisureActivityDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <div className="flex h-screen w-full">
                      <AppSidebar />
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                          <div className="flex h-16 items-center justify-end px-6">
                            <UserMenu />
                          </div>
                        </header>
                        <main className="flex-1 overflow-auto p-6">
                          <Routes>
                            <Route index element={<Index />} />
                            <Route path="users" element={<Users />} />
                            <Route path="analytics" element={<Analytics />} />
                            <Route path="content" element={<Content />} />
                            <Route path="database" element={<Database />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="restaurants" element={<Restaurants />} />
                            <Route path="accommodations" element={<Accommodations />} />
                            <Route path="concerts" element={<Concerts />} />
                            <Route path="leisure-activities" element={<LeisureActivities />} />
                            <Route path="leisure-activity/:id" element={<LeisureActivityDetail />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
