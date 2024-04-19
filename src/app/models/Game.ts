import { Timestamp } from "firebase/firestore";

export interface Game {
  uid: string;
  titulo: string;
  descripcion: string;
  genero: string;
  desarrollador: string;
  editor: string;
  fecha: Timestamp;
  fechaFormatted?: string;
  imagenPortada: string;
  imagen: string;
  pegi: number;
  estado?: string;
  rating?: number;
}
