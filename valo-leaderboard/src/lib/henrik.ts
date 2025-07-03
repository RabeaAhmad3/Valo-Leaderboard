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

export async function fetchMatchFromHenrik(matchId: string): Promise<HenrikMatchResponse> {
  const url = `${HENRIK_API_BASE_URL}/valorant/v2/match/${matchId}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': HENRIK_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new HenrikAPIError(
        `Henrik API error: ${response.status} ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    
    if (data.status !== 200) {
      throw new HenrikAPIError(
        `Henrik API returned non-200 status: ${data.status}`,
        data.status,
        data
      );
    }

    return data as HenrikMatchResponse;
  } catch (error) {
    if (error instanceof HenrikAPIError) {
      throw error;
    }
    
    throw new HenrikAPIError(
      `Failed to fetch match data: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}