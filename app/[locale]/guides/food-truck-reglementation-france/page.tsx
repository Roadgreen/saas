import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Shield, FileText, ArrowRight, CheckCircle2, ChefHat,
  ChevronDown, Scale, ClipboardCheck, Euro, Building2,
  Thermometer, AlertTriangle,
} from 'lucide-react';
import { LandingHeader } from '@/components/landing/Header';
import { routing } from '@/i18n/routing';

const BASE_URL = 'https://foodtracks.io';
const ORANGE = '#F97316';
const DARK = '#0D0905';
const TEAL = '#14B8A6';
const GREEN = '#22C55E';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const title = isFr
    ? 'Réglementation Food Truck en France : Guide Complet 2026 | FoodTracks'
    : 'Food Truck Regulations in France: Complete Guide 2026 | FoodTracks';
  const description = isFr
    ? 'Guide complet des réglementations pour food trucks en France : permis, hygiène HACCP, assurances, TVA, normes de sécurité. Sources officielles et conseils pratiques.'
    : 'Complete guide to food truck regulations in France: permits, HACCP hygiene, insurance, VAT, safety standards. Official sources and practical advice.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'réglementation food truck France',
          'permis food truck',
          'hygiène food truck HACCP',
          'assurance food truck',
          'TVA food truck',
          'carte commerçant ambulant',
          'normes food truck',
          'autorisation emplacement food truck',
          'sécurité alimentaire food truck',
        ]
      : [
          'food truck regulations France',
          'food truck permits France',
          'food truck HACCP hygiene',
          'food truck insurance France',
          'food truck VAT France',
          'itinerant trader card France',
          'food truck standards France',
          'food truck location permit France',
          'food safety food truck',
        ],
    alternates: {
      canonical: `${BASE_URL}/${locale}/guides/food-truck-reglementation-france`,
      languages: {
        fr: `${BASE_URL}/fr/guides/food-truck-reglementation-france`,
        en: `${BASE_URL}/en/guides/food-truck-reglementation-france`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/guides/food-truck-reglementation-france`,
      siteName: 'FoodTracks',
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: isFr
            ? 'Réglementation Food Truck en France 2026'
            : 'Food Truck Regulations in France 2026',
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og-image.png`],
    },
  };
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group" style={{ borderBottom: '1px solid #EDEBE8' }}>
      <summary className="w-full flex items-center justify-between py-7 text-left gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="font-semibold text-gray-900 text-base md:text-lg group-hover:text-orange-600 transition-colors duration-200">
          {question}
        </span>
        <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center group-open:bg-orange-50 bg-gray-50 transition-all">
          <ChevronDown className="h-4 w-4 text-gray-400 group-open:text-orange-500 group-open:rotate-180 transition-transform duration-300" />
        </div>
      </summary>
      <p className="pb-8 text-sm md:text-base leading-[1.8] max-w-2xl text-gray-500">{answer}</p>
    </details>
  );
}

