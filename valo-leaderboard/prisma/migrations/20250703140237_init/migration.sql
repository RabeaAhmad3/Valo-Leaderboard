-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "puuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "map" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "redWon" BOOLEAN NOT NULL,
    "blueWon" BOOLEAN NOT NULL,
    "rounds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchPlayer" (
    "id" SERIAL NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" INTEGER NOT NULL,
    "team" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "damage" INTEGER NOT NULL,
    "headshots" INTEGER NOT NULL,
    "bodyshots" INTEGER NOT NULL,
    "legshots" INTEGER NOT NULL,
    "avgCombatScore" INTEGER NOT NULL,
    "econRating" INTEGER NOT NULL DEFAULT 0,
    "spentCredits" INTEGER NOT NULL DEFAULT 0,
    "loadoutValue" INTEGER NOT NULL DEFAULT 0,
    "firstBloods" INTEGER NOT NULL DEFAULT 0,
    "firstDeaths" INTEGER NOT NULL DEFAULT 0,
    "plants" INTEGER NOT NULL DEFAULT 0,
    "defuses" INTEGER NOT NULL DEFAULT 0,
    "clutches" INTEGER NOT NULL DEFAULT 0,
    "clutchesLost" INTEGER NOT NULL DEFAULT 0,
    "won" BOOLEAN NOT NULL,
    "bottomFrag" BOOLEAN NOT NULL DEFAULT false,
    "topFrag" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_puuid_key" ON "Player"("puuid");

-- CreateIndex
CREATE INDEX "Player_puuid_idx" ON "Player"("puuid");

-- CreateIndex
CREATE INDEX "Match_startedAt_idx" ON "Match"("startedAt");

-- CreateIndex
CREATE INDEX "MatchPlayer_playerId_idx" ON "MatchPlayer"("playerId");

-- CreateIndex
CREATE INDEX "MatchPlayer_matchId_idx" ON "MatchPlayer"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchPlayer_matchId_playerId_key" ON "MatchPlayer"("matchId", "playerId");

-- AddForeignKey
ALTER TABLE "MatchPlayer" ADD CONSTRAINT "MatchPlayer_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayer" ADD CONSTRAINT "MatchPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
