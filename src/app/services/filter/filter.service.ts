import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Game } from '../../models/Game';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private gamesCollection: AngularFirestoreCollection<Game>

  constructor(private afs: AngularFirestore) {
    this.gamesCollection = afs.collection('juegos')
  }

  getAllGenres(): Promise<string[]> {
    let genres: string[] = [];

    return this.gamesCollection.ref.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.exists) {
          let genre = doc.get('genero');
          if (genre && !genres.includes(genre.toString())) {
            genres.push(genre.toString());
          }
        }
      });
      genres.sort();
      return genres;
    });
  }

  getAllDevelopers(): Promise<string[]> {
    let developers: string[] = [];

    return this.gamesCollection.ref.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.exists) {
          let developer = doc.get('desarrollador');
          if (developer && !developers.includes(developer.toString())) {
            developers.push(developer.toString());
          }
        }
      });
      developers.sort();
      return developers;
    });
  }

  getAllEditors(): Promise<string[]> {
    let editors: string[] = [];

    return this.gamesCollection.ref.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.exists) {
          let editor = doc.get('editor');
          if (editor && !editors.includes(editor.toString())) {
            editors.push(editor.toString());
          }
        }
      });
      editors.sort();
      return editors;
    });
  }

  getAllPegi(): Promise<number[]> {
    let editors: number[] = [];

    return this.gamesCollection.ref.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.exists) {
          let editor = doc.get('PEGI');
          if (editor && !editors.includes(editor.toString())) {
            editors.push(editor.toString());
          }
        }
      });
      editors.sort((a, b) => a - b);
      return editors;
    });
  }
}
