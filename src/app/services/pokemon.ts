import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { IPokemon } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class SPokemon {
    private readonly URL_BASE = 'https://pokeapi.co/api/v2/pokemon';

    private nextUrl = `${this.URL_BASE}?limit=20&offset=0`;

    getPokemons() {
        if (this.nextUrl) {
            return CapacitorHttp.get({ url: this.nextUrl, params: {} })
                .then(async (response: HttpResponse) => {
                    console.log("La respuesta es: ");
                    console.log(response);
                    const pokemons: IPokemon[] = [];

                   
                    if (response.data) {
                        const result: [] = response.data.results; 
                        this.nextUrl = response.data.next; 
                        const promises: Promise<HttpResponse>[] = []; 
                        result.forEach((result: any) => { 
                            const urlPokemon = result.url; 
                            promises.push(CapacitorHttp.get({ url: urlPokemon, params: {} }));
                        });

                        await Promise.all(promises).then((responses: any) => {
                            const arrayResponses: [] = responses;
                            arrayResponses.forEach((respoPokemon: any) => {
                                const pokemon = this.processPokemon(respoPokemon.data);
                                pokemons.push(pokemon);
                            });
                        });
                    }
                    return pokemons;
                });
        }
        return null;
    }

    getPokemon(id: number) {
        //se debe formar una ruta como:
        // https://pokeapi.co/api/v2/pokemon/:id
        const ruta = `${this.URL_BASE}/${id}`;
        return CapacitorHttp.get({ url: ruta, params: {} })
            .then((resp: HttpResponse) => this.processPokemon(resp.data));
    }

    private processPokemon( pokemonData: any){
        const pokemon: IPokemon = {
            id: pokemonData.id.toString(),
            name: pokemonData.name,
            type1: pokemonData.types[0].type.name,
            sprite: pokemonData.sprites.front_default,
            height: (pokemonData.height / 10).toString(),
            weight: (pokemonData.weight / 10).toString(),
            stats: pokemonData.stats.map((stat: any)=>{
                return {
                    base_stat: stat.base_stat,
                    stat: {
                        name: stat.stat.name
                    }
                }
            }),
            abilities: pokemonData.abilities
                .filter( (ability: any) => !ability.is_hidden )
                .map((ability: any) => ability.ability.name),
        };

        if(pokemonData.types[1]){//validación si existe un tipo 2
            pokemon.type2 = pokemonData.types[1].type.name;
        }

        //busqueda de habilidad oculta
        const hiddenAbility = pokemonData.abilities
            .find((ability: any)=>ability.is_hidden);

        if(hiddenAbility){
            pokemon.hiddenAbility = hiddenAbility.ability.name;
        }

        return pokemon;
    }
}
