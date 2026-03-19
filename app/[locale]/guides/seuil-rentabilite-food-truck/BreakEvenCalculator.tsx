'use client';

import { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';

const ORANGE = '#F97316';

interface Props {
  isFr: boolean;
}

export function BreakEvenCalculator({ isFr }: Props) {
  const [chargesFixesMensuel, setChargesFixesMensuel] = useState('');
  const [prixMoyenTicket, setPrixMoyenTicket] = useState('');
  const [tauxMarge, setTauxMarge] = useState('');
  const [result, setResult] = useState<null | { ticketsJour: number; caJour: number; caMinMensuel: number }>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    const charges = parseFloat(chargesFixesMensuel.replace(',', '.'));
    const ticket = parseFloat(prixMoyenTicket.replace(',', '.'));
    const marge = parseFloat(tauxMarge.replace(',', '.'));

    if (isNaN(charges) || isNaN(ticket) || isNaN(marge)) {
      setError(isFr ? 'Veuillez remplir tous les champs avec des valeurs numériques.' : 'Please fill all fields with numeric values.');
      return;
    }
    if (charges <= 0 || ticket <= 0 || marge <= 0) {
      setError(isFr ? 'Toutes les valeurs doivent être supérieures à 0.' : 'All values must be greater than 0.');
      return;
    }
    if (marge >= 100) {
      setError(isFr ? 'Le taux de marge doit être inférieur à 100%.' : 'Margin rate must be less than 100%.');
      return;
    }

    // Seuil rentabilité = Charges fixes / Taux de marge brute
    // Taux de marge brute = marge / 100 (ex: 65%)
    // CA minimum mensuel = charges fixes / taux marge brute
    const tauxMargeDecimal = marge / 100;
    const caMinMensuel = charges / tauxMargeDecimal;
    // Tickets/jour = CA min mensuel / (prix ticket * 22 jours de travail)
    const joursOuverture = 22;
    const caJour = caMinMensuel / joursOuverture;
    const ticketsJour = Math.ceil(caJour / ticket);

    setResult({ ticketsJour, caJour: Math.round(caJour), caMinMensuel: Math.round(caMinMensuel) });
  };

  const reset = () => {
    setChargesFixesMensuel('');
    setPrixMoyenTicket('');
    setTauxMarge('');
    setResult(null);
    setError('');
  };

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: 'rgba(249,115,22,0.30)', backgroundColor: '#FFFBF7' }}
    >
      {/* Header */}
      <div
        className="px-6 py-5 flex items-center gap-3"
        style={{ backgroundColor: ORANGE }}
      >
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Calculator className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg leading-tight">
            {isFr ? 'Calculateur de seuil de rentabilité' : 'Break-Even Calculator'}
          </h3>
          <p className="text-white/80 text-sm">
            {isFr ? 'Résultat instantané — sans inscription' : 'Instant result — no sign-up'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 space-y-5">
        <div className="grid md:grid-cols-3 gap-5">
          {/* Charges fixes */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {isFr ? 'Charges fixes/mois (€)' : 'Fixed costs/month (€)'}
            </label>
            <input
              type="number"
              min="0"
              step="10"
              placeholder={isFr ? 'ex : 2500' : 'e.g. 2500'}
              value={chargesFixesMensuel}
              onChange={(e) => setChargesFixesMensuel(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all bg-white"
              style={{ '--tw-ring-color': ORANGE } as React.CSSProperties}
            />
            <p className="text-xs text-gray-400">
              {isFr ? 'Leasing, assurances, carburant, salaires...' : 'Lease, insurance, fuel, wages...'}
            </p>
          </div>

          {/* Prix moyen ticket */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {isFr ? 'Prix moyen par ticket (€)' : 'Average ticket price (€)'}
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              placeholder={isFr ? 'ex : 12' : 'e.g. 12'}
              value={prixMoyenTicket}
              onChange={(e) => setPrixMoyenTicket(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all bg-white"
              style={{ '--tw-ring-color': ORANGE } as React.CSSProperties}
            />
            <p className="text-xs text-gray-400">
              {isFr ? 'Commande moyenne d\'un client' : 'Average customer order'}
            </p>
          </div>

          {/* Taux de marge */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              {isFr ? 'Taux de marge brute (%)' : 'Gross margin rate (%)'}
            </label>
            <input
              type="number"
              min="0"
              max="99"
              step="1"
              placeholder={isFr ? 'ex : 65' : 'e.g. 65'}
              value={tauxMarge}
              onChange={(e) => setTauxMarge(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all bg-white"
              style={{ '--tw-ring-color': ORANGE } as React.CSSProperties}
            />
            <p className="text-xs text-gray-400">
              {isFr ? 'Marge après matières premières' : 'Margin after food costs'}
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={calculate}
            className="flex-1 py-3.5 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-md"
            style={{ backgroundColor: ORANGE, boxShadow: '0 8px 24px -4px rgba(249,115,22,0.35)' }}
          >
            {isFr ? 'Calculer mon seuil de rentabilité' : 'Calculate my break-even point'}
          </button>
          {result && (
            <button
              onClick={reset}
              className="px-5 py-3.5 rounded-xl font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all text-sm"
            >
              {isFr ? 'Réinitialiser' : 'Reset'}
            </button>
          )}
        </div>

        {/* Result */}
        {result && (
          <div
            className="rounded-2xl p-6 border-2"
            style={{ borderColor: ORANGE, backgroundColor: '#FFF8F5' }}
          >
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-5 w-5" style={{ color: ORANGE }} />
              <h4 className="font-bold text-gray-900 text-lg">
                {isFr ? 'Votre seuil de rentabilité' : 'Your break-even point'}
              </h4>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-white border border-orange-100">
                <div className="text-3xl font-extrabold" style={{ color: ORANGE }}>
                  {result.ticketsJour}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">
                  {isFr ? 'tickets/jour' : 'tickets/day'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {isFr ? 'minimum à réaliser' : 'minimum to achieve'}
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white border border-orange-100">
                <div className="text-3xl font-extrabold text-gray-800">
                  {result.caJour}€
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">
                  {isFr ? 'CA/jour minimum' : 'Min. revenue/day'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {isFr ? 'sur base de 22 jours/mois' : 'based on 22 days/month'}
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white border border-orange-100">
                <div className="text-3xl font-extrabold text-gray-800">
                  {result.caMinMensuel}€
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">
                  {isFr ? 'CA mensuel minimum' : 'Min. monthly revenue'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {isFr ? 'pour couvrir vos charges' : 'to cover your costs'}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              {isFr
                ? `Pour couvrir vos charges fixes de ${parseFloat(chargesFixesMensuel.replace(',', '.')).toFixed(0)}€/mois avec un taux de marge de ${tauxMarge}%, vous devez réaliser au moins ${result.ticketsJour} ventes par jour (à ${prixMoyenTicket}€ de ticket moyen) sur 22 jours de travail.`
                : `To cover your fixed costs of €${parseFloat(chargesFixesMensuel.replace(',', '.')).toFixed(0)}/month with a ${tauxMarge}% margin rate, you need at least ${result.ticketsJour} sales per day (at €${prixMoyenTicket} average ticket) over 22 working days.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
