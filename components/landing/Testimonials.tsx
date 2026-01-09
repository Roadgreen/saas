import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Thomas D.",
    role: "Gérant de Food Truck",
    content: "SnapTrack a changé ma vie. Je ne perds plus de temps à faire l'inventaire le soir, tout est automatisé. J'ai réduit mes pertes de 20% en un mois.",
    rating: 5
  },
  {
    name: "Sarah L.",
    role: "Cheffe de cuisine",
    content: "L'interface est super intuitive. L'équipe adore l'utiliser et on a enfin une vision claire de nos coûts matière. Je recommande à 100%.",
    rating: 5
  },
  {
    name: "Marc R.",
    role: "Propriétaire de Dark Kitchen",
    content: "Le scanner IA est bluffant. Il reconnaît tout ! C'est un gain de temps énorme pour la réception des commandes.",
    rating: 4
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ils nous font confiance</h2>
          <p className="text-lg text-slate-600">
            Rejoignez des centaines de professionnels satisfaits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < testimonial.rating ? 'fill-current' : 'text-slate-200'}`} />
                ))}
              </div>
              <p className="text-slate-700 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-bold text-slate-900">{testimonial.name}</p>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center gap-8 opacity-50 grayscale">
            {/* Placeholder logos */}
            <div className="text-xl font-bold text-slate-400">Uber Eats</div>
            <div className="text-xl font-bold text-slate-400">Deliveroo</div>
            <div className="text-xl font-bold text-slate-400">Just Eat</div>
            <div className="text-xl font-bold text-slate-400">Metro</div>
        </div>
      </div>
    </section>
  );
}
