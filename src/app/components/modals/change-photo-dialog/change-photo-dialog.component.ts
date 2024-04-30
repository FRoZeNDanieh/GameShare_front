import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, finalize } from 'rxjs';

@Component({
  selector: 'app-change-photo-dialog',
  templateUrl: './change-photo-dialog.component.html',
  styleUrls: ['./change-photo-dialog.component.scss']
})
export class ChangePhotoDialogComponent implements OnInit {

  selectedFile: File = null;
  selectedFileUrl: string = null;
  uploadProgress$: Observable<number>;

  constructor(private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: { uid: string, oldPhotoUrl: string },
    public dialogRef: MatDialogRef<ChangePhotoDialogComponent>) { }

  ngOnInit(): void { }

  onClose(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.selectedFileUrl = URL.createObjectURL(this.selectedFile);
  }

  onUpload(): void {
    const filePath = `ProfilePictures/${new Date().getTime()}_${this.selectedFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedFile);

    // Observe percentage changes.
    this.uploadProgress$ = task.percentageChanges();

    // Get notified when the download URL is available.
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          // Delete the old photo from the storage.
          if (this.data.oldPhotoUrl) {
            this.storage.refFromURL(this.data.oldPhotoUrl).delete();
          }

          // Update the photoURL of the user in Firestore.
          this.firestore.collection('usuarios').doc(this.data.uid).update({
            photoURL: url
          }).then(() => {
            this.dialogRef.close(true);
          }).catch((error) => {
            this.dialogRef.close(false);
          })
        });
      })
    ).subscribe();
  }

}
