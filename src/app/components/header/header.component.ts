import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstants } from 'src/app/models/constants/route-constants';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  currentUser: User;
  userProfileImage: string;

  constructor(private router: Router, private authService: AuthService, public afAuth: AngularFireAuth, private db: AngularFirestore) { }


  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.db.collection('usuarios').doc(user.uid).valueChanges().subscribe((userData: any) => {
          this.currentUser = user;
          this.userProfileImage = userData.photoURL;
        })
      }
    });
  }

  goTo(route: string): void {
    this.router.navigate([RouteConstants.HOME_PAGE.path + '/' + route])
  }

  onSignOut() {
    this.authService.signOut();
  }
}
