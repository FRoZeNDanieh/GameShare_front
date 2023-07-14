import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Game } from '../shared/models/Game';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  games: Observable<Game[]>

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit(): void {
    this.games = this.afs.collection<Game>('juegos', ref => ref.orderBy("titulo")).valueChanges();
  }

  editGame(game: Game): void {
    console.log(game.titulo)
  }

}
