import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouteConstants } from '../shared/models/constants/route-constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router) {}

  goTo(route: string): void {

    this.router.navigate([RouteConstants.HOME_PAGE.path + '/' + route])
  }
}
