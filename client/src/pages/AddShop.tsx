import { Navbar } from "@/components/Navbar";
import { useCreateShop } from "@/hooks/use-shops";
import { insertShopSchema, type InsertShop } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AddShop() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createShop = useCreateShop();

  const form = useForm<InsertShop>({
    resolver: zodResolver(insertShopSchema),
    defaultValues: {
      name: "",
      repair: false,
      rental: false,
      sale: false,
      storage: false,
      address: "",
      postalCode: "",
      city: "Montréal",
      phone: "",
      website: "",
      notes: "",
    },
  });

  const onSubmit = (data: InsertShop) => {
    createShop.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Demande soumise",
          description: "Votre demande d'inscription sera examinée sous peu. Merci!",
          className: "bg-primary text-white border-none",
          duration: 5000,
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <Button 
            variant="ghost" 
            className="mb-6 pl-0 hover:bg-transparent hover:text-primary transition-colors"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
          </Button>

          <div className="mb-8 space-y-2">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Ajouter un établissement</h1>
            <p className="text-muted-foreground">Remplissez le formulaire ci-dessous pour référencer une nouvelle boutique.</p>
          </div>
          
          <Card className="p-8 shadow-lg shadow-black/5 border-border/60 bg-white">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Nom de l'établissement *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Vélo Express" {...field} className="bg-background" data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-2">
                    <FormLabel className="mb-3 block">Services offerts</FormLabel>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="repair"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox checked={!!field.value} onCheckedChange={field.onChange} data-testid="checkbox-repair" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Réparation</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rental"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox checked={!!field.value} onCheckedChange={field.onChange} data-testid="checkbox-rental" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Location</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sale"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox checked={!!field.value} onCheckedChange={field.onChange} data-testid="checkbox-sale" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Vente</FormLabel>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="storage"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox checked={!!field.value} onCheckedChange={field.onChange} data-testid="checkbox-storage" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Entreposage</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Adresse complète *</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Rue Saint-Denis, Montréal" {...field} className="bg-background" data-testid="input-address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code Postal *</FormLabel>
                        <FormControl>
                          <Input placeholder="H2J2J9" {...field} className="bg-background" data-testid="input-postal-code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Montréal" {...field} value={field.value || ""} className="bg-background" data-testid="input-city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="514-555-1234" {...field} value={field.value || ""} className="bg-background" data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site web</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://exemple.com" {...field} value={field.value || ""} className="bg-background" data-testid="input-website" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Notes (optionnel)</FormLabel>
                        <FormControl>
                          <Input placeholder="Informations supplémentaires..." {...field} value={field.value || ""} className="bg-background" data-testid="input-notes" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                    disabled={createShop.isPending}
                    data-testid="button-submit"
                  >
                    {createShop.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Ajout en cours...
                      </>
                    ) : (
                      "Ajouter au répertoire"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </main>
    </div>
  );
}
