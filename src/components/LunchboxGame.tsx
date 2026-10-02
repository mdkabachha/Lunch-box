import React, { useState } from 'react';
import { FoodItem } from '../types/dialogue';
import { HEALTHY_FOOD_DATABASE } from '../data/dialogueData';
import { ttsService } from '../services/ttsService';
import { Utensils, Volume2, ShieldCheck, AlertTriangle, Sparkles, Plus, Trash2, Search } from 'lucide-react';

export const LunchboxGame: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState<FoodItem>(HEALTHY_FOOD_DATABASE[0]);
  const [packedLunch, setPackedLunch] = useState<FoodItem[]>([
    HEALTHY_FOOD_DATABASE[0], // Chapati
    HEALTHY_FOOD_DATABASE[1], // Idli Chutney
  ]);
  const [customFoodQuery, setCustomFoodQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customAnalysis, setCustomAnalysis] = useState<any>(null);

  const handleSpeakComment = (text: string, speaker: 'Tillu' | 'Millu') => {
    ttsService.speak({
      text,
      speaker,
      voiceName: speaker === 'Tillu' ? 'Puck' : 'Kore',
      style: `${speaker} young schoolgirl talking enthusiastically about healthy food`,
    });
  };

  const handleAddToLunchbox = (item: FoodItem) => {
    if (packedLunch.some((f) => f.id === item.id)) return;
    if (packedLunch.length >= 4) {
      alert('लंचबॉक्स भर गया है! अधिकतम 4 चीज़ें पैक करें।');
      return;
    }
    setPackedLunch((prev) => [...prev, item]);
  };

  const handleRemoveFromLunchbox = (id: string) => {
    setPackedLunch((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAnalyzeCustomFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFoodQuery.trim()) return;

    setIsAnalyzing(true);
    setCustomAnalysis(null);

    try {
      const res = await fetch('/api/evaluate-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodName: customFoodQuery }),
      });

      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setCustomAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const healthyCount = packedLunch.filter((f) => f.isHealthy).length;
  const isAllHealthy = packedLunch.length > 0 && healthyCount === packedLunch.length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-stone-900">
                पौष्टिक भोजन अन्वेषक (Healthy Food Explorer)
              </h3>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                कक्षा 4 पोषण पाठ
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              जानिए टिल्लू की 'चपाती' और मिल्लू की 'इडली-चटनी' क्यों हैं सबसे पौष्टिक लंच!
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500">लंचबॉक्स स्थिति:</span>
            <span
              className={`font-semibold px-2.5 py-1 rounded-lg ${
                isAllHealthy
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isAllHealthy ? '🌟 100% सुपर हेल्दी' : '⚠️ थोड़ा संतुलित करें'}
            </span>
          </div>
        </div>
      </div>

      {/* The Packed Tiffin Box Display */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍱</span>
            <h4 className="text-sm font-bold text-amber-200 tracking-wide">
              मेरा स्कूल लंचबॉक्स (My School Tiffin Box)
            </h4>
            <span className="text-stone-500 text-xs">·</span>
            <span className="text-xs text-stone-400">
              {packedLunch.length}/4 चीज़ें पैक की गई हैं
            </span>
          </div>

          {packedLunch.length > 0 && (
            <button
              onClick={() => setPackedLunch([])}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>खाली करें</span>
            </button>
          )}
        </div>

        {/* Packed Items Slots */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {packedLunch.map((item) => (
            <div
              key={item.id}
              className={`relative p-3 rounded-xl border transition-all ${
                item.isHealthy
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
              }`}
            >
              <button
                onClick={() => handleRemoveFromLunchbox(item.id)}
                className="absolute top-2 right-2 text-stone-400 hover:text-rose-400 text-xs p-1"
                title="लंचबॉक्स से हटाएं"
              >
                ✕
              </button>

              <div className="text-2xl mb-1">
                {item.id === 'chapati'
                  ? '🫓'
                  : item.id === 'idli_chutney'
                  ? '🥟'
                  : item.id === 'fresh_fruits'
                  ? '🍎'
                  : item.id === 'sprouts_salad'
                  ? '🥗'
                  : item.id === 'milk_curd'
                  ? '🥛'
                  : '🍟'}
              </div>
              <h5 className="font-bold text-xs leading-snug">{item.nameHindi}</h5>
              <p className="text-[10px] text-stone-400 mt-0.5">{item.nameEnglish}</p>
              <div className="mt-2 text-[10px] flex items-center gap-1 font-semibold">
                {item.isHealthy ? (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> पौष्टिक (Healthy)
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-0.5">
                    <AlertTriangle className="w-3 h-3" /> जंक (Avoid Daily)
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Empty slot placeholders */}
          {Array.from({ length: Math.max(0, 4 - packedLunch.length) }).map((_, i) => (
            <div
              key={i}
              className="border-2 border-dashed border-stone-800 rounded-xl p-4 flex flex-col items-center justify-center text-center text-stone-600 min-h-[110px]"
            >
              <Plus className="w-5 h-5 text-stone-700 mb-1" />
              <span className="text-[11px]">खाली स्लॉट</span>
              <span className="text-[9px] text-stone-700">नीचे से भोजन चुनें</span>
            </div>
          ))}
        </div>
      </div>

      {/* Food Database & Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Food Selector List */}
        <div className="lg:col-span-1 space-y-2">
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider font-mono">
            भोजन सूची (Food Items)
          </h4>
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {HEALTHY_FOOD_DATABASE.map((item) => {
              const isSelected = selectedFood.id === item.id;
              const isPacked = packedLunch.some((f) => f.id === item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedFood(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 shadow-sm'
                      : 'bg-white border-stone-200/80 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">
                      {item.id === 'chapati'
                        ? '🫓'
                        : item.id === 'idli_chutney'
                        ? '🥟'
                        : item.id === 'fresh_fruits'
                        ? '🍎'
                        : item.id === 'sprouts_salad'
                        ? '🥗'
                        : item.id === 'milk_curd'
                        ? '🥛'
                        : '🍟'}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-stone-900">
                        {item.nameHindi}
                      </h5>
                      <span className="text-[10px] text-stone-500">
                        {item.nutritionTag}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={isPacked}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToLunchbox(item);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      isPacked
                        ? 'bg-stone-100 text-stone-400'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    {isPacked ? 'पैक है' : '+ पैक करें'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Food Spotlight & Tillu/Millu Voices */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-medium text-amber-600">
                  {selectedFood.nutritionTag}
                </span>
                <h4 className="text-lg font-bold text-stone-900 mt-0.5">
                  {selectedFood.nameHindi}
                </h4>
                <p className="text-xs text-stone-500">{selectedFood.nameEnglish}</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono text-stone-500">
                  {selectedFood.caloriesApprox}
                </span>
                <div className="mt-1">
                  {selectedFood.isHealthy ? (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> पौष्टिक (Healthy)
                    </span>
                  ) : (
                    <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> जंक फूड (Avoid)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
              {selectedFood.descriptionHindi}
            </p>

            {/* Tillu & Millu's Audio Reactions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Tillu's Reaction */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800">
                    कीर्तना (टिल्लू) का विचार
                  </span>
                  <button
                    onClick={() => handleSpeakComment(selectedFood.tilluComment, 'Tillu')}
                    className="p-1.5 rounded-lg bg-white hover:bg-amber-100 text-rose-700 shadow-xs border border-amber-200"
                    title="टिल्लू की आवाज़ सुनें"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-stone-800 leading-relaxed italic">
                  "{selectedFood.tilluComment}"
                </p>
              </div>

              {/* Millu's Reaction */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800">
                    तेजस्वी (मिल्लू) का विचार
                  </span>
                  <button
                    onClick={() => handleSpeakComment(selectedFood.milluComment, 'Millu')}
                    className="p-1.5 rounded-lg bg-white hover:bg-emerald-100 text-emerald-700 shadow-xs border border-emerald-200"
                    title="मिल्लू की आवाज़ सुनें"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-stone-800 leading-relaxed italic">
                  "{selectedFood.milluComment}"
                </p>
              </div>
            </div>
          </div>

          {/* Ask Gemini About Any Custom Food */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wide">
                किसी भी भोजन के बारे में टिल्लू-मिल्लू से पूछें (Ask Gemini AI)
              </h5>
            </div>

            <form onSubmit={handleAnalyzeCustomFood} className="flex gap-2">
              <input
                type="text"
                value={customFoodQuery}
                onChange={(e) => setCustomFoodQuery(e.target.value)}
                placeholder="जैसे: दाल-चावल, पालक पनीर, पोहा, मैगी..."
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-800"
              />
              <button
                type="submit"
                disabled={isAnalyzing || !customFoodQuery.trim()}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                {isAnalyzing ? (
                  <span>जांच रहे हैं...</span>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>जांचें (Analyze)</span>
                  </>
                )}
              </button>
            </form>

            {customAnalysis && (
              <div className="mt-3 p-3.5 bg-white rounded-xl border border-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">
                    {customAnalysis.foodName}
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                      customAnalysis.isHealthy
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {customAnalysis.category}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                  <div className="bg-amber-50 p-2 rounded-lg">
                    <span className="font-semibold text-rose-800">टिल्लू: </span>
                    <span>"{customAnalysis.tilluComment}"</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <span className="font-semibold text-emerald-800">मिल्लू: </span>
                    <span>"{customAnalysis.milluComment}"</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
