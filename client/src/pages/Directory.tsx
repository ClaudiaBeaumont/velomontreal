import { Navbar } from "@/components/Navbar";
import { ShopCard } from "@/components/ShopCard";
import { Input } from "@/components/ui/input";
import { useShops } from "@/hooks/use-shops";
import { Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Directory() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialSearch = searchParams.get("search") || "";
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: shops, isLoading, error } = useShops(debouncedSearch);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold md:text-4xl text-primary">Le Répertoire</h1>
            <p className="text-muted-foreground">Découvrez les artisans et services autour de vous.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par nom ou code postal..." 
              className="pl-9 bg-white border-border/60 focus:border-primary focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
            <p className="font-medium">Une erreur est survenue lors du chargement des boutiques.</p>
          </div>
        ) : shops?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 py-24 text-center">
            <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Essayez une autre recherche ou un code postal différent.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shops?.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
