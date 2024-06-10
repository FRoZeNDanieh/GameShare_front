import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Game } from 'src/app/models/Game';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private afs: AngularFirestore) { }

  getJugandoList(uid: string): Observable<any[]> {
    return this.afs.collection('usuarios').doc(uid).collection('jugando').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getRandomGames(): Observable<string[]> {
    return this.afs.collection<Game>('juegos').valueChanges().pipe(
      map(juegos => juegos.map(juego => juego.imagen))
    );
  }
}
