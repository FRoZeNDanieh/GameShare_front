import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AppUser } from '../../models/AppUser';
import { RouteConstants } from 'src/app/models/constants/route-constants';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    public router: Router,
    public ngZone: NgZone,
    public snackBar: MatSnackBar,
  ) { }

  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate([RouteConstants.HOME_PAGE.path]);
          }
        });
      }).catch((error) => {
        console.error(error);
        this.snackBar.open('Correo electrónico y/o contraseña incorrectos', 'Cerrar', {
          duration: 3000,
        });
      });
  }

  signUp(email: string, password: string, username: string, photoUrl: File) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(userData => {

        if (photoUrl) {
          const filePath = `ProfilePictures/${new Date().getTime()}_${photoUrl.name}`;
          const fileRef = this.storage.ref(filePath);

          this.storage.upload(filePath, photoUrl).then(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              const userRef = this.afs.collection('usuarios').doc(userData.user.uid);
              userRef.update({ photoURL: url })
            });
          });
        }

        userData.user.updateProfile({
          displayName: username,
        }).then(() => {
          this.setUserData(userData.user, true);
        }).then(() => {
          this.router.navigate([RouteConstants.HOME_PAGE.path]);
        });
      }).catch((error) => {
        let errorMessage: string;
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'El correo electrónico ya está en uso';
        } else {
          errorMessage = 'Error al registrarse';
        }
        console.error(error);
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
        });
      });
  }

  setUserData(user: any, isSignUp: boolean = false) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`usuarios/${user.uid}`);

    // Obtenemos los datos actuales del usuario en Firestore solo si no es un registro.
    if (!isSignUp) {
      return firstValueFrom(userRef.get()).then((doc) => {
        if (doc.exists) {
          const userData: AppUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: doc.data().photoURL
          };

          return userRef.set(userData, { merge: true });
        } else {
          throw new Error('No such document!');
        }
      });
    } else {
      const userData: AppUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      };

      return userRef.set(userData, { merge: true });
    }
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate([RouteConstants.LOGIN_PAGE.path]);
    });
  }

  async updateUsernameInFirestore(newUsername: string) {
    const user = await this.afAuth.currentUser;
    if (user) {
      return this.afs.collection('usuarios').doc(user.uid).update({
        displayName: newUsername,
      });
    }
  }
}
