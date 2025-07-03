export interface HenrikMatchResponse {
  status: number;
  data: HenrikMatchData;
}

export interface HenrikMatchData {
  metadata: MatchMetadata;
  players: MatchPlayer[];
  observers?: Observer[];
  coaches?: Coach[];
  teams: Team[];
  rounds?: Round[];
  kills?: Kill[];
}

export interface MatchMetadata {
  match_id: string;
  map: {
    id: string;
    name: string;
  };
  game_version: string;
  game_length_in_ms: number;
  started_at: string;
  is_completed: boolean;
  queue: {
    id: string;
    name: string;
    mode_type: string;
  };
  season: {
    id: string;
    short: string;
  };
  platform: string;
  premier?: Record<string, unknown>;
  party_rr_penaltys?: Array<{
    party_id: string;
    penalty: number;
  }>;
  region: string;
  cluster: string;
}

export interface MatchPlayer {
  puuid: string;
  name: string;
  tag: string;
  team_id: string;
  platform: string;
  party_id: string;
  agent: {
    id: string;
    name: string;
  };
  stats: PlayerStats;
  ability_casts: {
    grenade: number;
    ability_1: number;
    ability_2: number;
    ultimate: number;
  };
  tier?: {
    id: number;
    name: string;
  };
  card_id: string;
  title_id: string;
  prefered_level_border?: string;
  account_level: number;
  session_playtime_in_ms: number;
  behavior?: {
    afk_rounds: number;
    friendly_fire: {
      incoming: number;
      outgoing: number;
    };
    rounds_in_spawn: number;
  };
  economy?: {
    spent: {
      overall: number;
      average: number;
    };
    loadout_value: {
      overall: number;
      average: number;
    };
  };
}

export interface PlayerStats {
  score: number;
  kills: number;
  deaths: number;
  assists: number;
  headshots: number;
  legshots: number;
  bodyshots: number;
  damage: {
    dealt: number;
    received: number;
  };
}

export interface Observer {
  puuid: string;
  name: string;
  tag: string;
  account_level: number;
  session_playtime_in_ms: number;
  card_id: string;
  title_id: string;
  party_id: string;
}

export interface Coach {
  puuid: string;
  team_id: string;
}

export interface Team {
  team_id: string;
  rounds: {
    won: number;
    lost: number;
  };
  won: boolean;
  premier_roster?: {
    id: string;
    name: string;
    tag: string;
    members: string[];
    customization: {
      icon: string;
      image: string;
      primary_color: string;
      secondary_color: string;
      tertiary_color: string;
    };
  };
}

export interface Round {
  id: number;
  result: string;
  ceremony: string;
  winning_team: string;
  plant?: PlantDefuseEvent;
  defuse?: PlantDefuseEvent;
  stats?: RoundPlayerStats[];
}

export interface PlantDefuseEvent {
  round_time_in_ms: number;
  site?: string;
  location: {
    x: number;
    y: number;
  };
  player: {
    puuid: string;
    name: string;
    tag: string;
    team: string;
  };
  player_locations: PlayerLocation[];
}

export interface PlayerLocation {
  puuid: string;
  name: string;
  tag: string;
  team: string;
  view_radians: number;
  location: {
    x: number;
    y: number;
  };
}

export interface RoundPlayerStats {
  ability_casts: {
    grenade: number;
    ability_1: number;
    ability_2: number;
    ultimate: number;
  };
  player: {
    puuid: string;
    name: string;
    tag: string;
    team: string;
  };
  damage_events?: DamageEvent[];
  stats: {
    bodyshots: number;
    headshots: number;
    legshots: number;
    damage: number;
    kills: number;
    assists: number;
    score: number;
  };
  economy: {
    loadout_value: number;
    remaining: number;
    weapon: {
      id: string;
      name: string;
      type: string;
    };
    armor?: {
      id: string;
      name: string;
    };
  };
  was_afk: boolean;
  received_penalty: boolean;
  stayed_in_spawn: boolean;
}

export interface DamageEvent {
  puuid: string;
  name: string;
  tag: string;
  team: string;
  bodyshots: number;
  headshots: number;
  legshots: number;
  damage: number;
}

export interface Kill {
  round: number;
  time_in_round_in_ms: number;
  time_in_match_in_ms: number;
  killer: PlayerIdentity;
  victim: PlayerIdentity;
  assistants?: PlayerIdentity[];
  location: {
    x: number;
    y: number;
  };
  weapon: {
    id: string;
    name: string;
    type: string;
  };
  secondary_fire_mode: boolean;
  player_locations: PlayerLocation[];
}

export interface PlayerIdentity {
  puuid: string;
  name: string;
  tag: string;
  team: string;
}