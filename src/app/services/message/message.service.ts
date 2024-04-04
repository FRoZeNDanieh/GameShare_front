import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FilterMessage } from '../../models/FilterMessage';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private subject = new Subject();

  sendMessage(filterMessage: FilterMessage) {
    this.subject.next(filterMessage);
  }

  clearMessages() {
    this.subject.next(new FilterMessage(true, "", null, null));
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
