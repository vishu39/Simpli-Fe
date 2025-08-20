import { Component, Input, OnInit } from '@angular/core';
import { GenericCrudBase } from '../../base-class/generic-crud-base';
import { CommonService } from '../../services/common.service';
import { SMCrudConfig } from '../../interfaces/sm-framework-defaults';

@Component({
  selector: 'app-sm-crud-list',
  templateUrl: './sm-crud-list.component.html',
  styleUrls: ['./sm-crud-list.component.scss']
})
export class SmCrudListComponent extends GenericCrudBase implements OnInit{
  @Input('listConfig') listConfig:SMCrudConfig;

  constructor(public svc:CommonService) { 
    super(svc)
  }
  ngOnInit(): void {};
}