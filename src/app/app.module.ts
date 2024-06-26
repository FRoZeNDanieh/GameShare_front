import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { GameCardComponent } from './components/games/game-card/game-card.component';
import { GameInfoComponent } from './components/games/game-info/game-info.component';
import { GamesComponent } from './components/games/games.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home/home.component';
import { WelcomeComponent } from './components/home/welcome/welcome.component';
import { ListComponent } from './components/list/list.component';
import { FilterComponent } from './components/filter/filter.component';

import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { getAuth, Auth } from '@angular/fire/auth';
import { getFirestore, Firestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

import { AuthService } from './services/auth/auth.service';
import { DatePipe } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangePhotoDialogComponent } from './components/modals/change-photo-dialog/change-photo-dialog.component';
import { ChangePassDialogComponent } from './components/modals/change-pass-dialog/change-pass-dialog.component';
import { ChangeUsernameDialogComponent } from './components/modals/change-username-dialog/change-username-dialog.component';
import { DeleteAccountDialogComponent } from './components/modals/delete-account-dialog/delete-account-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    WelcomeComponent,
    GamesComponent,
    HeaderComponent,
    GameCardComponent,
    GameInfoComponent,
    ListComponent,
    FilterComponent,
    ProfileComponent,
    ChangePhotoDialogComponent,
    ChangePassDialogComponent,
    ChangeUsernameDialogComponent,
    DeleteAccountDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatInputModule,
    MatExpansionModule,
    MatListModule,
    MatProgressBarModule
  ],
  providers: [AuthService,
    MatDatepickerModule,
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: FirebaseApp, useFactory: () => initializeApp(environment.firebase) },
    { provide: Auth, useFactory: () => getAuth() },
    { provide: Firestore, useFactory: () => getFirestore() },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
