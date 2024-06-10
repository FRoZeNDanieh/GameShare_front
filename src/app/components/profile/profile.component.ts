import { ChangePhotoDialogComponent } from './../modals/change-photo-dialog/change-photo-dialog.component';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { StatsTitles } from 'src/app/models/constants/StatsTitles';
import { StatisticsService } from 'src/app/services/statistics/statistics.service';
import { ChangePassDialogComponent } from '../modals/change-pass-dialog/change-pass-dialog.component';
import { ChangeUsernameDialogComponent } from '../modals/change-username-dialog/change-username-dialog.component';
import { DeleteAccountDialogComponent } from '../modals/delete-account-dialog/delete-account-dialog.component';
import { Router } from '@angular/router';
import { RouteConstants } from 'src/app/models/constants/route-constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  currentUser: User;
  userProfileImage: string;

  public statsObservables: { [key in StatsTitles]?: Observable<number> };

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private statisticsService: StatisticsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router) { }

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
    const dialogRef = this.dialog.open(ChangePhotoDialogComponent, {
      data: {
        uid: this.currentUser.uid,
        oldPhotoUrl: this.userProfileImage
      },
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.snackBar.open('La foto se ha cambiado correctamente', 'Cerrar', {
          duration: 2000,
        });
      } else if (result === false) {
        this.snackBar.open('Hubo un error al cambiar la foto', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  openChangePassDialog() {
    const dialogRef = this.dialog.open(ChangePassDialogComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.snackBar.open('Se ha cambiado la contraseña correctamente', 'Cerrar', {
          duration: 2000,
        });
      } else if (result === false) {
        this.snackBar.open('Hubo un error al cambiar la contraseña', 'Cerrar', {
          duration: 2000,
        });
      }
    });
  }

  openChangeUsernameDialog() {
    const dialogRef = this.dialog.open(ChangeUsernameDialogComponent, {
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.snackBar.open('Se ha cambiado el nombre de usuario correctamente', 'Cerrar', {
          duration: 2000
        });
      } else if (result === false) {
        this.snackBar.open('Hubo un error al cambiar el nombre de usuario', 'Cerrar', {
          duration: 2000
        });
      }
    });
  }

  openDeleteAccountDialog() {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, {
      width: '800px',
    });

    return dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.onDeleteAccount();
      }
    });
  }


  onDeleteAccount() {
    if (this.currentUser) {

      // Delete user document from Firestore
      this.db.collection('usuarios').doc(this.currentUser.uid).delete()
        .then(() => {
          // User document deleted successfully from Firestore
          // Now delete user from Authentication
          return this.currentUser.delete();
        })
        .then(() => {
          // User deleted successfully from Authentication
          this.snackBar.open('La cuenta se ha eliminado correctamente', 'Cerrar', {
            duration: 2000,
          });
          this.router.navigate([RouteConstants.LOGIN_PAGE.path]);
        })
        .catch((error) => {
          // Error occurred either deleting user document from Firestore or deleting user from Authentication
          let errorMessage = 'Hubo un error al eliminar la cuenta de Firestore';
          if (error.code === 'auth/requires-recent-login') {
            errorMessage = 'Hubo un error al eliminar la cuenta de Authentication';
          }
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 2000,
          });
        });
    }
  }

}
