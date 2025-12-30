import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { Wrench, Bike, ShieldCheck, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [postalCode, setPostalCode] = useState("");
  const [service, setService] = useState("repair");
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (postalCode.trim()) {
      params.append("postalCode", postalCode);
    }
    params.append("service", service);
    setLocation(`/directory?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32 lg:pb-40">
        {/* Abstract shapes for visual interest */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl" />

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-8">
            <h1 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Votre vélo mérite <br />
              <span className="text-gradient">les meilleurs soins</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              Trouvez rapidement les meilleurs réparateurs et services de location près de chez vous.
              Une communauté de passionnés à votre service.
            </p>

            <form onSubmit={handleSearch} className="mx-auto flex w-full max-w-2xl flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger className="h-12 rounded-xl border-2 border-border/60 bg-white text-base" data-testid="select-service">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="repair">Réparation</SelectItem>
                    <SelectItem value="rental">Location</SelectItem>
                    <SelectItem value="sale">Vente</SelectItem>
                    <SelectItem value="storage">Entreposage</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative sm:col-span-2">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Code postal (ex: H2J2J9) - rayon de 15 km" 
                    className="h-12 w-full pl-10 rounded-xl border-2 border-border/60 bg-white text-base shadow-sm focus-visible:border-primary focus-visible:ring-primary/20"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    data-testid="input-postal-code"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl bg-primary px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90">
                Rechercher
              </Button>
            </form>

            <div className="pt-4 text-sm text-muted-foreground">
              Ou <Link href="/directory" className="font-medium text-primary hover:underline">parcourir tout le répertoire</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Wrench className="h-8 w-8 text-white" />,
                title: "Réparation rapide",
                desc: "Des experts qualifiés pour remettre votre vélo en état de marche rapidement.",
                color: "bg-primary"
              },
              {
                icon: <Bike className="h-8 w-8 text-white" />,
                title: "Location flexible",
                desc: "Louez le vélo parfait pour vos balades, à la journée ou plus longtemps.",
                color: "bg-secondary"
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-white" />,
                title: "Entretien pro",
                desc: "Maintenance régulière pour assurer votre sécurité et la longévité de votre équipement.",
                color: "bg-[#2D3319]"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl border border-border/40 bg-background p-8 transition-all hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1">
                <div className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${feature.color} shadow-lg shadow-black/10`}>
                  {feature.icon}
                </div>
                <h3 className="mb-3 font-serif text-2xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-muted/50 transition-transform group-hover:scale-150" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 font-serif text-3xl font-bold md:text-4xl text-white">
            Vous êtes un professionnel du vélo ?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80">
            Rejoignez notre répertoire et augmentez votre visibilité auprès de la communauté cycliste locale.
            L'inscription est simple et rapide.
          </p>
          <Link href="/add">
            <Button size="lg" variant="secondary" className="h-14 rounded-xl px-8 text-base font-bold bg-white text-primary hover:bg-white/90">
              Inscrire mon commerce <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="mt-auto border-t border-border bg-background py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="mb-4 flex items-center justify-center gap-2">
            <Bike className="h-5 w-5 text-primary" />
            <span className="font-serif font-bold text-foreground">Répertoire Vélo</span>
          </p>
          <p>&copy; {new Date().getFullYear()} Tous droits réservés. Fait avec passion pour les cyclistes.</p>
        </div>
      </footer>
    </div>
  );
}
