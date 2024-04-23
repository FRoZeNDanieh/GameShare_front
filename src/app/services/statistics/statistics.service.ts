import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  currentUserUid: string;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUserUid = user.uid;
      }
    });
  }

  getAllJugando(): Observable<number> {
    return this.firestore.collection('usuarios').doc(this.currentUserUid).collection('jugando').get().pipe(
      map(querySnapshot => querySnapshot.size)
    );
  }

  getJuegosJugando(): Observable<number> {
    return this.firestore.collection('usuarios').doc(this.currentUserUid).collection('jugando', ref => ref.where('estado', '==', 'Jugando')).get().pipe(
      map(querySnapshot => querySnapshot.size)
    );
  }

  getJuegosTerminados(): Observable<number> {
    return this.firestore.collection('usuarios').doc(this.currentUserUid).collection('jugando', ref => ref.where('estado', '==', 'Terminado')).get().pipe(
      map(querySnapshot => querySnapshot.size)
    )
  }

  getJuegosAbandonados(): Observable<number> {
    return this.firestore.collection('usuarios').doc(this.currentUserUid).collection('jugando', ref => ref.where('estado', '==', 'Abandonado')).get().pipe(
      map(querySnapshot => querySnapshot.size)
    )
  }

  getTotalReviews(): Observable<number> {
    return this.firestore.collection('reviews', ref => ref.where('usuarioId', '==', this.currentUserUid)).get().pipe(
      map(querySnapshot => querySnapshot.size)
    );
  }

  getNotaMedia(): Observable<number> {
    return this.firestore.collection('usuarios').doc(this.currentUserUid).collection('jugando').valueChanges().pipe(
      map(juegos => juegos.map(juego => juego['rating']).filter(rating => typeof rating === 'number')),
      map(notas => {
        const suma = notas.reduce((a, b) => a + b, 0);
        const recuento = notas.length;
        return recuento > 0 ? suma / recuento : 0;
      })
    );
  }
}
