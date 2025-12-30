import { Navbar } from "@/components/Navbar";
import { ShopCard } from "@/components/ShopCard";
import { Input } from "@/components/ui/input";
import { useShopsSearch } from "@/hooks/use-shops";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Directory() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialPostalCode = searchParams.get("postalCode") || "";
  const initialService = searchParams.get("service") || "";
  
  const [postalCode, setPostalCode] = useState(initialPostalCode);
  const [service, setService] = useState(initialService);
  const [searchPostalCode, setSearchPostalCode] = useState(initialPostalCode);
  const [searchService, setSearchService] = useState(initialService);

  const { data: shops, isLoading, error }  = useShopsSearch(searchPostalCode, searchService);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPostalCode(postalCode);
    setSearchService(service);
  };

  const clearFilters = () => {
    setPostalCode("");
    setService("");
    setSearchPostalCode("");
    setSearchService("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 space-y-6">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold md:text-4xl text-primary">Le Répertoire</h1>
            <p className="text-muted-foreground">Trouvez les commerces vélo près de chez vous (rayon de 15 km).</p>
          </div>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <Select value={service || "all"} onValueChange={(val) => setService(val === "all" ? "" : val)}>
              <SelectTrigger className="w-full sm:w-48 bg-white" data-testid="filter-service">
                <SelectValue placeholder="Tous les services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les services</SelectItem>
                <SelectItem value="repair">Réparation</SelectItem>
                <SelectItem value="rental">Location</SelectItem>
                <SelectItem value="sale">Vente</SelectItem>
                <SelectItem value="storage">Entreposage</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Votre code postal (ex: H2J2J9)" 
                className="pl-9 bg-white border-border/60 focus:border-primary focus:ring-primary/20"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                data-testid="input-search-postal"
              />
            </div>

            <Button type="submit" data-testid="button-search">
              Rechercher
            </Button>

            {(searchPostalCode || searchService) && (
              <Button type="button" variant="outline" onClick={clearFilters} data-testid="button-clear">
                Effacer
              </Button>
            )}
          </form>

          {searchPostalCode && (
            <p className="text-sm text-muted-foreground">
              Recherche autour de <span className="font-medium text-foreground">{searchPostalCode.toUpperCase()}</span>
              {searchService && <> pour <span className="font-medium text-foreground">{
                searchService === 'repair' ? 'Réparation' :
                searchService === 'rental' ? 'Location' :
                searchService === 'sale' ? 'Vente' : 'Entreposage'
              }</span></>}
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
            <AlertCircle className="h-8 w-8 mx-auto mb-3" />
            <p className="font-medium">{error.message}</p>
          </div>
        ) : shops?.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 py-16 text-center">
            <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground">Aucun résultat trouvé</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {searchPostalCode 
                ? "Aucun commerce trouvé dans un rayon de 15 km. Essayez un autre code postal."
                : "Entrez votre code postal pour trouver des commerces près de chez vous."
              }
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {shops?.length} commerce{shops?.length !== 1 ? 's' : ''} trouvé{shops?.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shops?.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
