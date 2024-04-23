import { Observable, Subscription, from, map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, Query } from '@angular/fire/compat/firestore';
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

  totalGames: number;

  lastDoc: any;
  prevStartAt: any[] = [];
  config: { pageSize: number, startAt: any, endBefore: any } = {
    pageSize: 10,
    startAt: null,
    endBefore: null,
  };

  pageSizes = [5, 10, 20];
  selectedPageSize = this.pageSizes[2];

  noMoreGames = false; // Agregamos una nueva variable para rastrear si hay más juegos.

  constructor(private afs: AngularFirestore, private filterStateService: FilterStateService) {
    this.subscription = this.filterStateService.filterState$.subscribe(message => {
      if (!message.reset) {
        this.filterGames(message.genre, message.developer, message.editor, message.pegi, message.startDate, message.endDate, message.search);
      } else {
        this.loadGames();
      }
    });
  }

  ngOnInit(): void {
    this.afs.collection('juegos').get().subscribe((res) => {
      this.totalGames = res.docs.length;
      this.loadGames();
    });
  }

  loadGames() {
    let collection: AngularFirestoreCollection<Game>;
    this.config.pageSize = this.selectedPageSize;

    if (this.config.startAt) {
      collection = this.afs.collection('juegos', ref => ref.orderBy('titulo').startAfter(this.config.startAt).limit(this.config.pageSize));
    } else {
      collection = this.afs.collection('juegos', ref => ref.orderBy('titulo').limit(this.config.pageSize));
    }

    this.games = collection.snapshotChanges().pipe(
      map(actions => {
        let games = actions.map(a => {
          const data = a.payload.doc.data() as Game;
          const id = a.payload.doc.id;
          this.lastDoc = a.payload.doc;

          return { id, ...data };
        });

        // Verificamos si hay más juegos después del último juego que hemos recuperado.
        this.afs.collection('juegos', ref => ref.orderBy('titulo').startAfter(this.lastDoc).limit(1)).get().subscribe((nextGames) => {
          if (nextGames.docs.length > 0) {
            this.noMoreGames = false;
          } else {
            this.noMoreGames = true;
          }
        });

        return games;
      })
    );
  }

  nextPage() {
    if (!this.noMoreGames) { // Solo avanzamos a la siguiente página si hay más juegos.
      this.prevStartAt.push(this.config.startAt);
      this.config.startAt = this.lastDoc;
      this.loadGames();
    }
  }

  prevPage() {
    if (this.prevStartAt.length > 0) {
      this.config.startAt = this.prevStartAt.pop();
      this.loadGames();
    }
  }

  editGame(game: Game): void {
    console.log(game.titulo)
  }

  filterGames(genre: string, developer: string, editor: string, pegi: number, startDate: Date, endDate: Date, search: string): void {
    let ref = this.afs.collection<Game>('juegos').ref;
    let query: Query;

    if (startDate != null && endDate != null) {
      query = ref.orderBy('fecha').where('fecha', '>=', startDate).where('fecha', '<=', endDate);
    } else {
      query = ref.orderBy('titulo');
    }

    if (genre != null) {
      query = query.where('genero', '==', genre);
    }

    if (developer != null) {
      query = query.where('desarrollador', '==', developer);
    }

    if (editor != null) {
      query = query.where('editor', '==', editor);
    }

    if (pegi != null) {
      let pegiNumber = Number(pegi);
      if (!isNaN(pegiNumber))
        query = query.where('PEGI', '==', pegiNumber);
    }

    if (search != null) {
      query = query.where('titulo', '>=', search).where('titulo', '<=', search + `\uf8ff`);
    }

    this.games = from(query.get().then(querySnapshot => {
      return querySnapshot.docs.map(doc => doc.data() as Game)
    }));

  }

}
