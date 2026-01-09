import { BarChart3, Clock, Leaf, ShieldCheck, Smartphone, Zap } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Gagnez du temps",
    description: "Fini les inventaires papier interminables. Scannez vos produits et factures en quelques secondes."
  },
  {
    icon: BarChart3,
    title: "Optimisez vos coûts",
    description: "Suivez vos marges en temps réel et identifiez les pertes pour augmenter votre rentabilité."
  },
  {
    icon: Leaf,
    title: "Réduisez le gaspillage",
    description: "Soyez alerté avant que vos produits n'expirent. Une gestion responsable et économique."
  },
  {
    icon: ShieldCheck,
    title: "Conformité HACCP",
    description: "Assurez la traçabilité de vos produits et simplifiez vos contrôles d'hygiène."
  },
  {
    icon: Smartphone,
    title: "Accessible partout",
    description: "Votre stock dans votre poche. Accessible sur mobile, tablette et ordinateur."
  },
  {
    icon: Zap,
    title: "Intelligence Artificielle",
    description: "Notre IA analyse vos factures et prédit vos besoins pour des commandes plus justes."
  }
];

export function Features() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Tout ce dont vous avez besoin pour réussir</h2>
          <p className="text-lg text-slate-600">
            Une suite d'outils complète conçue spécifiquement pour les professionnels de la restauration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
