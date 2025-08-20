import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { SMToolBar, SMToolbarEventData } from '../../interfaces/sm-framework-defaults';
import { GenericToolbarBase } from '../../base-class/generic-toolbar-base';

@Component({
  selector: 'app-sm-toolbar',
  templateUrl: './sm-toolbar.component.html',
  styleUrls: ['./sm-toolbar.component.scss']
})
export class SmToolbarComponent extends GenericToolbarBase  implements OnInit {
  windowWidth:number|string;
  @Input('toolBarConfig') config:SMToolBar;
  @Output('toolbarEvent') toolbarEvent :EventEmitter<SMToolbarEventData> = new EventEmitter();

  constructor(public svc : CommonService) {
    super(svc);
    this.windowWidth = window.innerWidth
  }
  ngOnInit(): void {};

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.windowWidth = event.target.innerWidth;
  }
  toolbarButtonHandler(mode:string, eventType:any , $event:any,title?:string,value?:string,formData:any = null){
    let data : SMToolbarEventData = {mode,eventType,$event,title,value,data:formData}
    this.toolbarEvent.emit(data);
  }
}