export default async function ReglementationFrancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === 'fr';

  /* ─── Schema.org ─────────────────────────────────────────── */

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'FoodTracks', item: `${BASE_URL}/${locale}` },
      {
        '@type': 'ListItem',
        position: 2,
        name: isFr ? 'Guides' : 'Guides',
        item: `${BASE_URL}/${locale}/guides`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: isFr ? 'Réglementation food truck' : 'Food truck regulations',
        item: `${BASE_URL}/${locale}/guides/food-truck-reglementation-france`,
      },
    ],
  };

  const faqItems = isFr
    ? [
        {
          question: 'Quel statut juridique choisir pour un food truck ?',
          answer:
            'Le choix dépend de votre situation : la micro-entreprise (auto-entrepreneur) est idéale pour démarrer avec un CA inférieur à 188 700 €, grâce à sa simplicité comptable et ses charges réduites. La SARL convient aux projets à plusieurs associés avec une responsabilité limitée. La SAS/SASU offre plus de souplesse pour la rémunération du dirigeant et l\'entrée d\'investisseurs. L\'EURL est adaptée à un entrepreneur seul souhaitant séparer patrimoine personnel et professionnel.',
        },
        {
          question: 'La carte de commerçant ambulant est-elle obligatoire ?',
          answer:
            'Oui, la carte de commerçant ambulant est obligatoire dès que vous exercez votre activité en dehors de la commune de domiciliation de votre entreprise. Elle est délivrée par le Centre de Formalités des Entreprises (CFE) ou la Chambre des Métiers et de l\'Artisanat (CMA). Sa validité est de 4 ans et elle est renouvelable. Le coût est d\'environ 30 €. Si vous exercez uniquement dans votre commune de domiciliation, elle n\'est pas requise.',
        },
        {
          question: 'Comment obtenir un emplacement sur la voie publique ?',
          answer:
            'Pour occuper le domaine public, vous devez obtenir une Autorisation d\'Occupation Temporaire (AOT) auprès de la mairie. La demande se fait généralement en déposant un dossier à la mairie ou à la préfecture. Pour les marchés communaux, vous devez obtenir un droit de place auprès du placier municipal. Les tarifs varient selon les communes (de 5 à 30 € par jour en moyenne). Sur propriété privée (parking de supermarché, terrain privé), un accord écrit du propriétaire suffit.',
        },
        {
          question: 'Quelles sont les normes d\'hygiène obligatoires ?',
          answer:
            'Depuis 2012, au moins une personne de l\'établissement doit avoir suivi une formation HACCP de 14 heures minimum. Vous devez mettre en place un Plan de Maîtrise Sanitaire (PMS) incluant la traçabilité des produits, le respect de la chaîne du froid (0 à 3°C pour les produits réfrigérés), le nettoyage et la désinfection réguliers. Votre food truck doit être déclaré auprès de la DDPP (Direction Départementale de la Protection des Populations) qui peut effectuer des contrôles inopinés.',
        },
        {
          question: 'Quelles assurances sont obligatoires ?',
          answer:
            'La Responsabilité Civile Professionnelle (RC Pro) est indispensable pour couvrir les dommages causés aux tiers (intoxication alimentaire, accident). L\'assurance du véhicule aménagé est obligatoire et doit couvrir à la fois la circulation et l\'activité de vente. Une garantie protection juridique est fortement recommandée en cas de litige. Le coût total moyen se situe entre 1 500 et 3 000 € par an selon les garanties.',
        },
        {
          question: 'Quel taux de TVA appliquer ?',
          answer:
            'La TVA applicable est de 10 % pour la vente de produits alimentaires préparés destinés à une consommation immédiate (plats, sandwichs, boissons non alcoolisées). Le taux passe à 5,5 % pour les produits alimentaires emballés destinés à une consommation différée. Les boissons alcoolisées sont soumises au taux normal de 20 %. En micro-entreprise, vous êtes exonéré de TVA en dessous du seuil de 36 800 € de CA annuel (franchise en base de TVA).',
        },
        {
          question: 'Quelles sont les normes de sécurité pour le véhicule ?',
          answer:
            'Le véhicule doit passer un contrôle technique tous les deux ans (annuel pour les véhicules de plus de 3,5 tonnes). Les installations gaz doivent respecter la norme NF EN 203 avec un certificat de conformité. Vous devez disposer d\'au moins un extincteur de type ABC accessible. La ventilation et l\'extraction des fumées sont obligatoires. L\'installation électrique doit être conforme à la norme NF C 15-100. Un détecteur de gaz est fortement recommandé.',
        },
        {
          question: 'Quels affichages sont obligatoires dans un food truck ?',
          answer:
            'Vous devez afficher les prix TTC de manière lisible et visible de l\'extérieur. La liste des 14 allergènes doit être accessible (affichage ou sur demande). L\'origine des viandes bovines doit être indiquée. Si vous servez des boissons alcoolisées, une licence de débit de boissons est nécessaire (licence « petite restauration » ou licence III/IV). Le numéro SIRET et la dénomination sociale doivent être visibles sur le véhicule.',
        },
      ]
    : [
        {
          question: 'What legal structure should you choose for a food truck?',
          answer:
            'It depends on your situation: micro-enterprise (auto-entrepreneur) is ideal for starting out with revenue below EUR 188,700, thanks to simple bookkeeping and reduced charges. SARL suits multi-partner projects with limited liability. SAS/SASU offers more flexibility for director remuneration and investor entry. EURL is suited for solo entrepreneurs wanting to separate personal and professional assets.',
        },
        {
          question: 'Is the itinerant trader card mandatory?',
          answer:
            'Yes, the carte de commerçant ambulant is mandatory as soon as you operate outside the municipality where your business is registered. It is issued by the CFE (Business Formalities Centre) or the CMA (Chamber of Crafts). It is valid for 4 years and renewable. The cost is approximately EUR 30. If you only operate within your registered municipality, it is not required.',
        },
        {
          question: 'How do you obtain a public space pitch?',
          answer:
            'To occupy public land, you need an AOT (Temporary Occupation Authorisation) from the local town hall. The application is usually submitted to the municipality or prefecture. For municipal markets, you need a market pitch right from the market manager. Fees vary by municipality (EUR 5-30 per day on average). On private property (supermarket car parks, private land), a written agreement from the owner is sufficient.',
        },
        {
          question: 'What are the mandatory hygiene standards?',
          answer:
            'Since 2012, at least one person in the establishment must have completed a minimum 14-hour HACCP training. You must implement a Sanitary Control Plan (PMS) including product traceability, cold chain compliance (0-3 degrees C for refrigerated products), and regular cleaning and disinfection. Your food truck must be declared to the DDPP (Departmental Directorate for Consumer Protection) which may carry out unannounced inspections.',
        },
        {
          question: 'What insurance is mandatory?',
          answer:
            'Professional Liability Insurance (RC Pro) is essential to cover third-party damages (food poisoning, accidents). Commercial vehicle insurance is mandatory and must cover both driving and trading activity. Legal protection cover is strongly recommended for disputes. The average total cost is between EUR 1,500 and EUR 3,000 per year depending on coverage.',
        },
        {
          question: 'What VAT rate applies?',
          answer:
            'VAT of 10% applies to prepared food products for immediate consumption (dishes, sandwiches, non-alcoholic drinks). The rate drops to 5.5% for packaged food products for deferred consumption. Alcoholic beverages are subject to the standard 20% rate. Under micro-enterprise status, you are VAT-exempt below the EUR 36,800 annual revenue threshold (franchise en base de TVA).',
        },
        {
          question: 'What are the vehicle safety standards?',
          answer:
            'The vehicle must pass a technical inspection every two years (annually for vehicles over 3.5 tonnes). Gas installations must comply with NF EN 203 standard with a compliance certificate. You must have at least one accessible ABC-type fire extinguisher. Ventilation and smoke extraction are mandatory. Electrical installation must comply with NF C 15-100 standard. A gas detector is strongly recommended.',
        },
        {
          question: 'What signage is mandatory in a food truck?',
          answer:
            'You must display prices including VAT in a legible manner visible from outside. The list of 14 allergens must be accessible (displayed or available on request). The origin of beef must be indicated. If serving alcoholic beverages, a drinks licence is required (licence "petite restauration" or licence III/IV). The SIRET number and company name must be visible on the vehicle.',
        },
      ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  /* ─── Guide sections data ──────────────────────────────── */

  const sections = isFr
    ? [
        {
          id: 'statut-juridique',
          icon: <Scale className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '1. Statut juridique et immatriculation',
          intro:
            'Le choix du statut juridique est la première étape pour lancer votre food truck. Il détermine votre régime fiscal, vos charges sociales et votre responsabilité.',
          items: [
            'Micro-entreprise (auto-entrepreneur) : idéal pour démarrer, CA plafonné à 188 700 € (vente) ou 77 700 € (services). Comptabilité simplifiée, pas de TVA sous le seuil de franchise.',
            'SARL / EURL : responsabilité limitée aux apports, adaptée si vous avez un ou plusieurs associés. Capital social libre (1 € minimum).',
            'SAS / SASU : souplesse statutaire maximale, facilite l\'entrée d\'investisseurs. Le dirigeant est assimilé salarié (meilleure protection sociale).',
            'Inscription obligatoire au RCS (Registre du Commerce et des Sociétés) via le guichet unique de l\'INPI (formalites.entreprises.gouv.fr).',
            'Code APE typique : 56.10C (restauration rapide) attribué par l\'INSEE lors de l\'immatriculation.',
            'Délai moyen : 1 à 4 semaines pour obtenir votre extrait Kbis selon le statut choisi.',
          ],
        },
        {
          id: 'carte-commercant',
          icon: <FileText className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '2. Carte de commerçant ambulant',
          intro:
            'La carte de commerçant ambulant est un document administratif indispensable pour exercer une activité commerciale itinérante en dehors de votre commune de domiciliation.',
          items: [
            'Obligatoire dès que vous exercez en dehors de la commune où est domiciliée votre entreprise (article L.123-29 du Code de commerce).',
            'Demande auprès du CFE (Centre de Formalités des Entreprises) ou de la CMA (Chambre des Métiers et de l\'Artisanat) selon votre activité.',
            'Validité de 4 ans, renouvelable sur demande avant expiration.',
            'Coût : environ 30 € (tarif fixé par arrêté).',
            'Vous devez la présenter lors de tout contrôle sur la voie publique ou sur un marché.',
            'Exception : si vous exercez uniquement dans votre commune de domiciliation, cette carte n\'est pas requise.',
          ],
        },
        {
          id: 'autorisations-emplacement',
          icon: <Building2 className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '3. Autorisations d\'emplacement',
          intro:
            'L\'accès aux emplacements est soumis à des autorisations spécifiques selon que vous vous installez sur le domaine public, un marché ou une propriété privée.',
          items: [
            'Domaine public : Autorisation d\'Occupation Temporaire (AOT) délivrée par la mairie. Durée variable (journalière, mensuelle, annuelle). Redevance fixée par la commune.',
            'Marchés communaux : inscription auprès du placier municipal, droit de place à payer (5 à 30 € / jour selon la commune et l\'emplacement).',
            'Propriété privée : accord écrit du propriétaire (bail, convention). Pas d\'AOT nécessaire, mais respect du PLU (Plan Local d\'Urbanisme).',
            'Événements et festivals : convention d\'occupation spécifique avec l\'organisateur. Vérifiez les assurances complémentaires requises.',
            'Stationnement interdit devant les commerces alimentaires concurrents dans un périmètre défini par arrêté municipal.',
            'Certaines communes imposent une charte graphique ou des horaires d\'ouverture pour les food trucks sur le domaine public.',
          ],
        },
        {
          id: 'hygiene-haccp',
          icon: <ClipboardCheck className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '4. Normes d\'hygiène et HACCP',
          intro:
            'La sécurité alimentaire est encadrée par le règlement européen CE n°852/2004 et le paquet hygiène. Les food trucks sont soumis aux mêmes obligations que les restaurants.',
          items: [
            'Formation HACCP obligatoire : au moins une personne de l\'établissement doit avoir suivi une formation de 14 heures minimum (décret 2011-731). Organismes agréés par la DRAAF.',
            'Plan de Maîtrise Sanitaire (PMS) : document obligatoire décrivant vos procédures d\'hygiène, de traçabilité, de gestion des non-conformités et de rappel produits.',
            'Chaîne du froid : produits réfrigérés entre 0 et 3°C, surgelés à -18°C minimum. Relevés de température quotidiens obligatoires avec fiches d\'enregistrement.',
            'Traçabilité : conserver les bons de livraison et étiquettes fournisseurs pendant 5 ans. Chaque produit doit pouvoir être retracé de l\'achat à la vente.',
            'Déclaration DDPP : votre activité doit être déclarée auprès de la Direction Départementale de la Protection des Populations avant ouverture.',
            'Contrôles inopinés : la DDPP peut inspecter votre food truck à tout moment. Les résultats sont publiés sur alim-confiance.gouv.fr.',
            'Eau potable : accès obligatoire à de l\'eau potable courante pour la préparation et le lavage des mains (réservoir de 60 litres minimum recommandé).',
          ],
        },
        {
          id: 'assurances',
          icon: <Shield className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '5. Assurances obligatoires',
          intro:
            'Les assurances protègent votre activité, votre véhicule et les tiers. Certaines sont légalement obligatoires, d\'autres fortement recommandées.',
          items: [
            'Responsabilité Civile Professionnelle (RC Pro) : couvre les dommages corporels, matériels et immatériels causés à des tiers (intoxication alimentaire, brûlure d\'un client, etc.).',
            'Assurance véhicule aménagé : obligatoire, elle doit couvrir le véhicule en circulation ET en stationnement pendant l\'activité de vente. Vérifiez que l\'aménagement intérieur est couvert.',
            'Garantie protection juridique : couvre les frais de procédure en cas de litige avec un client, un fournisseur ou une administration.',
            'Assurance perte d\'exploitation : recommandée pour couvrir la perte de revenus en cas de sinistre (incendie, panne longue, accident).',
            'Multirisque professionnelle : formule globale incluant RC Pro, protection du matériel et de la marchandise.',
            'Coût moyen : 1 500 à 3 000 € / an selon les garanties, la valeur du véhicule et votre chiffre d\'affaires.',
          ],
        },
        {
          id: 'fiscalite-tva',
          icon: <Euro className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '6. Fiscalité et TVA',
          intro:
            'La fiscalité des food trucks suit les règles de la restauration rapide. Le régime dépend de votre statut juridique et de votre chiffre d\'affaires.',
          items: [
            'TVA à 10 % : taux applicable à la vente de produits alimentaires préparés destinés à une consommation immédiate (plats, sandwichs, boissons non alcoolisées).',
            'TVA à 5,5 % : applicable aux produits alimentaires emballés destinés à une consommation différée (bouteilles d\'eau, gâteaux emballés).',
            'TVA à 20 % : taux normal applicable aux boissons alcoolisées.',
            'Franchise en base de TVA : en micro-entreprise, exonération de TVA sous le seuil de 36 800 € de CA annuel (seuil majoré : 39 100 €).',
            'Micro-entreprise : abattement forfaitaire de 71 % sur le CA pour les BIC vente (impôt sur le revenu sur 29 % du CA).',
            'Régime réel simplifié : obligatoire au-delà des seuils micro. Déclarations de TVA trimestrielles ou annuelles.',
            'CFE (Cotisation Foncière des Entreprises) : due chaque année, calculée sur la valeur locative du local professionnel ou sur un montant forfaitaire.',
          ],
        },
        {
          id: 'securite-vehicule',
          icon: <Thermometer className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '7. Normes de sécurité du véhicule',
          intro:
            'Le véhicule aménagé doit respecter des normes strictes de sécurité pour la circulation, la cuisson et le stockage des denrées alimentaires.',
          items: [
            'Contrôle technique : tous les 2 ans pour les véhicules de moins de 3,5 tonnes PTAC, annuel au-delà. Le véhicule doit être immatriculé en catégorie « magasin » sur la carte grise.',
            'Normes gaz : installations conformes à la norme NF EN 203. Certificat de conformité délivré par un organisme agréé (Qualigaz, etc.). Vérification annuelle obligatoire.',
            'Extincteurs : au moins un extincteur de type ABC de 6 kg minimum, accessible et vérifié annuellement. Un extincteur supplémentaire près de la zone de cuisson est recommandé.',
            'Ventilation et extraction : système de ventilation conforme pour évacuer les fumées et vapeurs de cuisson. Hotte aspirante obligatoire avec filtre à graisse.',
            'Installation électrique : conforme à la norme NF C 15-100. Disjoncteur différentiel 30 mA obligatoire. Vérification par un organisme agréé (Consuel) lors de l\'aménagement.',
            'Permis de conduire : permis B suffisant pour les véhicules de moins de 3,5 tonnes PTAC. Permis C requis au-delà, avec FIMO/FCO pour les conducteurs professionnels.',
            'Détecteur de gaz : fortement recommandé (obligatoire dans certaines communes). Détecteur de monoxyde de carbone conseillé.',
          ],
        },
        {
          id: 'affichages-obligatoires',
          icon: <AlertTriangle className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '8. Affichages obligatoires',
          intro:
            'Plusieurs informations doivent être affichées de manière visible et lisible dans et sur votre food truck pour être en conformité.',
          items: [
            'Prix TTC : affichage obligatoire des prix toutes taxes comprises, lisible depuis l\'extérieur du véhicule (arrêté du 3 décembre 1987).',
            'Allergènes : la liste des 14 allergènes majeurs doit être accessible aux clients (affichage visible ou document disponible sur demande — règlement INCO UE n°1169/2011).',
            'Origine des viandes : l\'origine des viandes bovines doit être indiquée (pays de naissance, d\'élevage et d\'abattage). Recommandé pour les autres viandes.',
            'Licence débit de boissons : si vous vendez des boissons alcoolisées, la licence correspondante doit être affichée (petite licence restaurant, licence III ou IV).',
            'Numéro SIRET : votre numéro d\'identification doit être visible sur le véhicule ou sur un document accessible.',
            'Interdiction de vente d\'alcool aux mineurs : affichage obligatoire si vous vendez des boissons alcoolisées.',
            'Règles de protection des données : si vous collectez des données clients (programme fidélité), mention RGPD obligatoire.',
          ],
        },
      ]
    : [
        {
          id: 'legal-structure',
          icon: <Scale className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '1. Legal structure and registration',
          intro:
            'Choosing a legal structure is the first step to launching your food truck. It determines your tax regime, social charges and liability.',
          items: [
            'Micro-enterprise (auto-entrepreneur): ideal for starting out, revenue capped at EUR 188,700 (sales) or EUR 77,700 (services). Simplified accounting, no VAT below the franchise threshold.',
            'SARL / EURL: liability limited to contributions, suitable if you have one or more partners. Minimum share capital of EUR 1.',
            'SAS / SASU: maximum statutory flexibility, facilitates investor entry. The director is treated as an employee (better social protection).',
            'Mandatory registration with the RCS (Trade and Companies Register) via the INPI one-stop shop (formalites.entreprises.gouv.fr).',
            'Typical APE code: 56.10C (fast food) assigned by INSEE upon registration.',
            'Average timeframe: 1 to 4 weeks to obtain your Kbis extract depending on the chosen structure.',
          ],
        },
        {
          id: 'trader-card',
          icon: <FileText className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '2. Itinerant trader card (Carte de commerçant ambulant)',
          intro:
            'The itinerant trader card is an essential administrative document for carrying out mobile commercial activity outside your registered municipality.',
          items: [
            'Mandatory as soon as you operate outside the municipality where your business is registered (article L.123-29 of the Commercial Code).',
            'Application through the CFE (Business Formalities Centre) or the CMA (Chamber of Crafts) depending on your activity.',
            'Valid for 4 years, renewable upon request before expiry.',
            'Cost: approximately EUR 30 (rate set by ministerial order).',
            'You must present it during any inspection on public roads or at a market.',
            'Exception: if you only operate within your registered municipality, this card is not required.',
          ],
        },
        {
          id: 'location-permits',
          icon: <Building2 className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '3. Location permits and authorisations',
          intro:
            'Access to pitches is subject to specific authorisations depending on whether you set up on public land, at a market or on private property.',
          items: [
            'Public land: AOT (Temporary Occupation Authorisation) issued by the town hall. Variable duration (daily, monthly, annual). Fee set by the municipality.',
            'Municipal markets: registration with the market manager, pitch fee payable (EUR 5-30/day depending on municipality and location).',
            'Private property: written agreement from the owner (lease, convention). No AOT needed, but PLU (Local Urban Plan) must be respected.',
            'Events and festivals: specific occupation agreement with the organiser. Check any additional insurance requirements.',
            'Parking prohibited in front of competing food businesses within a perimeter defined by municipal order.',
            'Some municipalities impose graphic charter requirements or opening hours for food trucks on public land.',
          ],
        },
        {
          id: 'hygiene-haccp',
          icon: <ClipboardCheck className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '4. Hygiene standards and HACCP',
          intro:
            'Food safety is governed by EU Regulation EC No 852/2004 and the hygiene package. Food trucks are subject to the same obligations as restaurants.',
          items: [
            'Mandatory HACCP training: at least one person in the establishment must have completed a minimum 14-hour training course (decree 2011-731). Training bodies approved by DRAAF.',
            'Sanitary Control Plan (PMS): mandatory document describing your hygiene procedures, traceability, non-conformity management and product recall protocols.',
            'Cold chain: refrigerated products between 0 and 3 degrees C, frozen products at -18 degrees C minimum. Mandatory daily temperature logs with recording sheets.',
            'Traceability: keep delivery notes and supplier labels for 5 years. Each product must be traceable from purchase to sale.',
            'DDPP declaration: your activity must be declared to the Departmental Directorate for Consumer Protection before opening.',
            'Unannounced inspections: the DDPP may inspect your food truck at any time. Results are published on alim-confiance.gouv.fr.',
            'Drinking water: mandatory access to running drinking water for preparation and handwashing (minimum 60-litre tank recommended).',
          ],
        },
        {
          id: 'insurance',
          icon: <Shield className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '5. Mandatory insurance',
          intro:
            'Insurance protects your business, your vehicle and third parties. Some policies are legally required, others are strongly recommended.',
          items: [
            'Professional Liability Insurance (RC Pro): covers bodily, material and immaterial damage to third parties (food poisoning, customer burns, etc.).',
            'Converted vehicle insurance: mandatory, must cover the vehicle in transit AND while stationary during trading. Ensure the interior conversion is covered.',
            'Legal protection cover: covers legal costs in disputes with customers, suppliers or authorities.',
            'Business interruption insurance: recommended to cover loss of income from an incident (fire, long breakdown, accident).',
            'Multi-risk professional policy: comprehensive package including RC Pro, equipment and goods protection.',
            'Average cost: EUR 1,500 to EUR 3,000/year depending on coverage, vehicle value and your turnover.',
          ],
        },
        {
          id: 'tax-vat',
          icon: <Euro className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '6. Tax and VAT',
          intro:
            'Food truck taxation follows fast-food catering rules. The regime depends on your legal structure and revenue.',
          items: [
            '10% VAT: applicable rate for prepared food products for immediate consumption (dishes, sandwiches, non-alcoholic drinks).',
            '5.5% VAT: applicable to packaged food products for deferred consumption (water bottles, wrapped cakes).',
            '20% VAT: standard rate applicable to alcoholic beverages.',
            'VAT franchise (franchise en base): under micro-enterprise status, VAT exemption below EUR 36,800 annual revenue (increased threshold: EUR 39,100).',
            'Micro-enterprise: flat-rate deduction of 71% on revenue for BIC sales (income tax on 29% of revenue).',
            'Simplified real regime: mandatory above micro thresholds. Quarterly or annual VAT returns.',
            'CFE (Business Property Tax): due annually, calculated on the rental value of the professional premises or a flat-rate amount.',
          ],
        },
        {
          id: 'vehicle-safety',
          icon: <Thermometer className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '7. Vehicle safety standards',
          intro:
            'The converted vehicle must meet strict safety standards for driving, cooking and food storage.',
          items: [
            'Technical inspection: every 2 years for vehicles under 3.5 tonnes GVW, annually above. The vehicle must be registered as "magasin" category on the registration document.',
            'Gas standards: installations compliant with NF EN 203. Compliance certificate issued by an approved body (Qualigaz, etc.). Mandatory annual verification.',
            'Fire extinguishers: at least one ABC-type extinguisher of 6 kg minimum, accessible and inspected annually. An additional extinguisher near the cooking area is recommended.',
            'Ventilation and extraction: compliant ventilation system to evacuate cooking fumes and vapours. Extractor hood with grease filter mandatory.',
            'Electrical installation: compliant with NF C 15-100 standard. 30 mA residual current device mandatory. Inspection by approved body (Consuel) upon conversion.',
            'Driving licence: category B sufficient for vehicles under 3.5 tonnes GVW. Category C required above, with CPC (Certificate of Professional Competence) for professional drivers.',
            'Gas detector: strongly recommended (mandatory in some municipalities). Carbon monoxide detector advised.',
          ],
        },
        {
          id: 'mandatory-signage',
          icon: <AlertTriangle className="h-6 w-6" style={{ color: ORANGE }} />,
          title: '8. Mandatory signage and displays',
          intro:
            'Several pieces of information must be displayed visually and legibly in and on your food truck to ensure compliance.',
          items: [
            'Prices including VAT: mandatory display of prices including all taxes, legible from outside the vehicle (order of 3 December 1987).',
            'Allergens: the list of 14 major allergens must be accessible to customers (visible display or document available on request — EU INCO regulation No 1169/2011).',
            'Meat origin: the origin of beef must be indicated (country of birth, rearing and slaughter). Recommended for other meats.',
            'Drinks licence: if you sell alcoholic beverages, the corresponding licence must be displayed (petite licence restaurant, licence III or IV).',
            'SIRET number: your identification number must be visible on the vehicle or on an accessible document.',
            'No alcohol sales to minors: mandatory display if you sell alcoholic beverages.',
            'Data protection rules: if you collect customer data (loyalty programme), GDPR notice is mandatory.',
          ],
        },
      ];

  const officialSources = isFr
    ? [
        { name: 'Service-Public.fr — Commerçant ambulant', url: 'https://www.service-public.fr/professionnels-entreprises/vosdroits/F22387' },
        { name: 'INPI — Guichet unique des formalités', url: 'https://formalites.entreprises.gouv.fr/' },
        { name: 'DDPP — Sécurité sanitaire', url: 'https://www.economie.gouv.fr/dgccrf/Les-fiches-pratiques' },
        { name: 'CMA France — Chambre des Métiers', url: 'https://www.artisanat.fr/' },
      ]
    : [
        { name: 'Service-Public.fr — Itinerant trader', url: 'https://www.service-public.fr/professionnels-entreprises/vosdroits/F22387' },
        { name: 'INPI — One-stop business formalities', url: 'https://formalites.entreprises.gouv.fr/' },
        { name: 'DDPP — Food safety', url: 'https://www.economie.gouv.fr/dgccrf/Les-fiches-pratiques' },
        { name: 'CMA France — Chamber of Crafts', url: 'https://www.artisanat.fr/' },
      ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <LandingHeader />

      <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
        {/* ══════════════════════════════════════
            HERO
            ══════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-36"
          style={{
            background: `radial-gradient(ellipse 110% 70% at 0% 30%, rgba(249,115,22,0.14) 0%, transparent 50%),
                         radial-gradient(ellipse 80% 60% at 100% 75%, rgba(20,184,166,0.10) 0%, transparent 50%),
                         ${DARK}`,
          }}
        >
          <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-[0.35]" />
          <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <nav className="flex items-center justify-center gap-2 text-xs" style={{ color: '#6B7280' }}>
                <Link href={`/${locale}`} className="hover:text-white transition-colors">FoodTracks</Link>
                <span>/</span>
                <Link href={`/${locale}/guides`} className="hover:text-white transition-colors">
                  {isFr ? 'Guides' : 'Guides'}
                </Link>
                <span>/</span>
                <span style={{ color: ORANGE }}>
                  {isFr ? 'Réglementation' : 'Regulations'}
                </span>
              </nav>

              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold border"
                style={{ backgroundColor: 'rgba(249,115,22,0.12)', borderColor: 'rgba(249,115,22,0.30)', color: ORANGE }}
              >
                <Shield className="h-4 w-4" />
                {isFr ? 'Guide réglementaire · Mis à jour mars 2026' : 'Regulatory guide · Updated March 2026'}
              </div>

              <h1 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                {isFr
                  ? 'Réglementation Food Truck en France'
                  : 'Food Truck Regulations in France'}
              </h1>

              <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#9CA3AF' }}>
                {isFr
                  ? 'Le guide complet et à jour des obligations légales, sanitaires et fiscales pour exploiter un food truck en France en 2026. Sources officielles, conseils pratiques et check-lists.'
                  : 'The complete, up-to-date guide to legal, sanitary and tax obligations for operating a food truck in France in 2026. Official sources, practical advice and checklists.'}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href={`/${locale}/register`}>
                  <button
                    className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-10 py-4 text-base text-white"
                    style={{ backgroundColor: ORANGE, boxShadow: '0 16px 48px -4px rgba(249,115,22,0.4)' }}
                  >
                    <ChefHat className="h-5 w-5" />
                    {isFr ? 'Gérez votre food truck' : 'Manage your food truck'}
                  </button>
                </Link>
                <a
                  href="#statut-juridique"
                  className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-white"
                  style={{ color: '#9CA3AF' }}
                >
                  {isFr ? 'Lire le guide' : 'Read the guide'}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            GUIDE CONTENT SECTIONS
            ══════════════════════════════════════ */}
        {sections.map((section, idx) => (
          <section key={idx} className="py-16 bg-white">
            <div className="container mx-auto px-5 sm:px-8 lg:px-16">
              <div className="max-w-4xl mx-auto">
                <div className="rounded-2xl p-8 md:p-12" style={{ backgroundColor: '#FAFAF8', border: '1px solid #EDEBE8' }}>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: 'rgba(249,115,22,0.10)', border: '1px solid rgba(249,115,22,0.20)' }}>
                      {section.icon}
                    </div>
                    <div>
                      <h2
                        id={section.id}
                        className="font-jakarta text-2xl md:text-3xl font-bold text-gray-900 mb-3"
                      >
                        {section.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                        {section.intro}
                      </p>
                      <ul className="mt-4 space-y-3">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: GREEN }} />
                            <span className="text-sm md:text-base text-gray-700 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* ══════════════════════════════════════
            SOURCES OFFICIELLES
            ══════════════════════════════════════ */}
        <section className="py-16" style={{ backgroundColor: '#FAFAF8' }}>
          <div className="container mx-auto px-5 sm:px-8 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-jakarta text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                {isFr ? 'Sources officielles' : 'Official sources'}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {officialSources.map((source, i) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-5 rounded-xl bg-white transition-all hover:shadow-md group"
                    style={{ border: '1px solid #EDEBE8' }}
                  >
                    <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: 'rgba(249,115,22,0.08)' }}>
                      <FileText className="h-5 w-5" style={{ color: ORANGE }} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors">
                      {source.name}
                    </span>
                    <ArrowRight className="h-4 w-4 ml-auto text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            INTERNAL LINKS
            ══════════════════════════════════════ */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <p className="text-sm text-gray-400 mb-4 text-center">
              {isFr ? 'Aller plus loin' : 'Go further'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/guides/seuil-rentabilite-food-truck`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Calculateur seuil de rentabilité' : 'Break-even calculator'}
              </Link>
              <Link
                href={`/${locale}/fonctionnalites/gestion-stock`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Gestion de stock en temps réel' : 'Real-time inventory management'}
              </Link>
              <Link
                href={`/${locale}/fonctionnalites/predictions-ventes`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Prédictions de ventes IA' : 'AI sales forecasting'}
              </Link>
              <Link
                href={`/${locale}/fonctionnalites/scan-factures`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Scan de factures OCR' : 'OCR invoice scanning'}
              </Link>
              <Link
                href={`/${locale}/ville/paris`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Food truck Paris' : 'Food truck Paris'}
              </Link>
              <Link
                href={`/${locale}/ville/lyon`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Food truck Lyon' : 'Food truck Lyon'}
              </Link>
              <Link
                href={`/${locale}/ville/bordeaux`}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 underline underline-offset-4"
              >
                {isFr ? 'Food truck Bordeaux' : 'Food truck Bordeaux'}
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FAQ
            ══════════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-14">
              <h2
                id="faq"
                className="font-jakarta text-3xl md:text-4xl font-bold text-gray-900"
              >
                {isFr ? 'Questions fréquentes' : 'Frequently Asked Questions'}
              </h2>
            </div>
            <div>
              {faqItems.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FINAL CTA
            ══════════════════════════════════════ */}
        <section
          className="relative py-24 overflow-hidden"
          style={{
            background: `radial-gradient(ellipse 80% 60% at center 40%, rgba(249,115,22,0.18) 0%, transparent 70%), ${DARK}`,
          }}
        >
          <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
          <div className="container relative mx-auto px-4 max-w-3xl text-center space-y-8">
            <h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {isFr
                ? 'Gérez votre food truck en toute conformité'
                : 'Manage your food truck in full compliance'}
            </h2>
            <p className="text-xl" style={{ color: '#8B8B8B' }}>
              {isFr
                ? 'FoodTracks vous aide à respecter les normes : traçabilité automatique, suivi HACCP, gestion de stock conforme. Gratuit, sans carte bancaire.'
                : 'FoodTracks helps you stay compliant: automatic traceability, HACCP tracking, compliant stock management. Free, no credit card.'}
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href={`/${locale}/register`}>
                <button
                  className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-12 py-5 text-lg text-white"
                  style={{ backgroundColor: ORANGE, boxShadow: '0 16px 48px -4px rgba(249,115,22,0.4)' }}
                >
                  <ChefHat className="h-5 w-5" />
                  {isFr ? 'Commencer gratuitement' : 'Start for free'}
                </button>
              </Link>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                {isFr
                  ? 'Sans carte bancaire · Sans engagement · Opérationnel en 30 minutes'
                  : 'No credit card · No commitment · Operational in 30 minutes'}
              </p>
            </div>

            {/* Internal links in CTA */}
            <div className="mt-10 pt-8 border-t text-left" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-semibold mb-4" style={{ color: '#9CA3AF' }}>
                {isFr ? 'Guides liés' : 'Related guides'}
              </p>
              <ul className="space-y-2">
                {[
                  {
                    href: `/${locale}/guides/gestion-food-truck`,
                    label: isFr
                      ? '→ Guide complet de la gestion food truck'
                      : '→ Complete food truck management guide',
                  },
                  {
                    href: `/${locale}/guides/seuil-rentabilite-food-truck`,
                    label: isFr
                      ? '→ Calculateur seuil de rentabilité food truck'
                      : '→ Food truck break-even calculator',
                  },
                  {
                    href: `/${locale}/fonctionnalites/gestion-stock`,
                    label: isFr
                      ? '→ Gestion de stock food truck en temps réel'
                      : '→ Real-time food truck stock management',
                  },
                  {
                    href: `/${locale}/fonctionnalites/scan-factures`,
                    label: isFr
                      ? '→ Scan de factures fournisseurs (OCR)'
                      : '→ Supplier invoice scanning (OCR)',
                  },
                ].map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm hover:underline transition-colors"
                      style={{ color: ORANGE }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Footer minimal */}
        <footer
          className="py-12 relative"
          style={{ backgroundColor: '#070503', borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="container mx-auto px-5 sm:px-8 lg:px-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <Link href={`/${locale}`} className="flex items-center gap-2">
                <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />
                <span className="font-jakarta text-lg font-bold text-white tracking-tight">FoodTracks</span>
              </Link>
              <div className="flex items-center gap-6 text-sm" style={{ color: '#4B5563' }}>
                <Link href={`/${locale}/pricing`} className="hover:text-gray-300 transition-colors">{isFr ? 'Tarifs' : 'Pricing'}</Link>
                <Link href={`/${locale}/blog`} className="hover:text-gray-300 transition-colors">Blog</Link>
                <Link href={`/${locale}/guides`} className="hover:text-gray-300 transition-colors">{isFr ? 'Guides' : 'Guides'}</Link>
                <Link href={`/${locale}/privacy`} className="hover:text-gray-300 transition-colors">{isFr ? 'Confidentialité' : 'Privacy'}</Link>
              </div>
              <p className="text-xs" style={{ color: '#374151' }}>
                © {new Date().getFullYear()} FoodTracks
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
