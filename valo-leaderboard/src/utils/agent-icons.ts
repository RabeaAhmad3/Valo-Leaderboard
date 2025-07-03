// Agent name to image path mapping for Valorant agents
export const AGENT_ICONS: Record<string, string> = {
  // Duelists
  'Jett': '/agent-icons/8670-agentjett.png',
  'Reyna': '/agent-icons/4164-agentreyna.png',
  'Raze': '/agent-icons/7279-agentraze.png',
  'Phoenix': '/agent-icons/7165-agentphoenix.png',
  'Yoru': '/agent-icons/1980-agentyoru.png',
  'Neon': '/agent-icons/6378-agentneon.png',
  
  // Initiators
  'Sova': '/agent-icons/9432-agentsova.png',
  'Breach': '/agent-icons/8079-agentbreach.png',
  'Skye': '/agent-icons/5344-valorant-skye-icon.png',
  'KAY/O': '/agent-icons/1280-agentkayo.png',
  'Fade': '/agent-icons/2460-agentfade.png',
  'Gekko': '/agent-icons/9735-agentgekko.png',
  
  // Controllers
  'Omen': '/agent-icons/3525-agentomen.png',
  'Viper': '/agent-icons/4027-agentviper.png',
  'Brimstone': '/agent-icons/4168-agentbrimstone.png',
  'Astra': '/agent-icons/4999-agentastra.png',
  'Harbor': '/agent-icons/2460-agentharbor.png',
  
  // Sentinels
  'Sage': '/agent-icons/6480-agentsage.png',
  'Cypher': '/agent-icons/8607-agentcypher.png',
  'Killjoy': '/agent-icons/1980-agentkilljoy.png',
  'Chamber': '/agent-icons/5149-agentchamber.png',
  'Deadlock': '/agent-icons/3696-valorant-deadlock-icon.png',
};

export function getAgentIcon(agentName: string): string {
  return AGENT_ICONS[agentName] || '/agent-icons/8670-agentjett.png'; // Default to Jett
}