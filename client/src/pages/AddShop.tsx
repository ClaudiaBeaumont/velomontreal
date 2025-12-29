import { Navbar } from "@/components/Navbar";
import { useCreateShop } from "@/hooks/use-shops";
import { insertShopSchema, type InsertShop } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
      type: "Réparateur",
      address: "",
      postalCode: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = (data: InsertShop) => {
    createShop.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Succès !",
          description: "La boutique a été ajoutée au répertoire.",
          className: "bg-primary text-white border-none",
        });
        setLocation("/directory");
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
                        <FormLabel>Nom de l'établissement</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Vélo Express" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de service</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Réparateur">Réparateur</SelectItem>
                            <SelectItem value="Location">Location</SelectItem>
                            <SelectItem value="Vente & Réparation">Vente & Réparation</SelectItem>
                            <SelectItem value="Atelier associatif">Atelier associatif</SelectItem>
                          </SelectContent>
                        </Select>
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
                          <Input placeholder="01 23 45 67 89" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Email professionnel</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@exemple.com" {...field} className="bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Adresse complète</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Rue de la République" {...field} className="bg-background" />
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
                        <FormLabel>Code Postal</FormLabel>
                        <FormControl>
                          <Input placeholder="75000" {...field} className="bg-background" />
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
