import { Component, EventEmitter, HostListener, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/smvt-framework/services/common.service';
import { SmFormComponent } from 'src/app/smvt-framework/sm-crud/sm-form/sm-form.component';
import { QueryService } from './query.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})

export class QueryComponent implements OnInit {
  windowWidth:number|string;
  isDetails:boolean = true;
  isTabs:boolean = false;
  tabs = this.querySvc.tabs;
  queryButtons = this.querySvc.queryButtons;

  @Output('queryEvent') queryEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild(SmFormComponent) dialogForm: SmFormComponent;
  
  constructor(private svc : CommonService,private querySvc:QueryService) {
    this.windowWidth = window.innerWidth
  }
  ngOnInit(): void {}
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = event.target.innerWidth;
  }
  btnHandler($event,prop,itemData:any){
    let data = {$event,prop,mode:prop.name,data:itemData}
    this.queryEvent.emit(data);
  }
  validateButton(name:string){
    return (
      name !== 'Assign' 
    )
  }
}