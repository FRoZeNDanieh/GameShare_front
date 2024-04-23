import { ChangePhotoDialogComponent } from './../modals/change-photo-dialog/change-photo-dialog.component';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { StatsTitles } from 'src/app/models/constants/StatsTitles';
import { StatisticsService } from 'src/app/services/statistics/statistics.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUser: User;
  userProfileImage: string;

  public statsObservables: { [key in StatsTitles]?: Observable<number> };

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private statisticsService: StatisticsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.db.collection('usuarios').doc(user.uid).valueChanges().subscribe((userData: any) => {
          this.userProfileImage = userData.photoURL;
        });

        this.statsObservables = {
          [StatsTitles.TotalJuegos]: this.statisticsService.getAllJugando(),
          [StatsTitles.JuegosEnProgreso]: this.statisticsService.getJuegosJugando(),
          [StatsTitles.JuegosTerminados]: this.statisticsService.getJuegosTerminados(),
          [StatsTitles.JuegosAbandonados]: this.statisticsService.getJuegosAbandonados(),
          [StatsTitles.ReviewsTotales]: this.statisticsService.getTotalReviews(),
          [StatsTitles.NotaMedia]: this.statisticsService.getNotaMedia()
        };
      }
    });
  }

  openChangePhotoDialog() {
    const dialogRef = this.dialog.open(ChangePhotoDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  changePassword() {
    // Implementa aquí la lógica para cambiar la contraseña
  }

  changeUsername() {
    // Implementa aquí la lógica para cambiar el correo
  }
}
