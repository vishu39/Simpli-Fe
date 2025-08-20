import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output('toolbarEvent') toolbarEvent:EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  emitToolBarEvent($event:HTMLButtonElement,mode:string){
    let data = {$event,mode}
    this.toolbarEvent.emit(data);
  }

}
