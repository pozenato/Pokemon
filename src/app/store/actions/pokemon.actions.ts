import { createAction, props } from '@ngrx/store';
import { Pokemon, GameResult, PlayerRanking } from '../../models/pokemon.model';

// Load Pokemon Actions
export const loadRandomPokemon = createAction('[Pokemon Game] Load Random Pokemon');
export const loadRandomPokemonSuccess = createAction(
  '[Pokemon Game] Load Random Pokemon Success',
  props<{ pokemon: Pokemon }>()
);
export const loadRandomPokemonFailure = createAction(
  '[Pokemon Game] Load Random Pokemon Failure',
  props<{ error: string }>()
);

// Game Actions
export const startNewGame = createAction('[Pokemon Game] Start New Game');
export const startGameWithPlayer = createAction(
  '[Pokemon Game] Start Game With Player',
  props<{ playerName: string }>()
);
export const submitAnswer = createAction(
  '[Pokemon Game] Submit Answer',
  props<{ answer: string }>()
);
export const useHint = createAction('[Pokemon Game] Use Hint');
export const nextRound = createAction('[Pokemon Game] Next Round');
export const completeGame = createAction(
  '[Pokemon Game] Complete Game',
  props<{ result: GameResult }>()
);

// Ranking Actions
export const addToRanking = createAction(
  '[Pokemon Game] Add To Ranking',
  props<{ ranking: PlayerRanking }>()
);
export const loadRanking = createAction('[Pokemon Game] Load Ranking');
export const loadRankingSuccess = createAction(
  '[Pokemon Game] Load Ranking Success',
  props<{ rankings: PlayerRanking[] }>()
);

// Reset Actions
export const resetGame = createAction('[Pokemon Game] Reset Game');
export const goToStartScreen = createAction('[Pokemon Game] Go To Start Screen'); 