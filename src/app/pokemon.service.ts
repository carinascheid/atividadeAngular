import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pokemon } from './pokemon';
import { Pokemons } from './mock-pokemons';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})
export class PokemonService {
 
  private pokemonsUrl = 'https://pokeapi.co/api/v2/pokemon'; 
 
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { 
    /** Log a pokemonService message with the MessageService */
  }

  getPokemons(): Observable<Pokemon[]> {
    return this.http.get<Pokemon[]>(this.pokemonsUrl)
              .pipe(
                tap(_ => this.log('fetched pokemons')),
                catchError(this.handleError<Pokemon[]>('getPokemons',[]))
              )
  } 
  /** GET pokemon by id. Return `undefined` when id not found */
  getpokemonNo404<Data>(id: number): Observable<Pokemon> {
    const url = `${this.pokemonsUrl}/?id=${id}`;
    return this.http.get<Pokemon[]>(url)
      .pipe(
        map(pokemons => pokemons[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} pokemon id=${id}`);
        }),
        catchError(this.handleError<Pokemon>(`getPokemon id=${id}`))
      );
  }
   
  getPokemon(id: number): Observable<Pokemon> {
    // TODO: send the message _after_ fetching the pokemon
    const url = `${this.pokemonsUrl}/${id}`;
    return this.http.get<Pokemon>(url).pipe(
      tap(_ => this.log(`fetched pokemon id=${id}`)),
      catchError(this.handleError<Pokemon>(`getPokemon id=${id}`))
    );
  }
  
  /* GET pokemones whose name contains search term */
  searchpokemons(term: string): Observable<Pokemon[]> {
    if (!term.trim()) {
      // if not search term, return empty pokemon array.
      return of([]);
    }
    return this.http.get<Pokemon[]>(`${this.pokemonsUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found pokemons matching "${term}"`)),
      catchError(this.handleError<Pokemon[]>('searchPokemons', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new pokemon to the server */
  addPokemon (pokemon: Pokemon): Observable<Pokemon> {
    return this.http.post<Pokemon>(this.pokemonsUrl, Pokemon, this.httpOptions).pipe(
      tap((newpokemon: Pokemon) => this.log(`added pokemon w/ id=${newpokemon.id}`)),
      catchError(this.handleError<Pokemon>('addPokemon'))
    );
  }

  /** DELETE: delete the pokemon from the server */
  deletepokemon (pokemon: Pokemon | number): Observable<Pokemon> {
    const id = typeof pokemon === 'number' ? pokemon : pokemon.id;
    const url = `${this.pokemonsUrl}/${id}`;

    return this.http.delete<Pokemon>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted pokemon id=${id}`)),
      catchError(this.handleError<Pokemon>('deletePokemon'))
    );
  }

  /** PUT: update the pokemon on the server */
  updatepokemon (pokemon: Pokemon): Observable<any> {
    return this.http.put(this.pokemonsUrl, pokemon, this.httpOptions).pipe(
      tap(_ => this.log(`updated pokemon id=${pokemon.id}`)),
      catchError(this.handleError<any>('updatePokemon'))
    );
  }
 
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      
      console.error(error); 
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
    private log(message: string) {
    this.messageService.add(`PokemonService: ${message}`);
  }
}




