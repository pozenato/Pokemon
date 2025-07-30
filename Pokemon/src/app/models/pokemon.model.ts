export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
}

export interface GameState {
  currentPokemon: Pokemon | null;
  currentRound: number;
  totalRounds: number;
  score: number;
  correctAnswers: number;
  usedHints: number;
  gameCompleted: boolean;
  loading: boolean;
  error: string | null;
  gameStarted: boolean;
  currentQuestionValue: number;
  playerName: string;
  currentHint: string | null;
}

export interface GameResult {
  totalCorrect: number;
  totalScore: number;
  totalRounds: number;
  playerName: string;
  date: Date;
}

export interface PlayerRanking {
  playerName: string;
  score: number;
  correctAnswers: number;
  date: Date;
  totalRounds: number;
} 