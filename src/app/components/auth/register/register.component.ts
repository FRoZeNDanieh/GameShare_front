import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  downloadUrl: Observable<string>;
  profileImageSrc: string | ArrayBuffer;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  signUp(email: string, password: string, username: string, photoURL: File): void {
    this.authService.SignUp(email, password, username, photoURL);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
      this.profileImageSrc = e.target.result
    }
    reader.readAsDataURL(file);
  }

}
