import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { Validators } from "@angular/forms";
import { DialogFormConfig, SMFormEventData, SMFormListRow, SMToolBar  } from "../smvt-framework/interfaces/sm-framework-defaults";
import { CommonService } from "../smvt-framework/services/common.service";
import { SmFormComponent } from "../smvt-framework/sm-crud/sm-form/sm-form.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable, map } from "rxjs";
import { GenericDialogBase } from "../smvt-framework/base-class/generic-dialog-base";

@Component({
  selector: "app-sample",
  template: `
      <app-sm-form
        [data]="data"
        [formConfig]="dialogFormConfig"
        (formEvent)="onFormEvent($event)"
        (formSubmit)="onFormSubmit($event)">
      </app-sm-form>
  `,
})
export class SampleDialogComponent extends GenericDialogBase implements OnInit {
  constructor(
    public svc: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matRef:MatDialogRef<SampleDialogComponent>,
  ) {super(svc)}
  
  @ViewChild(SmFormComponent) dialogForm: SmFormComponent;
  dialogFormConfig: DialogFormConfig[] = [
    {
      api: "test",
      mode: this.data.mode,
      data: this.data.data,
      title:'Patient List',
      crudType:'dialog',
      cols: 4,
      rows: 5,
      fields: [
        { name: "name", type: "text", col:2, label: "User name", validators: [Validators.required], disabled: false},
        { name: "middle_name", type: "text", col:2,  optional: true, label: "Middle name", hint: "mark doe" },
        { name: "last_name", type: "text", col:2, optional: false, label: "Last name"},
        { name: "email", type: "email", col:2, optional: false, label: "Email", validators: [] },
        { name: "profession", type: "custom-list", col:2, list$: this.getCityList$.bind(this), optional: true, label: "User profession"},
        { name: "gender", type: "radio", col:2, label: "Gender", hint: undefined, validators:[Validators.required],disabled:true},
      ],
    },
  ];

  ngOnInit(): void {}
  onFormSubmit(data: any) {
    // console.log(data);
  }
  setMode() {}
  onFormEvent(event: SMFormEventData) {
  }
  getCityList$(data: any): Observable<SMFormListRow[]> {
    return this.svc.data.get("organizations").pipe(map((res: any) => res.data.map((d: any) => ({ value: d.id, text: d.org_name }))));
  }
}