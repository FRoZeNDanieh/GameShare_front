import { Observable, Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Game } from 'src/app/models/Game';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  subscription: Subscription = new Subscription();

  games: Observable<Game[]>

  constructor(private afs: AngularFirestore, private messageService: MessageService) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (!message.reset) {
        this.filterGames(message.genre, message.startDate, message.endDate);
      } else {
        this.getAllGames()
      }
    });
  }

  ngOnInit(): void {
    this.getAllGames();
  }

  getAllGames(): void {
    this.games = this.afs.collection<Game>('juegos', ref => ref.orderBy("titulo")).valueChanges();
  }

  editGame(game: Game): void {
    console.log(game.titulo)
  }

  filterGames(genre: string, startDate: Date, endDate: Date): void {
    if (genre != "" && startDate != null) {
      this.games = this.afs.collection<Game>('juegos', ref => ref.where('genero', '==', genre).where('fecha', '>=', startDate).where('fecha', '<=', endDate)).valueChanges();
    } else if (genre == "") {
      this.games = this.afs.collection<Game>('juegos', ref => ref.where('fecha', '>=', startDate).where('fecha', '<=', endDate)).valueChanges();
    } else if (startDate == null) {
      this.games = this.afs.collection<Game>('juegos', ref => ref.where('genero', '==', genre)).valueChanges();
    }
  }

}
