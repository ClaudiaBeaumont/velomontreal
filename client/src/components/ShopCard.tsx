import { Shop } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Wrench, Bike } from "lucide-react";

interface ShopCardProps {
  shop: Shop;
}

export function ShopCard({ shop }: ShopCardProps) {
  const services = [];
  if (shop.repair) services.push({ label: "Réparation", icon: <Wrench className="h-4 w-4" /> });
  if (shop.rental) services.push({ label: "Location", icon: <Bike className="h-4 w-4" /> });

  return (
    <Card className="group h-full flex flex-col overflow-hidden border-border/60 bg-white/50 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30">
      <CardHeader className="relative p-6 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {shop.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {services.map((service) => (
                <Badge 
                  key={service.label}
                  variant="secondary" 
                  className="bg-secondary/10 text-secondary hover:bg-secondary/20 flex items-center gap-1.5 px-3 py-1 font-medium"
                >
                  {service.icon}
                  {service.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-6 pt-4 space-y-3">
        <div className="flex items-start gap-3 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary/70" />
          <span>
            {shop.address}<br />
            <span className="font-medium text-foreground">{shop.postalCode}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          <Phone className="h-4 w-4 shrink-0 text-primary/70" />
          <span>{shop.phone}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-colors break-all">
          <Mail className="h-4 w-4 shrink-0 text-primary/70" />
          <span>{shop.email}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <a 
          href={`mailto:${shop.email}`} 
          className="w-full inline-flex items-center justify-center rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
        >
          Contacter
        </a>
      </CardFooter>
    </Card>
  );
}
