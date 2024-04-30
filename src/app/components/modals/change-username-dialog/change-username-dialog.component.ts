import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-change-username-dialog',
  templateUrl: './change-username-dialog.component.html',
  styleUrls: ['./change-username-dialog.component.scss']
})
export class ChangeUsernameDialogComponent implements OnInit {

  changeUsernameForm: FormGroup;

  constructor(private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private dialogRef: MatDialogRef<ChangeUsernameDialogComponent>,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.changeUsernameForm = this.fb.group({
      newUsername: ['', Validators.required]
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onChangeUsername(): void {
    if (this.changeUsernameForm.valid) {
      const newUsername = this.changeUsernameForm.get('newUsername').value;

      this.afAuth.currentUser.then((user) => {
        if (user) {
          user.updateProfile({
            displayName: newUsername,
          }).then(() => {
            this.authService.updateUsernameInFirestore(newUsername)
              .then(() => {
                this.dialogRef.close(true);
              })
              .catch(error => {
                console.error(error);
                this.dialogRef.close(false);
              });
          }).catch(error => {
            console.error(error);
            this.dialogRef.close(false);
          });
        }
      })
    }
  }
}
