import { Camera, ClipboardList, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Scannez",
    description: "Prenez en photo vos factures ou vos produits. Notre IA reconnaît automatiquement les articles et les ajoute à votre stock.",
    icon: Camera
  },
  {
    number: "02",
    title: "Suivez",
    description: "Visualisez l'état de votre stock en temps réel. Recevez des alertes pour les produits proches de la péremption.",
    icon: ClipboardList
  },
  {
    number: "03",
    title: "Optimisez",
    description: "Analysez vos ventes et votre gaspillage. Ajustez vos commandes pour maximiser votre marge.",
    icon: TrendingUp
  }
];

export function Steps() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Comment ça marche ?</h2>
          <p className="text-lg text-slate-600">
            Une gestion simplifiée en 3 étapes.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>

          <div className="grid lg:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center bg-white p-4">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-blue-200 transform transition-transform hover:scale-110 duration-300">
                  <step.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
