import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FilterMessage } from 'src/app/models/FilterMessage';
import { FilterService } from 'src/app/services/filter/filter.service';
import { MessageService } from 'src/app/services/message/message.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  allGenres: string[]
  selectedGenre: string;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null)
  });

  constructor(private filterService: FilterService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.allGenres = this.filterService.getAllGenres();
  }

  resetForm(): void {
    let filterMessage: FilterMessage = {
      reset: true,
      genre: "",
      startDate: null,
      endDate: null,
    }

    this.selectedGenre = '';
    this.messageService.sendMessage(filterMessage);
    this.range.reset();
  }

  filterGames(): void {
    let filterMessage: FilterMessage = {
      reset: false,
      genre: this.selectedGenre,
      startDate: this.range.value.start,
      endDate: this.range.value.end
    }

    this.messageService.sendMessage(filterMessage);
  }
}
