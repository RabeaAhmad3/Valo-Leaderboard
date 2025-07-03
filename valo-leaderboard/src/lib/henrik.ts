import { HENRIK_API_BASE_URL, HENRIK_API_KEY } from './constants';
import { HenrikMatchResponse } from '@/types/henrik';

export class HenrikAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'HenrikAPIError';
  }
}

async function tryFetchMatchFromRegion(matchId: string, region: string): Promise<HenrikMatchResponse> {
  const url = `${HENRIK_API_BASE_URL}/valorant/v4/match/${region}/${matchId}`;
  
  console.log('Trying region:', region, 'URL:', url);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': HENRIK_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new HenrikAPIError(
      `Henrik API error for region ${region}: ${response.status} ${response.statusText}`,
      response.status,
      errorData
    );
  }

  const data = await response.json();
  
  if (data.status !== 200) {
    throw new HenrikAPIError(
      `Henrik API returned non-200 status for region ${region}: ${data.status}`,
      data.status,
      data
    );
  }

  return data as HenrikMatchResponse;
}

export async function fetchMatchFromHenrik(matchId: string): Promise<HenrikMatchResponse> {
  const region = 'virginia'; // Virginia region for all matches
  
  console.log('Fetching match from Henrik:', { matchId, region, hasApiKey: !!HENRIK_API_KEY });
  
  try {
    const result = await tryFetchMatchFromRegion(matchId, region);
    console.log(`Successfully found match in region: ${region}`);
    return result;
  } catch (error) {
    console.log(`Failed to fetch from region ${region}:`, error instanceof Error ? error.message : error);
    if (error instanceof HenrikAPIError) {
      throw error;
    } else {
      throw new HenrikAPIError(
        `Failed to fetch match data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}