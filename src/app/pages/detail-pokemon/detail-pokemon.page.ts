import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonRow, IonCol, IonImg, IonHeader, IonToolbar, IonTitle, IonList } from '@ionic/angular/standalone';
import { SPokemon } from 'src/app/services/pokemon';
import { IPokemon } from 'src/app/interfaces/pokemon';
import { closeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
  standalone: true,
  imports: [IonList, IonContent, CommonModule, FormsModule, IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonRow, IonCol, IonImg, IonHeader, IonToolbar, IonTitle]
})
export class DetailPokemonPage {


  @Input() id!: string;

  private servicioPokemon: SPokemon = inject(SPokemon);
  private router: Router = inject(Router);
  pokemon!: IPokemon;

  constructor() {
    addIcons({
      closeOutline
    });
  }

  ionViewWillEnter() {
    console.log(`El id es: ${this.id}`);
    this.servicioPokemon.getPokemon(parseInt(this.id))
      .then((pokemon: IPokemon) => this.pokemon = pokemon);
  }

  goBack() {
    this.router.navigate(['/list-pokemons']);
  }
}
