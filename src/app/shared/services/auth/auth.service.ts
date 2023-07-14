import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { RouteConstants } from 'src/app/shared/models/constants/route-constants';
import { User } from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
  ) {
    // Saving user data in localstorage when logged in and setting up null when logged out
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Sign in with email/password
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

  // Sign up with email/password
  SignUp(email: string, password: string, username: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(userData => {
        userData.user.updateProfile({
          displayName: username
        }).then(() => {
          this.SetUserData(userData.user);
        }).then(() => {
          this.router.navigate([RouteConstants.HOME_PAGE.path]);
        });
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  /** Setting up user data when sign in with username/password, sign up with username/password and sign in with social auth provider in Firestore database using
     AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`usuarios/${user.uid}`);

    const userData: User = {
      uid: user.uid,
      email: user.email,
      nombre: user.displayName
    };
    return userRef.set(userData, { merge: true });
  }

  // Reset forgot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      });
  }

  // Returns true when user is logged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate([RouteConstants.LOGIN_PAGE.path]);
    })
  }
}
