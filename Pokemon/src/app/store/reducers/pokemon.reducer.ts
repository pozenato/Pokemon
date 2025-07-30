import { createReducer, on } from '@ngrx/store';
import { GameState } from '../../models/pokemon.model';
import * as PokemonActions from '../actions/pokemon.actions';

export const initialState: GameState = {
  currentPokemon: null,
  currentRound: 0,
  totalRounds: 10,
  score: 0,
  correctAnswers: 0,
  usedHints: 0,
  gameCompleted: false,
  loading: false,
  error: null,
  gameStarted: false,
  currentQuestionValue: 20,
  playerName: '',
  currentHint: null
};

export const pokemonReducer = createReducer(
  initialState,
  
  // Load Pokemon
  on(PokemonActions.loadRandomPokemon, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(PokemonActions.loadRandomPokemonSuccess, (state, { pokemon }) => ({
    ...state,
    currentPokemon: pokemon,
    loading: false,
    error: null,
    currentHint: null
  })),
  
  on(PokemonActions.loadRandomPokemonFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Game Actions
  on(PokemonActions.startNewGame, (state) => ({
    ...state,
    currentRound: 1,
    score: 0,
    correctAnswers: 0,
    usedHints: 0,
    gameCompleted: false,
    loading: false,
    error: null,
    gameStarted: true,
    currentQuestionValue: 20,
    currentHint: null
  })),

  on(PokemonActions.startGameWithPlayer, (state, { playerName }) => ({
    ...state,
    playerName,
    currentRound: 1,
    score: 0,
    correctAnswers: 0,
    usedHints: 0,
    gameCompleted: false,
    loading: false,
    error: null,
    gameStarted: true,
    currentQuestionValue: 20,
    currentHint: null
  })),
  
  on(PokemonActions.submitAnswer, (state, { answer }) => {
    const isCorrect = state.currentPokemon?.name.toLowerCase() === answer.toLowerCase();
    const newScore = isCorrect ? state.score + state.currentQuestionValue : state.score;
    const newCorrectAnswers = isCorrect ? state.correctAnswers + 1 : state.correctAnswers;
    
    return {
      ...state,
      score: newScore,
      correctAnswers: newCorrectAnswers
    };
  }),
  
  on(PokemonActions.useHint, (state) => {
    const newQuestionValue = Math.max(5, state.currentQuestionValue - 5);
    const hints = [
      `Tipo: ${state.currentPokemon?.types.map(t => t.type.name).join(', ')}`,
      `Altura: ${state.currentPokemon ? (state.currentPokemon.height / 10) + 'm' : ''}`,
      `Peso: ${state.currentPokemon ? (state.currentPokemon.weight / 10) + 'kg' : ''}`,
      `Habilidades: ${state.currentPokemon?.abilities.filter(a => !a.is_hidden).map(a => a.ability.name).join(', ')}`,
      `Primeira letra: ${state.currentPokemon?.name.charAt(0).toUpperCase()}`,
      `Última letra: ${state.currentPokemon?.name.charAt(state.currentPokemon.name.length - 1)}`,
      `Número de letras: ${state.currentPokemon?.name.length}`,
      `Contém a letra 'a': ${state.currentPokemon?.name.includes('a') ? 'Sim' : 'Não'}`
    ];
    
    const randomHint = hints[Math.floor(Math.random() * hints.length)];
    
    return {
      ...state,
      score: Math.max(0, state.score - 5),
      usedHints: state.usedHints + 1,
      currentQuestionValue: newQuestionValue,
      currentHint: randomHint
    };
  }),
  
  on(PokemonActions.nextRound, (state) => {
    const nextRound = state.currentRound + 1;
    const gameCompleted = nextRound > state.totalRounds;
    
    return {
      ...state,
      currentRound: nextRound,
      gameCompleted,
      currentQuestionValue: 20,
      currentHint: null
    };
  }),
  
  on(PokemonActions.completeGame, (state, { result }) => ({
    ...state,
    gameCompleted: true
  })),
  
  // Reset
  on(PokemonActions.resetGame, () => initialState),
  
  on(PokemonActions.goToStartScreen, (state) => ({
    ...state,
    gameStarted: false,
    currentRound: 0,
    score: 0,
    correctAnswers: 0,
    usedHints: 0,
    gameCompleted: false,
    loading: false,
    error: null,
    currentQuestionValue: 20,
    playerName: '',
    currentHint: null
  }))
); 