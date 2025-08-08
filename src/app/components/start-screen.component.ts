import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import * as PokemonActions from '../store/actions/pokemon.actions';
import { PrimaryInputComponent } from './primary-input.component';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    PrimaryInputComponent
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
    if (this.playerForm.valid) {
      const playerName = this.playerForm.get('playerName')?.value;
      this.store.dispatch(PokemonActions.startGameWithPlayer({ playerName }));
    } else {
      this.playerForm.markAllAsTouched();
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