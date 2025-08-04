import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import * as PokemonActions from '../actions/pokemon.actions';
import * as PokemonSelectors from '../selectors/pokemon.selectors';

@Injectable()
export class PokemonEffects {
  loadRandomPokemon$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.loadRandomPokemon),
      mergeMap(() =>
        this.pokemonService.getRandomPokemon().pipe(
          map(pokemon => PokemonActions.loadRandomPokemonSuccess({ pokemon })),
          catchError(error => of(PokemonActions.loadRandomPokemonFailure({ error: error.message })))
        )
      )
    )
  );

  startNewGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.startNewGame),
      switchMap(() => of(PokemonActions.loadRandomPokemon()))
    )
  );

  startGameWithPlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.startGameWithPlayer),
      switchMap(() => of(PokemonActions.loadRandomPokemon()))
    )
  );

  nextRound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokemonActions.nextRound),
      withLatestFrom(
        this.store.select(PokemonSelectors.selectGameCompleted),
        this.store.select(PokemonSelectors.selectCorrectAnswers),
        this.store.select(PokemonSelectors.selectScore),
        this.store.select(PokemonSelectors.selectTotalRounds)
      ),
      mergeMap(([action, gameCompleted, correctAnswers, score, totalRounds]) => {
        if (gameCompleted) {
          return of(PokemonActions.completeGame({ 
            result: { 
              totalCorrect: correctAnswers, 
              totalScore: score, 
              totalRounds: totalRounds,
              playerName: '',
              date: new Date()
            } 
          }));
        } else {
          return of(PokemonActions.loadRandomPokemon());
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private pokemonService: PokemonService,
    private store: Store
  ) {}
} 