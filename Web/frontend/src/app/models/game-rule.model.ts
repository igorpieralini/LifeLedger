export interface GameRule {
  id: string;
  name: string;
  icon: string;
  category: 'fps' | 'moba' | 'battle_royale' | 'rpg' | 'sports' | 'racing' | 'sandbox' | 'strategy';
  blocked: boolean;
  timeLimitMin: number | null; // daily limit in minutes, null = unlimited
}

export interface GameSchedule {
  allowedFrom: string; // "HH:mm"
  allowedUntil: string; // "HH:mm"
}

export const GAME_LIST: GameRule[] = [
  { id: 'valorant',    name: 'Valorant',          icon: 'target',            category: 'fps',           blocked: false, timeLimitMin: null },
  { id: 'csgo',        name: 'CS2',               icon: 'crosshairs',        category: 'fps',           blocked: false, timeLimitMin: null },
  { id: 'lol',         name: 'League of Legends',  icon: 'shield',            category: 'moba',          blocked: false, timeLimitMin: null },
  { id: 'fortnite',    name: 'Fortnite',          icon: 'fort',              category: 'battle_royale', blocked: false, timeLimitMin: null },
  { id: 'apex',        name: 'Apex Legends',      icon: 'bolt',              category: 'battle_royale', blocked: false, timeLimitMin: null },
  { id: 'gta',         name: 'GTA V / Online',    icon: 'directions_car',    category: 'sandbox',       blocked: false, timeLimitMin: null },
  { id: 'minecraft',   name: 'Minecraft',         icon: 'landscape',         category: 'sandbox',       blocked: false, timeLimitMin: null },
  { id: 'roblox',      name: 'Roblox',            icon: 'extension',         category: 'sandbox',       blocked: false, timeLimitMin: null },
  { id: 'fifa',        name: 'EA FC (FIFA)',       icon: 'sports_soccer',     category: 'sports',        blocked: false, timeLimitMin: null },
  { id: 'cod',         name: 'Call of Duty',       icon: 'military_tech',     category: 'fps',           blocked: false, timeLimitMin: null },
  { id: 'overwatch',   name: 'Overwatch 2',       icon: 'groups',            category: 'fps',           blocked: false, timeLimitMin: null },
  { id: 'dota',        name: 'Dota 2',            icon: 'swords',            category: 'moba',          blocked: false, timeLimitMin: null },
  { id: 'elden',       name: 'Elden Ring',        icon: 'auto_awesome',      category: 'rpg',           blocked: false, timeLimitMin: null },
  { id: 'rocketleague',name: 'Rocket League',     icon: 'sports_motorsports',category: 'racing',        blocked: false, timeLimitMin: null },
  { id: 'rainbow6',    name: 'Rainbow Six Siege', icon: 'security',          category: 'fps',           blocked: false, timeLimitMin: null },
  { id: 'pubg',        name: 'PUBG',              icon: 'adjust',            category: 'battle_royale', blocked: false, timeLimitMin: null },
  { id: 'diablo',      name: 'Diablo IV',         icon: 'whatshot',          category: 'rpg',           blocked: false, timeLimitMin: null },
  { id: 'deadbydl',    name: 'Dead by Daylight',  icon: 'nightlight',        category: 'strategy',      blocked: false, timeLimitMin: null },
  { id: 'warzone',     name: 'Warzone',           icon: 'radar',             category: 'battle_royale', blocked: false, timeLimitMin: null },
  { id: 'rust',        name: 'Rust',              icon: 'construction',      category: 'sandbox',       blocked: false, timeLimitMin: null },
];

export const GAME_CATEGORIES: Record<string, string> = {
  fps: 'FPS',
  moba: 'MOBA',
  battle_royale: 'Battle Royale',
  rpg: 'RPG',
  sports: 'Esportes',
  racing: 'Corrida',
  sandbox: 'Sandbox',
  strategy: 'Estratégia',
};
