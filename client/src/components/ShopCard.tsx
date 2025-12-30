import { Shop } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Wrench, Bike, ShoppingBag, Warehouse, Navigation } from "lucide-react";

interface ShopCardProps {
  shop: Shop & { distance?: number | null };
}

export function ShopCard({ shop }: ShopCardProps) {
  const services = [];
  if (shop.repair) services.push({ label: "Réparation", icon: <Wrench className="h-3.5 w-3.5" /> });
  if (shop.rental) services.push({ label: "Location", icon: <Bike className="h-3.5 w-3.5" /> });
  if (shop.sale) services.push({ label: "Vente", icon: <ShoppingBag className="h-3.5 w-3.5" /> });
  if (shop.storage) services.push({ label: "Entreposage", icon: <Warehouse className="h-3.5 w-3.5" /> });

  return (
    <Card 
      className="group h-full flex flex-col overflow-hidden border-border/60 bg-white/50 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30"
      data-testid={`card-shop-${shop.id}`}
    >
      <CardHeader className="relative p-5 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                {shop.name}
              </h3>
              {shop.distance !== undefined && shop.distance !== null && (
                <Badge variant="outline" className="shrink-0 flex items-center gap-1 text-xs">
                  <Navigation className="h-3 w-3" />
                  {shop.distance} km
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {services.map((service) => (
                <Badge 
                  key={service.label}
                  variant="secondary" 
                  className="bg-secondary/10 text-secondary hover:bg-secondary/20 flex items-center gap-1 px-2 py-0.5 text-xs font-medium"
                >
                  {service.icon}
                  {service.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-5 pt-3 space-y-2">
        <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary/70" />
          <span className="leading-snug">
            {shop.address}
            <br />
            <span className="font-medium text-foreground">{shop.postalCode}</span>
          </span>
        </div>
        
        {shop.phone && (
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            <Phone className="h-4 w-4 shrink-0 text-primary/70" />
            <a href={`tel:${shop.phone}`} className="hover:underline">{shop.phone}</a>
          </div>
        )}
        
        {shop.website && (
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            <Globe className="h-4 w-4 shrink-0 text-primary/70" />
            <a 
              href={shop.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline truncate"
            >
              Site web
            </a>
          </div>
        )}

        {shop.notes && (
          <p className="text-xs text-muted-foreground italic pt-1">{shop.notes}</p>
        )}
      </CardContent>
      
      <CardFooter className="p-5 pt-0 gap-2">
        {shop.phone && (
          <a 
            href={`tel:${shop.phone}`} 
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
            data-testid={`button-call-${shop.id}`}
          >
            Appeler
          </a>
        )}
        {shop.website && (
          <a 
            href={shop.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center rounded-lg border border-primary/30 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            data-testid={`button-website-${shop.id}`}
          >
            Site web
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
