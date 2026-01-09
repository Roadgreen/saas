import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { ChefHat, Clock, TrendingUp, Smartphone, Shield, CheckCircle2, Star } from "lucide-react";

export default function Home() {
  const t = useTranslations('Landing');
  const locale = useLocale();

  return (
    <main className="flex-1 relative bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">StockChef</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#fonctionnalites"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('nav.features')}
            </a>
            <a
              href="#temoignages"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('nav.testimonials')}
            </a>
            <Link
              href={`/${locale}/pricing`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('nav.pricing')}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link href={`/${locale}/login`}>
              <Button variant="outline" size="sm" className="hidden md:inline-flex bg-transparent">
                Connexion
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="w-fit">
              <span className="mr-1">✨</span> Conçu pour les restaurateurs indépendants
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Plus de temps en cuisine, plus d&apos;argent dans votre poche
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
              L&apos;outil tout-en-un conçu pour les restaurateurs qui détestent l&apos;informatique. Simple, visuel et sans
              engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/${locale}/register`}>
                <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Tester gratuitement 14 jours
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                Voir une démo
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Sans carte bancaire</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Certifié NF525</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-8 lg:p-12">
              <img
                src="/smartphone-showing-restaurant-inventory-app-with-c.jpg"
                alt="Application StockChef sur smartphone"
                className="w-full max-w-sm mx-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Floating stats */}
            <Card className="absolute -left-4 top-1/4 w-48 shadow-lg hidden lg:block">
              <CardContent className="p-4">
                <div className="text-3xl font-bold text-primary">+3%</div>
                <div className="text-sm text-muted-foreground">Marge gagnée</div>
              </CardContent>
            </Card>
            <Card className="absolute -right-4 bottom-1/4 w-48 shadow-lg hidden lg:block">
              <CardContent className="p-4">
                <div className="text-3xl font-bold text-primary">5h</div>
                <div className="text-sm text-muted-foreground">Économisées/semaine</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Vous perdez du temps et de l&apos;argent ?</h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Excel, carnets, approximations... Il existe une meilleure façon de gérer votre stock
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold">Trop de temps perdu</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Des heures passées sur Excel à la place de cuisiner pour vos clients
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold">Marges floues</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Impossible de savoir quels plats sont vraiment rentables
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold">Ruptures de stock</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Vous découvrez trop tard qu&apos;il manque un ingrédient essentiel
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Maîtrisez vos stocks en 5 minutes par jour
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Automatisation intelligente pour vous concentrer sur l&apos;essentiel : votre cuisine
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <img src="/smartphone-with-barcode-scanner-for-restaurant-inv.jpg" alt="Scan de produits" className="rounded-2xl shadow-xl w-full" />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-block p-3 bg-primary/10 rounded-lg">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">Inventaire mobile ultra-rapide</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Scannez vos produits avec votre smartphone. Fini la saisie manuelle ! L&apos;application reconnaît
                automatiquement vos articles.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">Scan des codes-barres en un clin d&apos;œil</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">Mise à jour automatique de vos stocks</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">Fonctionne même sans connexion internet</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="inline-block p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">Calcul de marge automatique</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Créez vos recettes une fois, et l&apos;app calcule automatiquement la marge de chaque plat vendu. Plus besoin
                de sortir la calculatrice !
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">Fiches techniques intelligentes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">Suivi du coût des marchandises en temps réel</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">Graphiques simples et colorés</span>
                </li>
              </ul>
            </div>
            <div className="order-2">
              <img src="/colorful-profit-margin-dashboard-with-simple-chart.jpg" alt="Tableau de marges" className="rounded-2xl shadow-xl w-full" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img src="/smartphone-notification-alert-for-restaurant-low-s.jpg" alt="Alertes de stock" className="rounded-2xl shadow-xl w-full" />
            </div>
            <div className="space-y-6 order-1 md:order-2">
              <div className="inline-block p-3 bg-primary/10 rounded-lg">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">Alertes intelligentes</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Recevez une notification quand un produit arrive bientôt à sec. Plus jamais de rupture en plein service
                !
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">Seuils personnalisables par produit</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">Notifications sur votre téléphone</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">Liste de courses générée automatiquement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="temoignages" className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Ils ont repris le contrôle</h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Rejoignez des centaines de restaurateurs qui nous font confiance
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed italic">
                  &quot;Je gagne 5 heures de sommeil par semaine grâce aux alertes de stock. Je ne retournerai jamais à Excel
                  !&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    MC
                  </div>
                  <div>
                    <div className="font-semibold">Marie Carpentier</div>
                    <div className="text-sm text-muted-foreground">Food Truck &quot;Le Jardin Mobile&quot;</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed italic">
                  &quot;J&apos;ai augmenté ma marge de 3% en identifiant mes plats les moins rentables. L&apos;appli s&apos;est payée en 2
                  semaines !&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    TN
                  </div>
                  <div>
                    <div className="font-semibold">Thomas Ndiaye</div>
                    <div className="text-sm text-muted-foreground">Snack &quot;Chez Tom&quot;</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed italic">
                  &quot;Enfin un outil fait pour nous ! Pas de jargon compliqué, juste ce dont j&apos;ai besoin pour gérer mon
                  camion.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    SD
                  </div>
                  <div>
                    <div className="font-semibold">Sophie Dubois</div>
                    <div className="text-sm text-muted-foreground">Crêperie &quot;La Bretonne&quot;</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Legal Compliance Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">Certifié NF525 : Vous dormez tranquille</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    StockChef est certifié conforme aux normes fiscales françaises. En cas de contrôle, vous êtes
                    protégé. Nous gérons la conformité pour vous.
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Évitez les amendes de 7 500 €</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="text-lg px-6 py-3 border-primary text-primary">
                    NF525
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Commencez gratuitement, payez quand vous êtes convaincu
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              14 jours d&apos;essai gratuit. Sans carte bancaire. Annulable à tout moment.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <Card className="border-2 border-primary shadow-xl">
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">29€</div>
                  <div className="text-muted-foreground">par mois, sans engagement</div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Inventaire mobile illimité</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Calcul automatique des marges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Alertes de stock intelligentes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Accès Web, iOS et Android</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Certifié NF525 inclus</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Support par email et téléphone</span>
                  </li>
                </ul>
                <Link href={`/${locale}/register`}>
                  <Button size="lg" className="w-full text-lg py-6">
                    Démarrer mon essai gratuit
                  </Button>
                </Link>
                <p className="text-center text-sm text-muted-foreground">
                  L&apos;essai se termine automatiquement après 14 jours
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-3xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-balance">
              Moins de gestion, plus de cuisine, plus de profit
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
              Rejoignez les restaurateurs qui ont choisi la simplicité
            </p>
            <Link href={`/${locale}/register`}>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Commencer maintenant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">StockChef</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                L&apos;outil de gestion de stock pensé pour les restaurateurs indépendants.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#fonctionnalites" className="hover:text-foreground transition-colors">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <Link href={`/${locale}/pricing`} className="hover:text-foreground transition-colors">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Sécurité
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href={`/${locale}/blog`} className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    CGV
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 StockChef. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
