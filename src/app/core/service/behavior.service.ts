import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BehaviorService {

  private dataSource = new Subject<any>();
  data$ = this.dataSource.asObservable();
  private selectedOptionsSubject = new BehaviorSubject<any[]>([]);

  sendData(data: any) {
    this.dataSource.next(data);
  }

  getSelectedOptionsSubject() {
    return this.selectedOptionsSubject;
  }

  updateSelectedOptions(options: string[]) {
    this.selectedOptionsSubject.next(options);
  }
}
