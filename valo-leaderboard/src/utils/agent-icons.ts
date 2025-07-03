// Agent name to emoji mapping for Valorant agents
export const AGENT_ICONS: Record<string, string> = {
  // Duelists
  'Jett': '🌪️',
  'Reyna': '👑',
  'Raze': '💥',
  'Phoenix': '🔥',
  'Yoru': '👤',
  'Neon': '⚡',
  'Iso': '🟣',
  
  // Initiators
  'Sova': '🏹',
  'Breach': '🔨',
  'Skye': '🌿',
  'KAY/O': '🤖',
  'Fade': '🌙',
  'Gekko': '🦎',
  
  // Controllers
  'Omen': '👻',
  'Viper': '🐍',
  'Brimstone': '💨',
  'Astra': '⭐',
  'Harbor': '🌊',
  'Clove': '🍀',
  
  // Sentinels
  'Sage': '❄️',
  'Cypher': '👁️',
  'Killjoy': '🔧',
  'Chamber': '🎯',
  'Deadlock': '🔒',
  'Vyse': '🌸',
};

export function getAgentIcon(agentName: string): string {
  return AGENT_ICONS[agentName] || '❓';
}