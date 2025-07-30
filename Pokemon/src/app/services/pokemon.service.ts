import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getRandomPokemon(): Observable<Pokemon> {
    // Gera um ID aleatório entre 1 e 151 (primeira geração)
    const randomId = Math.floor(Math.random() * 151) + 1;
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${randomId}`);
  }

  getPokemonById(id: number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`);
  }

  getPokemonList(limit: number = 151): Observable<{ name: string; url: string }[]> {
    return this.http.get<{ results: { name: string; url: string }[] }>(`${this.baseUrl}/pokemon?limit=${limit}`)
      .pipe(
        map(response => response.results)
      );
  }
} 