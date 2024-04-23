export class FilterMessage {
  reset: boolean = false;
  genre: string;
  developer: string;
  editor: string;
  pegi: number;
  startDate: Date = new Date();
  endDate: Date = new Date();
  search: string;

  constructor(reset: boolean = false, genre: string, developer: string, editor: string, pegi: number, startDate: Date, endDate: Date, search: string) {
    reset = reset || false;
    genre = genre || null;
    developer = developer || null;
    editor = editor || null;
    pegi = pegi || null;
    startDate = startDate || null;
    endDate = endDate || null;
    search = search || null;
  }
}
