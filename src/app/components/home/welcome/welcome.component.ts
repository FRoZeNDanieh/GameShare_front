import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GamesService } from 'src/app/services/games/games.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  images1: Observable<string[]>;
  images2: Observable<string[]>;

  constructor(private gamesService: GamesService) { }

  ngOnInit(): void {
    const allImages = this.gamesService.getRandomGames();
    this.images1 = allImages.pipe(
      map(images => this.getRandomSubset(images, 10))
    );
    this.images2 = allImages.pipe(
      map(images => this.getRandomSubset(images, 10))
    );
  }

  getRandomSubset(arr: string[], count: number): string[] {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
