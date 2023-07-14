import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RouteConstants } from './shared/models/constants/route-constants';
import { HomeComponent } from './home/home/home.component';
import { GamesComponent } from './games/games.component';
import { WelcomeComponent } from './home/welcome/welcome.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', redirectTo: RouteConstants.LOGIN_PAGE.path, pathMatch: 'full' },
  { path: RouteConstants.LOGIN_PAGE.path, component: LoginComponent },
  { path: RouteConstants.REGISTER_PAGE.path, component: RegisterComponent },
  {
    path: RouteConstants.HOME_PAGE.path, component: HomeComponent, children: [
      { path: '', component: WelcomeComponent },
      { path: RouteConstants.GAMES_PAGE.path, component: GamesComponent },
      { path: RouteConstants.LIST_PAGE.path, component: ListComponent }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
