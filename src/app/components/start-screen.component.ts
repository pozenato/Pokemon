import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import * as PokemonActions from '../store/actions/pokemon.actions';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);

  playerForm: FormGroup;

  constructor() {
    this.playerForm = this.fb.group({
      playerName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]]
    });
  }

  startGame() {
    console.log('Botão clicado!');
    console.log('Form válido:', this.playerForm.valid);
    console.log('Valor do nome:', this.playerForm.get('playerName')?.value);
    
    if (this.playerForm.valid) {
      const playerName = this.playerForm.get('playerName')?.value;
      console.log('Dispatching startGameWithPlayer com nome:', playerName);
      this.store.dispatch(PokemonActions.startGameWithPlayer({ playerName }));
    } else {
      console.log('Form inválido, mostrando erro');
      this.snackBar.open('Por favor, digite seu nome (2-20 caracteres)', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  viewRanking() {
    // Implementar visualização do ranking
    this.snackBar.open('Ranking em desenvolvimento!', 'Fechar', {
      duration: 2000,
      panelClass: ['info-snackbar']
    });
  }
} 