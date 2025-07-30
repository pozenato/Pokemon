import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { pokemonReducer } from './reducers/pokemon.reducer';
import { PokemonEffects } from './effects/pokemon.effects';

@NgModule({
  imports: [
    StoreModule.forRoot({ pokemon: pokemonReducer }),
    EffectsModule.forRoot([PokemonEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: false
    })
  ]
})
export class AppStoreModule {} 