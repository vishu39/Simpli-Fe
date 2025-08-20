import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-generic-filter-dialog',
  templateUrl: './generic-filter-dialog.component.html',
  styleUrls: ['./generic-filter-dialog.component.scss']
})
export class GenericFilterDialogComponent implements OnInit {
  filterConfig: any;

  constructor(
    public matRef:MatDialogRef<GenericFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private svc : CommonService
  ) { }

  form: FormGroup<{}>;
  fields:any[]

  ngOnInit(): void {
    this.filterConfig = this.data.toolbar.filterConfig;
    this.fields = this.data.toolbar.filterConfig.fields;
    this.prepareFormGroup();
    this.setupFields();
    this.matRef.updateSize(`${this.filterConfig['cols'] * 150}px`,`${this.filterConfig['rows'] * 110}px`);
  }
  prepareFormGroup() {
    let group = {};
    this.fields.map((f) => (group[f.name] = new FormControl({value:null, disabled:f.disabled}, f.validator)));
    this.form = this.svc.formBuilder.group(group);
    this.svc.form.next(this.form);
  }
  setupFields() {
    this.fields = this.fields.map((res: any) => {
      return {
        ...res,
        class: 'w-' + res.col + '-' + this.filterConfig['cols'],
      }
    })
  }
  emitFormEvent(name,type,event){
    
  }
}
