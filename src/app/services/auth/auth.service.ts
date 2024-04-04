import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { RouteConstants } from 'src/app/models/constants/route-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    public router: Router,
    public ngZone: NgZone,
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate([RouteConstants.HOME_PAGE.path]);
          }
        });
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  SignUp(email: string, password: string, username: string, photoUrl: File) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(userData => {

        var n = Date.now();
        const filePath = `ProfilePictures/${n}`;
        const fileRef = this.storage.ref(filePath);

        this.storage.upload(filePath, photoUrl).then(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            const userRef = this.afs.collection('usuarios').doc(userData.user.uid);
            userRef.set({ photoURL: url })
          })
        })

        userData.user.updateProfile({
          displayName: username,
        }).then(() => {
          this.SetUserData(userData.user);
        }).then(() => {
          this.router.navigate([RouteConstants.HOME_PAGE.path]);
        });
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`usuarios/${user.uid}`);

    const userData: User = {
      uid: user.uid,
      email: user.email,
      nombre: user.displayName,
      photo: user.photoURL
    };
    return userRef.set(userData, { merge: true });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate([RouteConstants.LOGIN_PAGE.path]);
    });
  }
}
