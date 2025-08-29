import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private imageCache = new Map<string, HTMLImageElement>();

  constructor() { }

  /**
   * Obtém a URL da melhor qualidade de imagem disponível para um Pokemon
   */
  getBestImageUrl(pokemon: Pokemon): string {
    if (!pokemon) return '';
    
    const sprites = pokemon.sprites;
    
    // Prioridade de qualidade (da melhor para pior):
    // 1. Official Artwork (alta resolução, ~475x475px)
    // 2. Home (boa resolução, ~256x256px)  
    // 3. Dream World (boa qualidade vetorial)
    // 4. Front Default (baixa resolução, 96x96px - fallback)
    
    return sprites.other?.['official-artwork']?.front_default ||
           sprites.other?.home?.front_default ||
           sprites.other?.dream_world?.front_default ||
           sprites.front_default ||
           '';
  }

  /**
   * Pré-carrega uma imagem para melhorar a performance
   */
  preloadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (this.imageCache.has(url)) {
        resolve(this.imageCache.get(url)!);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(img);
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      img.src = url;
    });
  }

  /**
   * Pré-carrega múltiplas imagens de Pokemon
   */
  async preloadPokemonImages(pokemons: Pokemon[]): Promise<void> {
    const promises = pokemons.map(pokemon => {
      const url = this.getBestImageUrl(pokemon);
      return url ? this.preloadImage(url).catch(() => null) : Promise.resolve(null);
    });

    await Promise.allSettled(promises);
  }

  /**
   * Limpa o cache de imagens
   */
  clearCache(): void {
    this.imageCache.clear();
  }

  /**
   * Otimiza uma imagem aplicando filtros CSS para melhor qualidade visual
   */
  getOptimizedImageStyles(): { [key: string]: string } {
    return {
      'image-rendering': 'high-quality',
      '-webkit-backface-visibility': 'hidden',
      'backface-visibility': 'hidden',
      '-webkit-transform': 'translateZ(0)',
      'transform': 'translateZ(0)',
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      '-ms-interpolation-mode': 'bicubic'
    };
  }
}
