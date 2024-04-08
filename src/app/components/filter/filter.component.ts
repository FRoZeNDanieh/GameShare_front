import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FilterMessage } from 'src/app/models/FilterMessage';
import { FilterService } from 'src/app/services/filter/filter.service';
import { FilterStateService } from 'src/app/services/filterState/filter-state.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  searchControl = new FormControl();
  genreControl = new FormControl();
  developerControl = new FormControl();
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  allGenres: string[];
  allDevelopers: string[];

  constructor(private filterService: FilterService, private filterStateService: FilterStateService) { }

  ngOnInit(): void {
    this.allGenres = this.filterService.getAllGenres();
    this.allDevelopers = this.filterService.getAllDevelopers();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.updateFilterState();
    });

    this.genreControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.updateFilterState();
    });

    this.developerControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.updateFilterState();
    })

    this.range.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.updateFilterState();
    });
  }

  updateFilterState(): void {
    let filterMessage: FilterMessage = {
      reset: false,
      genre: this.genreControl.value,
      developer: this.developerControl.value,
      startDate: this.range.value.start,
      endDate: this.range.value.end,
      search: this.searchControl.value
    }

    this.filterStateService.updateFilterState(filterMessage);
  }

  resetForm(): void {
    this.searchControl.reset();
    this.genreControl.reset();
    this.developerControl.reset();
    this.range.reset();
  }
}
