import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GlobalCancelService {
  constructor() {}
  private cancelSubject = new Subject<void>();

  getCancelSignal() {
    return this.cancelSubject.asObservable();
  }

  triggerCancel() {
    this.cancelSubject.next();
  }

  resetCancelSubject() {
    this.cancelSubject = new Subject<void>(); // Reset the subject after cancellation
  }
}
