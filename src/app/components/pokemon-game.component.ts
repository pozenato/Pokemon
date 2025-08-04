import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';
import * as PokemonActions from '../store/actions/pokemon.actions';
import * as PokemonSelectors from '../store/selectors/pokemon.selectors';

@Component({
  selector: 'app-pokemon-game',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './pokemon-game.component.html',
  styleUrls: ['./pokemon-game.component.scss']
})
export class PokemonGameComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);

  // Signals
  currentPokemon = signal<Pokemon | null>(null);
  currentRound = signal(0);
  totalRounds = signal(10);
  score = signal(0);
  correctAnswers = signal(0);
  usedHints = signal(0);
  gameCompleted = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  gameStarted = signal(false);
  currentQuestionValue = signal(20);
  playerName = signal('');
  currentHint = signal<string | null>(null);

  // Computed signals
  gameProgress = computed(() => ({
    current: this.currentRound(),
    total: this.totalRounds(),
    percentage: (this.currentRound() / this.totalRounds()) * 100
  }));

  // Form
  guessForm: FormGroup;

  // Observables
  currentPokemon$: Observable<Pokemon | null>;
  currentRound$: Observable<number>;
  score$: Observable<number>;
  correctAnswers$: Observable<number>;
  usedHints$: Observable<number>;
  gameCompleted$: Observable<boolean>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  gameStarted$: Observable<boolean>;
  currentQuestionValue$: Observable<number>;
  playerName$: Observable<string>;
  currentHint$: Observable<string | null>;

  constructor() {
    this.guessForm = this.fb.group({
      guess: ['', [Validators.required, Validators.minLength(1)]]
    });

    // Initialize observables
    this.currentPokemon$ = this.store.select(PokemonSelectors.selectCurrentPokemon);
    this.currentRound$ = this.store.select(PokemonSelectors.selectCurrentRound);
    this.score$ = this.store.select(PokemonSelectors.selectScore);
    this.correctAnswers$ = this.store.select(PokemonSelectors.selectCorrectAnswers);
    this.usedHints$ = this.store.select(PokemonSelectors.selectUsedHints);
    this.gameCompleted$ = this.store.select(PokemonSelectors.selectGameCompleted);
    this.loading$ = this.store.select(PokemonSelectors.selectLoading);
    this.error$ = this.store.select(PokemonSelectors.selectError);
    this.gameStarted$ = this.store.select(PokemonSelectors.selectGameStarted);
    this.currentQuestionValue$ = this.store.select(PokemonSelectors.selectCurrentQuestionValue);
    this.playerName$ = this.store.select(PokemonSelectors.selectPlayerName);
    this.currentHint$ = this.store.select(PokemonSelectors.selectCurrentHint);
  }

  ngOnInit() {
    // Subscribe to observables and update signals
    this.currentPokemon$.subscribe(pokemon => this.currentPokemon.set(pokemon));
    this.currentRound$.subscribe(round => this.currentRound.set(round));
    this.score$.subscribe(score => this.score.set(score));
    this.correctAnswers$.subscribe(correct => this.correctAnswers.set(correct));
    this.usedHints$.subscribe(hints => this.usedHints.set(hints));
    this.gameCompleted$.subscribe(completed => this.gameCompleted.set(completed));
    this.loading$.subscribe(loading => this.loading.set(loading));
    this.error$.subscribe(error => this.error.set(error));
    this.gameStarted$.subscribe(started => this.gameStarted.set(started));
    this.currentQuestionValue$.subscribe(value => this.currentQuestionValue.set(value));
    this.playerName$.subscribe(name => this.playerName.set(name));
    this.currentHint$.subscribe(hint => this.currentHint.set(hint));
  }

  submitGuess() {
    if (this.guessForm.valid) {
      const guess = this.guessForm.get('guess')?.value;
      this.store.dispatch(PokemonActions.submitAnswer({ answer: guess }));
      
      const isCorrect = this.currentPokemon()?.name.toLowerCase() === guess.toLowerCase();
      
      if (isCorrect) {
        this.snackBar.open(`Parabéns, ${this.playerName()}! Você acertou!`, 'Fechar', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      } else {
        this.snackBar.open(`Ops! O Pokemon era ${this.currentPokemon()?.name}`, 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }

      this.guessForm.reset();
      
      // Wait a bit before going to next round
      setTimeout(() => {
        this.store.dispatch(PokemonActions.nextRound());
      }, 2000);
    }
  }

  useHint() {
    this.store.dispatch(PokemonActions.useHint());
    
    // Show hint in snackbar
    const hint = this.currentHint();
    if (hint) {
      this.snackBar.open(`💡 Dica: ${hint}`, 'Fechar', {
        duration: 4000,
        panelClass: ['hint-snackbar']
      });
    }
  }

  resetGame() {
    this.store.dispatch(PokemonActions.resetGame());
  }

  goToStartScreen() {
    this.store.dispatch(PokemonActions.goToStartScreen());
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
} 