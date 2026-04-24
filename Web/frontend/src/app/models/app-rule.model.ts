export interface AppRule {
  id: string;
  name: string;
  icon: string;       // Material Symbols icon name
  category: 'social' | 'video' | 'games' | 'messaging' | 'productivity' | 'browser';
  blocked: boolean;
  timeLimitMin: number | null;   // daily limit in minutes, null = unlimited
  allowedFrom: string | null;    // "HH:mm" or null
  allowedUntil: string | null;   // "HH:mm" or null
}

export const APP_LIST: AppRule[] = [
  { id: 'instagram',   name: 'Instagram',    icon: 'photo_camera',    category: 'social',       blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'tiktok',      name: 'TikTok',       icon: 'music_note',      category: 'video',        blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'youtube',     name: 'YouTube',      icon: 'play_circle',     category: 'video',        blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'twitter',     name: 'X (Twitter)',   icon: 'tag',             category: 'social',       blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'facebook',    name: 'Facebook',     icon: 'group',           category: 'social',       blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'whatsapp',    name: 'WhatsApp',     icon: 'chat',            category: 'messaging',    blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'telegram',    name: 'Telegram',     icon: 'send',            category: 'messaging',    blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'discord',     name: 'Discord',      icon: 'headset_mic',     category: 'messaging',    blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'reddit',      name: 'Reddit',       icon: 'forum',           category: 'social',       blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'snapchat',    name: 'Snapchat',     icon: 'camera',          category: 'social',       blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'netflix',     name: 'Netflix',      icon: 'movie',           category: 'video',        blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'twitch',      name: 'Twitch',       icon: 'live_tv',         category: 'video',        blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'spotify',     name: 'Spotify',      icon: 'music_note',      category: 'video',        blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'pinterest',   name: 'Pinterest',    icon: 'push_pin',        category: 'social',       blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'linkedin',    name: 'LinkedIn',     icon: 'work',            category: 'productivity', blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'chrome',      name: 'Chrome',       icon: 'language',        category: 'browser',      blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'safari',      name: 'Safari',       icon: 'explore',         category: 'browser',      blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'threads',     name: 'Threads',      icon: 'alternate_email', category: 'social',       blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'bereal',      name: 'BeReal',       icon: 'photo_library',   category: 'social',       blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
  { id: 'kwai',        name: 'Kwai',         icon: 'videocam',        category: 'video',        blocked: false, timeLimitMin: null, allowedFrom: null, allowedUntil: null },
];

export const APP_CATEGORIES: Record<string, string> = {
  social: 'Redes Sociais',
  video: 'Vídeo & Streaming',
  games: 'Jogos',
  messaging: 'Mensagens',
  productivity: 'Produtividade',
  browser: 'Navegadores',
};
