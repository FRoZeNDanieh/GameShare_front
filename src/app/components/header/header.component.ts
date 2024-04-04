import { User } from 'firebase/auth';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouteConstants } from 'src/app/models/constants/route-constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  profileImageSrc: string | ArrayBuffer;
  currentUser: User;

  constructor(private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    afAuth.authState.subscribe(user => {
      this.currentUser = user;
      this.getUserInfo();
    });
  }

  ngOnInit(): void {
  }

  goTo(route: string): void {
    this.router.navigate([RouteConstants.HOME_PAGE.path + '/' + route])
  }

  getUserInfo(): void {
    this.afs.collection("usuarios").doc(this.currentUser.uid).get().subscribe(user => {
      console.log(user.get("photo"))
    })
  }
}
