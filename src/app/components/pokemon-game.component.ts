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
  usedHintsList = signal<string[]>([]);
  maxHints = 3;

  // Mapeamento de nomes em português (Pokemon oficiais traduzidos)
  private portugueseNames: { [key: string]: string[] } = {
    // Alguns Pokemon clássicos que são conhecidos em português
    'pikachu': ['pikachu'],
    'charizard': ['charizard'],
    'blastoise': ['blastoise'],
    'venusaur': ['venusaur'],
    'mewtwo': ['mewtwo'],
    'mew': ['mew'],
    'articuno': ['articuno'],
    'zapdos': ['zapdos'],
    'moltres': ['moltres'],
    // Adicionar mais conforme necessário
  };

  // Computed signals
  gameProgress = computed(() => ({
    current: this.currentRound(),
    total: this.totalRounds(),
    percentage: (this.currentRound() / this.totalRounds()) * 100
  }));

  canUseHint = computed(() => this.usedHintsList().length < this.maxHints);
  hintsRemaining = computed(() => this.maxHints - this.usedHintsList().length);

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
    // Subscribe to store selectors
    this.store.select(PokemonSelectors.selectCurrentPokemon).subscribe(pokemon => {
      this.currentPokemon.set(pokemon);
      // Clear hints list when a new Pokemon appears
      if (pokemon) {
        this.usedHintsList.set([]);
      }
    });
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
    if (this.guessForm.invalid || this.loading()) return;
    
    const guess = this.guessForm.get('guess')?.value?.toLowerCase().trim();
    const pokemon = this.currentPokemon();
    
    if (!guess || !pokemon) return;
    
    // Verificar se o palpite está correto (inglês ou português)
    const isCorrect = this.isGuessCorrect(guess, pokemon.name);
    
    this.store.dispatch(PokemonActions.submitAnswer({ answer: guess }));
    
    if (isCorrect) {
      this.snackBar.open(' Correto! Parabéns!', 'Próximo', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    } else {
      this.snackBar.open(' Incorreto! Tente novamente.', 'OK', {
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

  useHint() {
    if (this.loading()) return;
    
    // Check if hint limit reached
    if (!this.canUseHint()) {
      this.snackBar.open(`🚫 Limite de ${this.maxHints} dicas atingido!`, 'OK', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      return;
    }
    
    const pokemon = this.currentPokemon();
    if (!pokemon) return;

    this.store.dispatch(PokemonActions.useHint());
    
    // Get hint from Pokemon data
    const hints = this.getPokemonHints(pokemon);
    const currentHintCount = this.usedHintsList().length;
    
    if (currentHintCount < hints.length) {
      const newHint = hints[currentHintCount];
      this.currentHint.set(newHint);
      
      // Add to used hints list
      const updatedHints = [...this.usedHintsList(), newHint];
      this.usedHintsList.set(updatedHints);
      
      // Show snackbar with hint number
      this.snackBar.open(`💡 Dica ${updatedHints.length}: ${newHint}`, 'Fechar', {
        duration: 5000,
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

  onImageError(event: any) {
    // Implementar fallback se necessário
    const img = event.target;
    const pokemon = this.currentPokemon();
    
    if (pokemon && img.src !== pokemon.sprites.front_default) {
      // Fallback para imagem padrão se a de alta qualidade falhar
      img.src = pokemon.sprites.front_default;
    }
  }

  // Função para obter a melhor qualidade de imagem disponível
  getBestPokemonImage(pokemon: Pokemon | null): string {
    if (!pokemon) return '';
    
    // Prioridade de qualidade (da melhor para pior):
    // 1. Official Artwork (alta resolução, ~475x475px)
    // 2. Home (boa resolução, ~256x256px)  
    // 3. Dream World (boa qualidade vetorial)
    // 4. Front Default (baixa resolução, 96x96px - fallback)
    
    const sprites = pokemon.sprites;
    
    return sprites.other?.['official-artwork']?.front_default ||
           sprites.other?.home?.front_default ||
           sprites.other?.dream_world?.front_default ||
           sprites.front_default ||
           '';
  }

  getPokemonHints(pokemon: Pokemon): string[] {
    const hints: string[] = [];
    
    // Dica 1: Tipo(s) - muito útil para identificação
    const types = pokemon.types.map(t => this.translateType(t.type.name)).join(' e ');
    hints.push(`É um Pokémon do tipo ${types}`);
    
    // Dica 2: Primeira letra - ajuda muito na identificação
    const firstLetter = pokemon.name.charAt(0).toUpperCase();
    hints.push(`Seu nome começa com a letra "${firstLetter}"`);
    
    // Dica 3: Informação física interessante
    const weight = pokemon.weight / 10; // API retorna em hectogramas
    const height = pokemon.height / 10; // API retorna em decímetros
    
    if (weight >= 100) {
      hints.push(`É um Pokémon bem pesado, com ${weight} kg`);
    } else if (weight <= 5) {
      hints.push(`É um Pokémon bem leve, com apenas ${weight} kg`);
    } else if (height >= 3) {
      hints.push(`É um Pokémon alto, medindo ${height} metros`);
    } else if (height <= 0.5) {
      hints.push(`É um Pokémon pequeno, com apenas ${height} metros de altura`);
    } else {
      // Dica sobre habilidades se não for extremo em peso/altura
      const abilities = pokemon.abilities.map(a => this.translateAbility(a.ability.name));
      hints.push(`Suas habilidades incluem: ${abilities.join(' ou ')}`);
    }
    
    return hints;
  }

  private translateType(type: string): string {
    const typeTranslations: { [key: string]: string } = {
      'normal': 'Normal',
      'fire': 'Fogo',
      'water': 'Água',
      'electric': 'Elétrico',
      'grass': 'Planta',
      'ice': 'Gelo',
      'fighting': 'Lutador',
      'poison': 'Venenoso',
      'ground': 'Terra',
      'flying': 'Voador',
      'psychic': 'Psíquico',
      'bug': 'Inseto',
      'rock': 'Pedra',
      'ghost': 'Fantasma',
      'dragon': 'Dragão',
      'dark': 'Sombrio',
      'steel': 'Aço',
      'fairy': 'Fada'
    };
    
    return typeTranslations[type] || type;
  }

  private translateAbility(ability: string): string {
    const abilityTranslations: { [key: string]: string } = {
      'overgrow': 'Supercrescimento',
      'chlorophyll': 'Clorofila',
      'blaze': 'Chama',
      'solar-power': 'Força Solar',
      'torrent': 'Torrente',
      'rain-dish': 'Prato de Chuva',
      'shield-dust': 'Pó do Escudo',
      'run-away': 'Fuga',
      'keen-eye': 'Olho Aguçado',
      'tangled-feet': 'Pés Emaranhados',
      'big-pecks': 'Peito Grande',
      'guts': 'Coragem',
      'hustle': 'Pressa',
      'intimidate': 'Intimidação',
      'static': 'Estática',
      'lightning-rod': 'Para-raios',
      'sand-veil': 'Véu de Areia',
      'poison-point': 'Ponto Venenoso',
      'rivalry': 'Rivalidade',
      'sheer-force': 'Força Bruta',
      'cute-charm': 'Charme',
      'magic-guard': 'Guarda Mágica',
      'friend-guard': 'Guarda Amigo',
      'healer': 'Curandeiro',
      'regenerator': 'Regenerador',
      'thick-fat': 'Gordura Espessa',
      'inner-focus': 'Foco Interior',
      'early-bird': 'Madrugador',
      'flame-body': 'Corpo de Chama',
      'magma-armor': 'Armadura de Magma',
      'water-absorb': 'Absorção de Água',
      'damp': 'Umidade',
      'limber': 'Flexível',
      'cloud-nine': 'Céu Limpo',
      'swift-swim': 'Nado Rápido',
      'water-veil': 'Véu de Água',
      'oblivious': 'Alheio',
      'simple': 'Simples',
      'unaware': 'Inconsciente',
      'moody': 'Temperamental'
    };
    
    return abilityTranslations[ability] || ability.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  getPlaceholderText(): string {
    const pokemon = this.currentPokemon();
    if (!pokemon) {
      return 'Ex: pikachu';
    }
    
    const letterCount = pokemon.name.length;
    const letterWord = letterCount === 1 ? 'letra' : 'letras';
    return `Digite o nome (${letterCount} ${letterWord})`;
  }



  private isGuessCorrect(guess: string, pokemonName: string): boolean {
    const normalizedPokemonName = pokemonName.toLowerCase();
    const normalizedGuess = guess.toLowerCase();
    
    // Verificar nome em inglês
    if (normalizedGuess === normalizedPokemonName) {
      return true;
    }
    
    // Verificar nomes em português se disponíveis
    const portugueseVariants = this.portugueseNames[normalizedPokemonName];
    if (portugueseVariants) {
      return portugueseVariants.some(variant => 
        variant.toLowerCase() === normalizedGuess
      );
    }
    
    return false;
  }
}