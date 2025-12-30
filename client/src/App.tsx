import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Directory from "@/pages/Directory";
import AddShop from "@/pages/AddShop";
import Admin from "@/pages/Admin";
import PistesCyclables from "@/pages/PistesCyclables";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/directory" component={Directory} />
      <Route path="/add" component={AddShop} />
      <Route path="/admin" component={Admin} />
      <Route path="/pistes-cyclables" component={PistesCyclables} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
