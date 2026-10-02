export interface DialogueLine {
  id: string;
  stage: 'intro' | 'dialogue' | 'conclusion';
  speaker: 'Keerthana (Tillu)' | 'Tejaswi (Millu)' | 'Both' | 'Teacher (Background)';
  characterRole: 'Tillu' | 'Millu' | 'Both' | 'Teacher';
  actorName: string;
  hindi: string;
  hinglish: string;
  english: string;
  pose: 'facing_front' | 'facing_partner' | 'showing_tiffin' | 'namaste' | 'encouraging';
  activeFood?: 'chapati' | 'idli_chutney';
  voiceName: 'Puck' | 'Kore' | 'Zephyr' | 'Fenrir';
  audioStyle: string;
  teacherNote?: string;
  learningFact?: string;
}

export type LanguageMode = 'all' | 'hindi' | 'hinglish' | 'english';
export type AppTab = 'stage' | 'script' | 'roleplay' | 'lunchbox' | 'creator';

export interface FoodItem {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  category: 'staple' | 'south_indian' | 'fruits' | 'vegetables' | 'protein' | 'junk';
  isHealthy: boolean;
  caloriesApprox: string;
  nutritionTag: string;
  descriptionHindi: string;
  descriptionEnglish: string;
  tilluComment: string;
  milluComment: string;
  iconType: string;
}
