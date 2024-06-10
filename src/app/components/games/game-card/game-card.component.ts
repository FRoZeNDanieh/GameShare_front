import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameInfoComponent } from '../game-info/game-info.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Game } from 'src/app/models/Game';
import { EstadoJuego } from 'src/app/models/constants/EstadoJuego';
import { GamesService } from 'src/app/services/games/games.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit {

  @Input() game: Game
  currentUser: User
  Object = Object;
  EstadoJuego = EstadoJuego;

  jugando: { [gameId: string]: EstadoJuego } = {};

  constructor(public dialog: MatDialog, public afAuth: AngularFireAuth, public afs: AngularFirestore, private gamesService: GamesService) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.gamesService.getJugandoList(this.currentUser.uid).subscribe(jugandoList => {
          this.jugando = jugandoList.reduce((acc, game) => {
            acc[game.uid] = game.estado;
            return acc;
          }, {});
        });
      }
    });
  }

  addToList(game: Game): void {
    this.afs.collection("usuarios").doc(this.currentUser.uid).collection("jugando").doc(this.game.uid).set({
      uid: game.uid,
      titulo: game.titulo,
      estado: EstadoJuego.Jugando,
      ultActualizacion: firebase.firestore.FieldValue.serverTimestamp()
    })
      .then(() => {
        console.log("Document successfully written!");
        this.jugando[game.uid] = EstadoJuego.Jugando;
      })
      .catch((error) => {
        console.error("Error writing document: ", error)
      }), { merge: true }
  }

  changeEstado(game: Game, estado: EstadoJuego): void {
    this.afs.collection("usuarios").doc(this.currentUser.uid).collection("jugando").doc(game.uid).update(
      {
        estado: estado,
        ultActualizacion: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        console.log("Document successfully updated!");
        // Actualiza el estado del juego en la lista de juegos que el usuario está jugando.

      })
  }

  getGameInfo(): void {
    this.dialog.open(GameInfoComponent, {
      height: '80%',
      width: '80%',
      data: {
        game: this.game,
        jugando: this.jugando
      }
    });
  }
}
