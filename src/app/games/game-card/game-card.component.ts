import { Game } from '../../shared/models/Game'
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameInfoComponent } from '../game-info/game-info.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'firebase/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit {

  @Input() game: Game
  currentUser: User

  constructor(public dialog: MatDialog, public afAuth: AngularFireAuth, public afs: AngularFirestore) {
    afAuth.authState.subscribe(user => {
      this.currentUser = user;
    })
  }

  ngOnInit(): void {
  }

  addToList(game: Game): void {
    this.afs.collection("usuarios").doc(this.currentUser.uid).collection("jugando").doc(this.game.uid).set({
      titulo: game.titulo,
      desarrollador: game.desarrollador,
      descripcion: game.descripcion,
      editor: game.editor,
      fecha: game.fecha,
      genero: game.genero,
      imagen: game.imagen,
      imagenPortada: game.imagenPortada
    })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error)
      }), { merge: true }
  }

  getGameInfo(): void {
    this.dialog.open(GameInfoComponent, {
      height: '80%',
      width: '80%',
      data: { game: this.game }
    });
  }
}
