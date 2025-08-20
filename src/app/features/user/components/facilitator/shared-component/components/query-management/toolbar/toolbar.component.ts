import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  timeout = null;
  @Output('toolbarEvent') toolbarEvent: EventEmitter<any> = new EventEmitter();
  @Output('searchEvent') searchEvent: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  serchValue(text: string) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.searchEvent.emit(text)
    }, 600);
  }

  emitToolBarEvent($event: HTMLButtonElement, mode: string) {
    let data = { $event, mode }
    this.toolbarEvent.emit(data);
  }
}
