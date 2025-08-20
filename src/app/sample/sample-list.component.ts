import { Component, OnInit, ViewChild } from "@angular/core";
import { SMCrudConfig, SMToolBar, SMToolbarEventData } from "../smvt-framework/interfaces/sm-framework-defaults";
import { CommonService } from "../smvt-framework/services/common.service";
import { SmCrudListComponent } from "../smvt-framework/sm-crud/sm-crud-list/sm-crud-list.component";
import { SmFormComponent } from "../smvt-framework/sm-crud/sm-form/sm-form.component";
import { SampleDialogComponent } from "./sample-dialog.component";
import { GenericListBase } from "../smvt-framework/base-class/generic-list-base";

@Component({
    selector:'app-sample-list',
    templateUrl:'./sample-list.component.html',
})

export class SampleListComponent extends GenericListBase implements OnInit {
  
  @ViewChild(SmFormComponent) dialogForm: SmFormComponent;
  constructor(public svc:CommonService){
    super(svc)
  };
  ngOnInit(): void {this.initList(this.listConfig)};

  toolbarConfig: SMToolBar = {
    title: "Patient List",
    button: [
      { name: "Add Patient", icon: "add", color: "gray", mode: 'Create' },
      { name: "Filter", icon: "filter_list", color: "gray", mode:'Filter' },
      { name: "Refresh", icon: "refresh", color: "gray", mode: 'Refresh' },
    ],
    filterConfig:{
      cols:6,
      fields:[
        {name:'name',label:"Name",type:'text'},
        {name:'role.roleName',label:"Role Name",type:'text'},
        // {name:'gender',label:"Select Gender",type:'custom-list' , list$:}
      ]
    }
  }
  
  listConfig : SMCrudConfig = {
    getApi:'supremeService/getAllCustomer',
    fields: [
      // { type: 'C', name: 'select', heading: '' },
      { type: 'S', name: 'name', heading: 'Name' },
      { type: 'S', name: 'role.roleName', heading: 'Role Name'},
      { type: 'C', name: '__copy', heading: 'Copy'},
      { type: 'C', name: '__action', heading: 'Actions'},
    ],
  }

  toolbarEventHandler(event:SMToolbarEventData,list:SmCrudListComponent){
    this.toolbar(event,list,SampleDialogComponent,this.toolbarConfig);
  }
  edit(row:any,e:any,ref:any) {
    this.editHandler(row,e,ref,SampleDialogComponent);
  }
}