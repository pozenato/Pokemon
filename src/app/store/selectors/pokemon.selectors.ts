import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GameState } from '../../models/pokemon.model';

export const selectGameState = createFeatureSelector<GameState>('pokemon');

export const selectCurrentPokemon = createSelector(
  selectGameState,
  (state) => state.currentPokemon
);

export const selectCurrentRound = createSelector(
  selectGameState,
  (state) => state.currentRound
);

export const selectTotalRounds = createSelector(
  selectGameState,
  (state) => state.totalRounds
);

export const selectScore = createSelector(
  selectGameState,
  (state) => state.score
);

export const selectCorrectAnswers = createSelector(
  selectGameState,
  (state) => state.correctAnswers
);

export const selectUsedHints = createSelector(
  selectGameState,
  (state) => state.usedHints
);

export const selectGameCompleted = createSelector(
  selectGameState,
  (state) => state.gameCompleted
);

export const selectLoading = createSelector(
  selectGameState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectGameState,
  (state) => state.error
);

export const selectGameStarted = createSelector(
  selectGameState,
  (state) => state.gameStarted
);

export const selectCurrentQuestionValue = createSelector(
  selectGameState,
  (state) => state.currentQuestionValue
);

export const selectPlayerName = createSelector(
  selectGameState,
  (state) => state.playerName
);

export const selectCurrentHint = createSelector(
  selectGameState,
  (state) => state.currentHint
);

export const selectGameProgress = createSelector(
  selectCurrentRound,
  selectTotalRounds,
  (currentRound, totalRounds) => ({
    current: currentRound,
    total: totalRounds,
    percentage: (currentRound / totalRounds) * 100
  })
); 