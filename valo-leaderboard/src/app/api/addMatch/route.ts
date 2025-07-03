import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchMatchFromHenrik, HenrikAPIError } from '@/lib/henrik';
import { processMatchData } from '@/utils/match-processor';
import { updateAllPlayerStats } from '@/utils/stats-calculator';
import { extractMatchId, isValidMatchId } from '@/utils/match';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: URL is required' },
        { status: 400 }
      );
    }

    // Extract match ID from URL
    const matchId = extractMatchId(url);
    if (!matchId || !isValidMatchId(matchId)) {
      return NextResponse.json(
        { error: 'Invalid Tracker.gg URL or match ID format' },
        { status: 400 }
      );
    }

    // Check if match already exists
    const existingMatch = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (existingMatch) {
      return NextResponse.json(
        { error: 'Match already exists in database', matchId },
        { status: 409 }
      );
    }

    // Fetch match data from Henrik API
    let matchData;
    try {
      const response = await fetchMatchFromHenrik(matchId);
      console.log('Successfully fetched match data for:', matchId);
      matchData = response.data;
    } catch (error) {
      if (error instanceof HenrikAPIError) {
        return NextResponse.json(
          { error: `Failed to fetch match data: ${error.message}` },
          { status: error.statusCode || 500 }
        );
      }
      throw error;
    }

    // Process and store match data
    const { match, players } = await processMatchData(matchData);

    // Use a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Create match
      await tx.match.create({
        data: match,
      });

      // Create or update players and match players
      for (const { playerData, matchPlayerData } of players) {
        // Upsert player (create if doesn't exist)
        const player = await tx.player.upsert({
          where: { puuid: playerData.puuid },
          create: playerData,
          update: {
            name: playerData.name,
            tag: playerData.tag,
          },
        });

        // Create match player record
        await tx.matchPlayer.create({
          data: {
            ...matchPlayerData,
            matchId: match.id,
            playerId: player.id,
          },
        });
      }
    });

    // Update all player stats (badges, etc.) - this happens synchronously
    await updateAllPlayerStats();

    return NextResponse.json({
      success: true,
      matchId,
      message: 'Match data successfully ingested',
      redirect: '/leaderboard',
    });
  } catch (error) {
    console.error('Error in /api/addMatch:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}