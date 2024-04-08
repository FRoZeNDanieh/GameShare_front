import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage, private firestore: AngularFirestore, private snackBar: MatSnackBar) { }

  uploadProfileImage(file: File, userId: string) {
    const filePath = `ProfilePictures/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // Observa los cambios en el porcentaje de carga y actualiza Firestore al finalizar.
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.firestore.collection('usuarios').doc(userId).update({
            profileImage: url
          }).then(() => {
            this.snackBar.open('Imagen cargada correctamente', 'Cerrar', {
              duration: 2000
            });
          }).catch((error) => {
            this.snackBar.open(`Error al cargar la imagen: ${error}`, 'Cerrar', {
              duration: 5000
            });
          });
        });
      })
    ).subscribe();
  }
}
