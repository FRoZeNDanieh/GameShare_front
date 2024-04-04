export class FilterMessage {
  reset: boolean = false;
  genre: string;
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(reset: boolean = false, genre: string, startDate: Date, endDate: Date) {
    reset = reset || false;
    genre = genre || "";
    startDate = startDate || null;
    endDate = endDate || null;
  }
}
