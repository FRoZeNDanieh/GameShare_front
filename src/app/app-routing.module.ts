import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteConstants } from './models/constants/route-constants';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { GamesComponent } from './components/games/games.component';
import { HomeComponent } from './components/home/home/home.component';
import { WelcomeComponent } from './components/home/welcome/welcome.component';
import { ListComponent } from './components/list/list.component';

const routes: Routes = [
  { path: '', redirectTo: RouteConstants.LOGIN_PAGE.path, pathMatch: 'full' },
  { path: RouteConstants.LOGIN_PAGE.path, component: LoginComponent },
  { path: RouteConstants.REGISTER_PAGE.path, component: RegisterComponent },
  {
    path: RouteConstants.HOME_PAGE.path, component: HomeComponent, children: [
      { path: '', component: WelcomeComponent },
      { path: RouteConstants.WELCOME_PAGE.path, component: WelcomeComponent },
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
