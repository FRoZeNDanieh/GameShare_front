import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, Subject, map } from 'rxjs';
import { Game } from '../../models/Game';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private gamesCollection: AngularFirestoreCollection<Game>
  private filteredGames = new Subject<Game[]>();

  constructor(private afs: AngularFirestore) {
    this.gamesCollection = afs.collection('juegos')
  }

  getAllGenres(): string[] {
    let genres: string[] = [];

    this.gamesCollection.ref.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (!genres.includes(doc.get('genero').toString())) {
          genres.push(doc.get('genero').toString());
        }
      });
      genres.sort()
    });

    return genres;
  }

  getAllDevelopers(): string[] {
    let developers: string[] = [];

    this.gamesCollection.ref.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (!developers.includes(doc.get('desarrollador').toString())) {
          developers.push(doc.get('desarrollador').toString())
        }
      });
      developers.sort();
    });

    return developers;
  }
}
