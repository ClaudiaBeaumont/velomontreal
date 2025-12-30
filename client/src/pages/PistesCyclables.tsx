import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Map, Route, Navigation } from "lucide-react";

const networks = [
  "Route verte du Québec",
  "Véloroute portneuvoise",
  "Ville de Gatineau",
  "Ville de Laval",
  "Ville de Lévis",
  "Ville de Longueuil",
  "Ville de Montréal",
  "Ville de Québec",
  "Ville de Repentigny",
  "Ville de Rimouski",
  "Ville de Rouyn-Noranda",
  "Ville de Saguenay",
  "Ville de Saint-Hyacinthe",
  "Ville de Shawinigan",
  "Ville de Sherbrooke",
  "Ville de Trois-Rivières",
];

const categories = [
  { name: "Piste cyclable", description: "Voie réservée aux cyclistes, séparée de la circulation" },
  { name: "Bande cyclable", description: "Voie marquée sur la chaussée pour les cyclistes" },
  { name: "Chaussée désignée", description: "Route partagée avec signalisation pour cyclistes" },
];

export default function PistesCyclables() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8 space-y-2">
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl" data-testid="text-page-title">
            Pistes cyclables du Québec
          </h1>
          <p className="text-muted-foreground">
            Découvrez le réseau de pistes cyclables à travers la province
          </p>
        </div>

        <Card className="mb-8 p-6 border-border/60">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <Map className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-xl font-semibold">Réseaux cyclables du Québec (RCQC)</h2>
              </div>
              <p className="text-muted-foreground">
                Une cartographie unifiée présentant 15 réseaux cyclables du Québec disponibles en données ouvertes. 
                L'application permet de visualiser les pistes cyclables, bandes cyclables et chaussées désignées 
                à travers la province.
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Badge key={cat.name} variant="secondary" className="text-xs">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <a 
                href="https://www.geopratic.com/rcqc/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="gap-2" data-testid="button-open-rcqc">
                  <Navigation className="h-4 w-4" />
                  Accéder à la carte
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6 border-border/60">
            <div className="flex items-center gap-2 mb-4">
              <Route className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-lg font-semibold">Réseaux disponibles</h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {networks.map((network) => (
                <div 
                  key={network} 
                  className="flex items-center gap-2 py-1.5 px-2 rounded-md bg-muted/50"
                  data-testid={`text-network-${network.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-sm text-foreground">{network}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-border/60">
            <div className="flex items-center gap-2 mb-4">
              <Map className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-lg font-semibold">Fonctionnalités</h2>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Affichage différencié selon le type de voie cyclable</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Création d'itinéraires personnalisés à vélo</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Export des itinéraires au format GPX</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Superposition de fichiers KML</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Version mobile avec géolocalisation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span>Sélection de segments par aire géographique</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-border/60">
              <p className="text-xs text-muted-foreground">
                Source des données: <a href="https://www.donneesquebec.ca/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Données Québec</a>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Application développée par Géopratic
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
