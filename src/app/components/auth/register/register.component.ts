import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  username = new FormControl('', [Validators.required]);

  downloadUrl: Observable<string>;
  profileImageSrc: string | ArrayBuffer;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  signUp(email: string, password: string, username: string, photoURL: File): void {
    if (this.email.valid && this.password.valid && this.username.valid) {
      this.authService.signUp(email, password, username, photoURL);
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImageSrc = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getErrorMessage(formControl: FormControl) {
    if (formControl.hasError('required')) {
      return 'Debes introducir un valor';
    } else if (formControl.hasError('email')) {
      return 'Email no válido';
    } else if (formControl.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    return '';
  }

}
