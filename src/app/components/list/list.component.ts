import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'firebase/auth';
import { Game } from 'src/app/models/Game';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  games: Observable<Game[]>
  currentUser: User

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => {
      this.currentUser = user;
      this.games = this.afs.collection("usuarios").doc(this.currentUser.uid).collection<Game>("jugando", ref => ref.orderBy("titulo")).valueChanges();
    })
  }

  ngOnInit(): void {
    //this.games = this.afs.collection<Game>('juegos', ref => ref.orderBy("titulo")).valueChanges();
    //console.log(this.afs.collection("usuarios").doc(this.currentUser.uid).collection("jugando").get())
  }

  editGame(game: Game): void {
    console.log(game.titulo)
  }

}
