import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../pokemon';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css']
})
export class PokemonsComponent implements OnInit {

   pokemons: Pokemon[];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.getPokemons();
  }

  getPokemons(): void {
    this.pokemonService.getPokemons()
        .subscribe(pokemons => this.pokemons = pokemons.results);
  }
  


add(name: string): void {
  name = name.trim();
  if (!name) { return; }
  this.pokemonService.addPokemon({ name } as Pokemon)
    .subscribe(pokemon => {
      this.pokemons.push(pokemon);
    });
}


}




