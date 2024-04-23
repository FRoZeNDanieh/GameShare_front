import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-change-photo-dialog',
  templateUrl: './change-photo-dialog.component.html',
  styleUrls: ['./change-photo-dialog.component.scss']
})
export class ChangePhotoDialogComponent {

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore) {}
}
