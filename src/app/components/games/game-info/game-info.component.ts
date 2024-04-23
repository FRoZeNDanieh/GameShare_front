import { Game } from './../../../models/Game';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'firebase/auth';
import { EstadoJuego } from 'src/app/models/constants/EstadoJuego';

@Component({
  selector: 'app-game-info',
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss']
})
export class GameInfoComponent implements OnInit {

  currentUser: User;
  game: Game;
  jugando: { [gameId: string]: EstadoJuego }

  reviewText: string;
  reviews: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<GameInfoComponent>,
    private datePipe: DatePipe,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.game = data.game;
    this.jugando = data.jugando;
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.currentUser = user;
      if (this.data.game != null) {
        this.game = Object.assign({}, this.data.game);
        // Convierte el timestamp a un objeto de fecha de TypeScript.
        let fechaSalida = this.game.fecha.toDate();
        // Formatea la fecha al formato español
        this.game.fechaFormatted = this.datePipe.transform(fechaSalida, 'dd/MM/yyyy');

        // Comprueba si el juego está en la colección 'jugando' del usuario actual.
        if (this.jugando && this.jugando[this.game.uid]) {
          this.afs.collection('usuarios').doc(this.currentUser.uid).collection('jugando').doc(this.game.uid).valueChanges().subscribe(juego => {
            if (juego['rating']) {
              this.game.rating = juego['rating'];
            }
          });
        }

        this.afs.collection('reviews', ref => ref.where('juegoId', '==', this.game.uid)).valueChanges().subscribe(reviews => {
          this.reviews = reviews;
        })
      }
    });
  }

  setRating(star: number) {
    this.game.rating = star;
    // Guarda la calificación en Firestore.
    this.afs.collection('usuarios').doc(this.currentUser.uid).collection('jugando').doc(this.game.uid).update({ rating: star })
      .then(() => {
        console.log("Rating successfully updated!");
      })
      .catch((error) => {
        console.log("Error updating rating: ", error);
      });
  }

  submitReview() {
    if (this.reviewText) {
      const reviewData = {
        usuarioId: this.currentUser.uid,
        juegoId: this.game.uid,
        review: this.reviewText,
        username: this.currentUser.displayName,
        rating: this.game.rating,
        fecha: new Date().toISOString()
      };

      this.afs.collection('reviews').add(reviewData).then(() => {
        console.log('Reseña publicada con éxito');
        this.reviewText = '';
      })
        .catch(error => {
          console.error('Error al publicar la reseña: ', error);
        })
    }
  }
}
