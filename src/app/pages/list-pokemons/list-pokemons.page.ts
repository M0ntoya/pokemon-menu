import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, LoadingController, IonGrid, IonCard, IonCardContent, IonRow, IonCol, IonImg, IonText, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { SPokemon } from '../../services/pokemon';
import { IPokemon } from '../../interfaces/pokemon';

@Component({
  selector: 'app-list-pokemons',
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonGrid,
    IonCard,
    IonCardContent,
    IonRow,
    IonCol,
    IonImg,
    IonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ]
})
export class ListPokemonsPage {

    private pokemonService: SPokemon = inject(SPokemon);
    private loadingCtrller: LoadingController = inject(LoadingController);
    private router: Router = inject(Router);


    pokemons: IPokemon[] = [];

    ionViewWillEnter(){
        this.getMorePokemons();
    }

    async getMorePokemons(event?: any){

        const promisePokemons = this.pokemonService.getPokemons();

        if (promisePokemons) { 

            const loading = await this.loadingCtrller.create({
                message: 'Cargando...'
            });

            loading.present(); 


            promisePokemons.then((pokemons: IPokemon[]) => {



                this.pokemons = this.pokemons.concat(pokemons);
            })
            .catch((error) => console.log(error)) 
            .finally(() => {


                loading.dismiss(); 
                if (event) {
                    event.target.complete();
                }
            });
        } else {
            if (event) {
                event.target.complete();
            }
        }
    }

    goToDetail(id: string) {
        this.router.navigate(['/detail-pokemon', id]);
    }
}
