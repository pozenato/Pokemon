import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { PokemonGameComponent } from './components/pokemon-game.component';
import { StartScreenComponent } from './components/start-screen.component';
import { Store } from '@ngrx/store';
import * as PokemonSelectors from './store/selectors/pokemon.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PokemonGameComponent, StartScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Pokemon Game';
  
  private store = inject(Store);
  gameStarted = signal(false);

  constructor() {
    // Subscribe to game state
    this.store.select(PokemonSelectors.selectGameStarted).subscribe(started => {
      console.log('AppComponent - gameStarted mudou para:', started);
      this.gameStarted.set(started);
    });

    // Debug: verificar estado inicial
    this.store.select(PokemonSelectors.selectGameState).subscribe(state => {
      console.log('AppComponent - Estado completo:', state);
    });
  }
}
