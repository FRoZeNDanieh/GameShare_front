import { Timestamp } from "firebase/firestore";

export interface Game {
  uid: string;
  titulo: string;
  descripcion: string;
  genero: string;
  desarrollador: string;
  editor: string;
  fecha: Timestamp;
  imagenPortada: string;
  imagen: string;
}
