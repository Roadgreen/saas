import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlayCircle, Sparkles } from "lucide-react";

export function Hero({ locale }: { locale: string }) {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 items-center">
          <div className="lg:col-span-6 max-w-4xl mx-auto text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C17D54] text-white text-sm font-medium mb-8 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Conçu pour les restaurateurs indépendants
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1A1A1A] tracking-tight mb-8 leading-[1.1]">
              Plus de temps en cuisine, <br className="hidden lg:block" />
              plus d'argent dans votre poche
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              L'outil tout-en-un conçu pour les restaurateurs qui détestent l'informatique. 
              Simple, visuel et sans engagement.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link href={`/${locale}/register`}>
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-7 h-auto bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-lg">
                  Tester gratuitement 14 jours
                </Button>
              </Link>
              <Link href={`/${locale}/login`}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-7 h-auto bg-white border-slate-200 hover:bg-slate-50 text-slate-900 rounded-lg">
                  Voir une démo
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Sans carte bancaire</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Certifié NF525</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Support français 7j/7</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 mt-12 lg:mt-0 relative">
            {/* Gradient Frame Container */}
            <div className="relative rounded-[2.5rem] overflow-hidden p-8 sm:p-12 bg-gradient-to-br from-[#E8F5E9] via-[#F1F8E9] to-[#FDFBF7] shadow-2xl">
                {/* Phone Mockup Placeholder */}
                <div className="relative z-10 mx-auto w-64 sm:w-72 bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 overflow-hidden shadow-2xl">
                    <div className="aspect-[9/19] bg-white relative overflow-hidden">
                        {/* Mockup Content */}
                        <div className="absolute top-0 left-0 right-0 h-6 bg-slate-900 z-20 flex justify-center">
                            <div className="w-24 h-4 bg-black rounded-b-xl"></div>
                        </div>
                        <div className="p-4 pt-12 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="h-2 w-8 bg-slate-200 rounded"></div>
                                <div className="h-8 w-8 bg-blue-100 rounded-full"></div>
                            </div>
                            <div className="h-32 bg-blue-50 rounded-xl w-full"></div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="h-24 bg-green-50 rounded-xl"></div>
                                <div className="h-24 bg-orange-50 rounded-xl"></div>
                            </div>
                             <div className="h-8 bg-slate-100 rounded-lg w-full mt-4"></div>
                             <div className="h-8 bg-slate-100 rounded-lg w-full"></div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative circles in background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100/30 rounded-full blur-3xl -ml-16 -mb-16"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
