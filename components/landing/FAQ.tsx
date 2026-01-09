'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Est-ce que SnapTrack est compatible avec mon logiciel de caisse ?",
    answer: "SnapTrack peut fonctionner indépendamment. Nous travaillons sur des intégrations directes avec les principaux logiciels de caisse (Zettle, SumUp, etc.). Pour l'instant, vous pouvez importer vos ventes via notre scanner IA."
  },
  {
    question: "Combien de temps faut-il pour configurer mon compte ?",
    answer: "C'est très rapide. En moins de 5 minutes, vous pouvez créer votre compte et scanner vos premiers produits. Notre base de données contient déjà des milliers de références."
  },
  {
    question: "Puis-je utiliser SnapTrack sur plusieurs appareils ?",
    answer: "Oui, votre compte est accessible depuis n'importe quel ordinateur, tablette ou smartphone. Les données sont synchronisées en temps réel."
  },
  {
    question: "Comment fonctionne l'essai gratuit ?",
    answer: "Vous avez accès à toutes les fonctionnalités Premium pendant 14 jours, sans carte bancaire requise. À la fin de l'essai, vous pouvez choisir un abonnement ou passer à la version gratuite."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Questions fréquentes</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-slate-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-slate-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-slate-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="p-4 bg-slate-50 border-t border-slate-200 text-slate-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
