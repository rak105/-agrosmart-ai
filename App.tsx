import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sprout, 
  Wind, 
  Droplets, 
  Thermometer, 
  CheckCircle2, 
  TrendingUp, 
  Leaf, 
  ArrowRight,
  Info,
  Loader2,
  BarChart3,
  Waves
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { getCropRecommendations } from './services/geminiService';
import { SoilData, ClimateData, CropRecommendation, RecommendationResponse } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [soil, setSoil] = useState<SoilData>({
    nitrogen: 80,
    phosphorus: 40,
    potassium: 40,
    ph: 6.5,
  });

  const [climate, setClimate] = useState<ClimateData>({
    temperature: 25,
    humidity: 70,
    rainfall: 1000,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  const chartData = useMemo(() => {
    if (!result) return [];
    return result.recommendations.map(rec => ({
      name: rec.cropName,
      profit: rec.expectedProfitability === 'High' ? 100 : rec.expectedProfitability === 'Medium' ? 60 : 30,
      confidence: rec.confidence * 100,
    }));
  }, [result]);

 const handleAnalyze = async () => {
  setLoading(true);
  try {
    const fakeData = {
      summary: "Test working correctly ✅",
      recommendations: [
        {
          cropName: "Rice",
          expectedProfitability: "High",
          confidence: 0.9,
          growthDurationDays: 120,
          description: "Suitable for your soil.",
          sowingTips: ["Use good seeds", "Maintain water"],
        }
      ]
    };
    setResult(fakeData as any);
  } catch (error) {
    alert("Error");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white">
            <Sprout size={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">AgroSmart AI</h1>
        </div>
        <p className="text-slate-500 max-w-xl">
          Enter your soil profile and local climate data to get AI-powered crop recommendations and market analysis.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <section className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Leaf className="text-brand-primary" size={18} />
              <h2 className="font-semibold">Soil Data</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { key: 'nitrogen', label: 'Nitrogen (N)', min: 0, max: 140, unit: 'mg/kg' },
                { key: 'phosphorus', label: 'Phosphorus (P)', min: 0, max: 100, unit: 'mg/kg' },
                { key: 'potassium', label: 'Potassium (K)', min: 0, max: 100, unit: 'mg/kg' },
                { key: 'ph', label: 'Soil pH', min: 0, max: 14, step: 0.1, unit: 'pH' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="input-label flex justify-between">
                    <span>{field.label}</span>
                    <span className="text-slate-900 font-medium">
                      {(soil as any)[field.key]} {field.unit}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={(field as any).step || 1}
                    value={(soil as any)[field.key]}
                    onChange={(e) => setSoil(p => ({ ...p, [field.key]: parseFloat(e.target.value) }))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Wind className="text-brand-primary" size={18} />
              <h2 className="font-semibold">Climate Data</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Temperature</label>
                  <div className="relative">
                    <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="number"
                      value={climate.temperature}
                      onChange={(e) => setClimate(p => ({ ...p, temperature: parseFloat(e.target.value) }))}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">Humidity (%)</label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="number"
                      value={climate.humidity}
                      onChange={(e) => setClimate(p => ({ ...p, humidity: parseFloat(e.target.value) }))}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="input-label flex justify-between">
                  <span>Annual Rainfall</span>
                  <span className="text-slate-900 font-medium">{climate.rainfall} mm</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  value={climate.rainfall}
                  onChange={(e) => setClimate(p => ({ ...p, rainfall: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
            </div>
          </section>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-dark text-white font-medium py-4 rounded-3xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing Analysis...
              </>
            ) : (
              <>
                <TrendingUp size={20} />
                Analyze & Recommend
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card h-[600px] flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <BarChart3 className="text-slate-300" size={40} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready for Analysis</h3>
                <p className="text-slate-500 max-w-sm mb-8">
                  Fill in the soil and weather parameters on the left to generate intelligent crop insights.
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 size={14} />
                    Historical Data Scaling
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 size={14} />
                    Economic Forecasting
                  </div>
                </div>
              </motion.div>
            ) : loading ? (
              <div className="glass-card h-[600px] flex flex-col items-center justify-center p-12 space-y-6">
                <Loader2 size={48} className="animate-spin text-brand-primary" />
                <div className="text-center">
                  <p className="font-medium">Gemini is analyzing soil composition...</p>
                  <p className="text-sm text-slate-500">Comparing regional rainfall patterns and market trends.</p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Summary Card */}
                <section className="glass-card p-8 bg-brand-light/50 border-brand-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="text-brand-primary" size={20} />
                    <h2 className="font-semibold text-brand-dark">Agricultural Outlook</h2>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {result.summary}
                  </p>
                </section>

                {/* Recommendations List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.recommendations.map((rec, idx) => (
                    <motion.div
                      key={rec.cropName}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="glass-card p-6 hover:border-brand-primary/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold group-hover:text-brand-primary transition-colors">{rec.cropName}</h3>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                            {rec.growthDurationDays} Days Growth
                          </span>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-bold uppercase",
                          rec.expectedProfitability === 'High' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {rec.expectedProfitability} Profit
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-6 line-clamp-2">
                        {rec.description}
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Match Confidence</span>
                          <span className="font-bold text-brand-primary">{(rec.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rec.confidence * 100}%` }}
                            className="h-full bg-brand-primary"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2 text-[10px]">
                        {rec.sowingTips.slice(0, 2).map((tip, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-full text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                            {tip}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Analytical Charts */}
                <section className="glass-card p-8">
                  <div className="flex items-center gap-3 mb-10">
                    <BarChart3 className="text-brand-primary" size={20} />
                    <h2 className="font-semibold">Economic & Confidence Benchmarks</h2>
                  </div>
                  
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="profit" radius={[10, 10, 0, 0]} barSize={40}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.profit > 80 ? '#16a34a' : entry.profit > 50 ? '#fbbf24' : '#94a3b8'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-8 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-brand-primary rounded-sm" /> Profit Index
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-300 rounded-sm" /> Market Volatility
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Background Decor */}
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
    </div>
  );
}
