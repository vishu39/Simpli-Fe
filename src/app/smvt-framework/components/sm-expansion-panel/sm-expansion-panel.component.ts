import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { SMFormEventData } from '../../interfaces/sm-framework-defaults';

@Component({
  selector: 'app-sm-expansion-panel',
  templateUrl: './sm-expansion-panel.component.html',
  styleUrls: ['./sm-expansion-panel.component.scss'],
})
export class SmExpansionPanelComponent implements OnInit {

  @Input('panelConfig') data: any;  
  @Output('expansionEvent') expansionEvent: EventEmitter<any> = new EventEmitter()
  constructor() { }
  today:Date = new Date();
  ngOnInit(): void {}
  emitExpansionEvent(fieldName:any, eventType:any , $event:any){
    let data: SMFormEventData = { fieldName: fieldName, eventType: eventType, $event: $event }
    this.expansionEvent.emit(data);
  }

}
