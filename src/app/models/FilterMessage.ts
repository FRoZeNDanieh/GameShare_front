export class FilterMessage {
  reset: boolean = false;
  genre: string;
  developer: string;
  startDate: Date = new Date();
  endDate: Date = new Date();
  search: string;

  constructor(reset: boolean = false, genre: string, developer: string, startDate: Date, endDate: Date, search: string) {
    reset = reset || false;
    genre = genre || null;
    developer = developer || null;
    startDate = startDate || null;
    endDate = endDate || null;
    search = search || null;
  }
}
