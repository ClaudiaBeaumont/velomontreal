import { Navbar } from "@/components/Navbar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Lock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Shop } from "@shared/schema";

export default function Admin() {
  const [adminToken, setAdminToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingShops, isLoading, error } = useQuery<Shop[]>({
    queryKey: ["/api/admin/pending", adminToken],
    queryFn: async () => {
      const res = await fetch("/api/admin/pending", {
        headers: { "X-Admin-Token": adminToken },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          throw new Error("Token invalide");
        }
        throw new Error("Erreur lors du chargement");
      }
      setIsAuthenticated(true);
      return res.json();
    },
    enabled: adminToken.length > 0,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/admin/shops/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": adminToken,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shops"] });
      toast({
        title: variables.status === "approved" ? "Approuvé" : "Rejeté",
        description: `Le commerce a été ${variables.status === "approved" ? "approuvé" : "rejeté"}.`,
        className: variables.status === "approved" ? "bg-primary text-white border-none" : "",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    queryClient.invalidateQueries({ queryKey: ["/api/admin/pending"] });
  };

  const getServiceBadges = (shop: Shop) => {
    const services = [];
    if (shop.repair) services.push("Réparation");
    if (shop.rental) services.push("Location");
    if (shop.sale) services.push("Vente");
    if (shop.storage) services.push("Entreposage");
    return services;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl font-bold mb-8 text-primary">Administration</h1>
        
        {!isAuthenticated ? (
          <Card className="max-w-md mx-auto p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Connexion administrateur</h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Token administrateur"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                data-testid="input-admin-token"
              />
              <Button type="submit" className="w-full" data-testid="button-admin-login">
                Se connecter
              </Button>
            </form>
            {error && (
              <p className="text-destructive text-sm mt-4">{error.message}</p>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-xl font-semibold">Demandes en attente</h2>
              <Badge variant="secondary">{pendingShops?.length || 0} demande(s)</Badge>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
              </div>
            ) : pendingShops?.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                Aucune demande en attente
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingShops?.map((shop) => (
                  <Card key={shop.id} className="p-6" data-testid={`card-pending-shop-${shop.id}`}>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <h3 className="font-semibold text-lg">{shop.name}</h3>
                        <p className="text-sm text-muted-foreground">{shop.address}</p>
                        <p className="text-sm text-muted-foreground">
                          {shop.postalCode} {shop.city}
                        </p>
                        {shop.phone && (
                          <p className="text-sm">Tel: {shop.phone}</p>
                        )}
                        {shop.website && (
                          <p className="text-sm">
                            <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {shop.website}
                            </a>
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {getServiceBadges(shop).map((service) => (
                            <Badge key={service} variant="outline">{service}</Badge>
                          ))}
                        </div>
                        {shop.notes && (
                          <p className="text-sm text-muted-foreground italic mt-2">"{shop.notes}"</p>
                        )}
                      </div>
                      <div className="flex gap-2 md:flex-col">
                        <Button
                          onClick={() => updateStatus.mutate({ id: shop.id, status: "approved" })}
                          disabled={updateStatus.isPending}
                          className="flex-1"
                          data-testid={`button-approve-${shop.id}`}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => updateStatus.mutate({ id: shop.id, status: "rejected" })}
                          disabled={updateStatus.isPending}
                          className="flex-1"
                          data-testid={`button-reject-${shop.id}`}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
