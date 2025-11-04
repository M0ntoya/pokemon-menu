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

    //variable para almacenar todos los pokemons en pantalla
    pokemons: IPokemon[] = [];

    ionViewWillEnter(){
        this.getMorePokemons();
    }

    async getMorePokemons(event?: any){
        //constante para almacenar la promesa
        const promisePokemons = this.pokemonService.getPokemons();

        if (promisePokemons) { //validando que no sea null
            //se crea el controlador para el ion-loading
            const loading = await this.loadingCtrller.create({
                message: 'Cargando...'
            });

            loading.present(); //hace que se muestre el loading

            //se manda llamar la promesa
            promisePokemons.then((pokemons: IPokemon[]) => {
                //El nuevo arreglo de pokemons obtenidos, se
                //concatena con el de la clase interna
                //es decir, los que estaban, mas los nuevos
                this.pokemons = this.pokemons.concat(pokemons);
            })
            .catch((error) => console.log(error)) //Si ocurre un error
            .finally(() => {
                //Bloque que se ejecuta al completar o al tener error
                //asegura que el loading cierre
                loading.dismiss(); //cierra el loading
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
