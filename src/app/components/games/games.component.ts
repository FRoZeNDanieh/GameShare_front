import { Observable, Subscription, from } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/compat/firestore';
import { Game } from 'src/app/models/Game';
import { FilterStateService } from 'src/app/services/filterState/filter-state.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  subscription: Subscription = new Subscription();

  games: Observable<Game[]>

  constructor(private afs: AngularFirestore, private filterStateService: FilterStateService) {
    this.subscription = this.filterStateService.filterState$.subscribe(message => {
      if (!message.reset) {
        this.filterGames(message.genre, message.developer, message.startDate, message.endDate, message.search);
      } else {
        this.getAllGames()
      }
    });
  }

  ngOnInit(): void {
    this.getAllGames();
  }

  getAllGames(): void {
    this.games = this.afs.collection<Game>('juegos', ref => ref.orderBy("titulo")).valueChanges();
  }

  editGame(game: Game): void {
    console.log(game.titulo)
  }

  filterGames(genre: string, developer: string, startDate: Date, endDate: Date, search: string): void {
    let ref = this.afs.collection<Game>('juegos').ref;
    let query: Query = ref.orderBy('titulo');

    if (genre != null) {
      query = query.where('genero', '==', genre);
    }

    if (developer != null)  {
      query = query.where('desarrollador', '==', developer);
    }

    if (startDate != null) {
      query = query.where('fecha', '>=', startDate).where('fecha', '<=', endDate);
    }

    if (search != null) {
      query = query.where('titulo', '>=', search).where('titulo', '<=', search + `\uf8ff`);
    }

    this.games = from(query.get().then(querySnapshot => {
      return querySnapshot.docs.map(doc => doc.data() as Game)
    }));

  }

}
