export function extractMatchId(url: string): string | null {
  // Match patterns:
  // https://tracker.gg/valorant/match/320b7150-9769-492a-a8ad-e31d95818838
  // tracker.gg/valorant/match/320b7150-9769-492a-a8ad-e31d95818838
  
  const patterns = [
    /tracker\.gg\/valorant\/match\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i,
    /\/match\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i,
    /^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function isValidMatchId(matchId: string): boolean {
  const uuidPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  return uuidPattern.test(matchId);
}