import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'firebase/auth';
import { Game } from 'src/app/models/Game';
import { EstadoJuego } from 'src/app/models/constants/EstadoJuego';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  games: Observable<Game[]>
  currentUser: User

  jugandoGames: Observable<Game[]>
  terminadoGames: Observable<Game[]>
  abandonadoGames: Observable<Game[]>

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
        this.games = this.afs.collection("usuarios").doc(this.currentUser.uid).collection<Game>("jugando", ref => ref.orderBy("titulo")).snapshotChanges()
          .pipe(
            switchMap(jugandoDocs => {
              // Obtén los documentos de la colección 'juegos' para cada juego en 'jugando'.
              const gameObservables = jugandoDocs.map(jugandoDoc => {
                const gameId = jugandoDoc.payload.doc.data().uid;
                return this.afs.doc<Game>(`juegos/${gameId}`).valueChanges()
                  .pipe(
                    map(gameData => ({ ...gameData, estado: jugandoDoc.payload.doc.data().estado })) // Combina los datos del juego con el estado de 'jugando'
                  );
              });
              return combineLatest(gameObservables);
            })
          );

        // Filtra los juegos basados en su estado.
        this.jugandoGames = this.games.pipe(map(games => games.filter(game => game.estado === EstadoJuego.Jugando)));
        this.terminadoGames = this.games.pipe(map(games => games.filter(game => game.estado === EstadoJuego.Terminado)));
        this.abandonadoGames = this.games.pipe(map(games => games.filter(game => game.estado === EstadoJuego.Abandonado)));
      }
    });

  }

  editGame(game: Game): void {
    console.log(game.titulo)
  }

}
