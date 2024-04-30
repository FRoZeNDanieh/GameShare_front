import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-pass-dialog',
  templateUrl: './change-pass-dialog.component.html',
  styleUrls: ['./change-pass-dialog.component.scss']
})
export class ChangePassDialogComponent implements OnInit {

  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    public dialogRef: MatDialogRef<ChangePassDialogComponent>) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.changePasswordForm.setValidators(this.checkPasswords());
  }

  onClose(): void {
    this.dialogRef.close();
  }

  checkPasswords(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.get('newPassword').value;
      const confirmPassword = control.get('confirmPassword').value;

      if (newPassword !== confirmPassword) {
        control.get('confirmPassword').setErrors({ notSame: true });
      }

      return null;
    };
  }

  onChangePassword(): void {
    if (this.changePasswordForm.valid) {
      const oldPassword = this.changePasswordForm.get('oldPassword').value;
      const newPassword = this.changePasswordForm.get('newPassword').value;

      this.afAuth.currentUser.then((user) => {
        if (user) {
          this.afAuth.signInWithEmailAndPassword(user.email, oldPassword)
            .then((userCredential) => {
              userCredential.user.updatePassword(newPassword)
                .then(() => {
                  this.dialogRef.close(true);
                })
                .catch(error => {
                  console.error(error);
                  this.dialogRef.close(false);
                });
            })
            .catch(error => {
              console.error(error);
              this.changePasswordForm.get('oldPassword').setErrors({ incorrect: true });
            });
        }
      });
    }
  }


}
