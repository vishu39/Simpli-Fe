import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SidebarService {
  private isSidebarShrunk = new BehaviorSubject<boolean>(false);
  sidebarShrunk$ = this.isSidebarShrunk.asObservable();

  setSidebarShrunk(value: boolean) {
    this.isSidebarShrunk.next(value);
  }

  getSidebarShrunkValue(): boolean {
    return this.isSidebarShrunk.value;
  }
}
