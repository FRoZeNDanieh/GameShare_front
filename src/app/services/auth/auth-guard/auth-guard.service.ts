import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { RouteConstants } from 'src/app/models/constants/route-constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  canActivateChild: CanActivateChildFn = (): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          this.router.navigate([RouteConstants.LOGIN_PAGE.path]);
          return false;
        }
      })
    );
  }
}
