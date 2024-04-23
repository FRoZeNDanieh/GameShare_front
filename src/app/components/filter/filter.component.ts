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
  editorControl = new FormControl();
  pegiControl = new FormControl();
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  allGenres: string[];
  allDevelopers: string[];
  allEditors: string[];
  allPegi: number[];

  constructor(private filterService: FilterService, private filterStateService: FilterStateService) { }

  async ngOnInit(): Promise<void> {
    this.allGenres = await this.filterService.getAllGenres();
    this.allDevelopers = await this.filterService.getAllDevelopers();
    this.allEditors = await this.filterService.getAllEditors();
    this.allPegi = await this.filterService.getAllPegi();

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
    });

    this.editorControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.updateFilterState();
    });

    this.pegiControl.valueChanges.pipe(
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
      editor: this.editorControl.value,
      pegi: this.pegiControl.value,
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
    this.editorControl.reset();
    this.pegiControl.reset();
    this.range.reset();
  }
}
