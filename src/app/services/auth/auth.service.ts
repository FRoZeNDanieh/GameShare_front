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
        window.alert(error.message);
      });
  }

  signUp(email: string, password: string, username: string, photoUrl: File) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(userData => {

        const filePath = `ProfilePictures/${new Date().getTime()}_${photoUrl.name}`;
        const fileRef = this.storage.ref(filePath);

        this.storage.upload(filePath, photoUrl).then(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            const userRef = this.afs.collection('usuarios').doc(userData.user.uid);
            userRef.update({ photoURL: url })
          })
        })

        userData.user.updateProfile({
          displayName: username,
        }).then(() => {
          this.setUserData(userData.user);
        }).then(() => {
          this.router.navigate([RouteConstants.HOME_PAGE.path]);
        });
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`usuarios/${user.uid}`);

    const userData: AppUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(userData, { merge: true });
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate([RouteConstants.LOGIN_PAGE.path]);
    });
  }
}
