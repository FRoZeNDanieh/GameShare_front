import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterMessage } from 'src/app/models/FilterMessage';

@Injectable({
  providedIn: 'root'
})
export class FilterStateService {

  private filterState = new BehaviorSubject<FilterMessage>({
    reset: true,
    genre: null,
    developer: null,
    editor: null,
    pegi: null,
    startDate: null,
    endDate: null,
    search: null,
  });

  filterState$ = this.filterState.asObservable();

  constructor() { }

  updateFilterState(filterMessage: FilterMessage) {
    this.filterState.next(filterMessage)
  }
}
