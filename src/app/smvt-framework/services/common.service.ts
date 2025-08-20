import { Injectable, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { UIService } from './ui.service';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from 'src/app/core/service/shared/shared.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    public formBuilder: FormBuilder,
    public router: Router, 
    public dialog: MatDialog,
    public data: DataService,
    public ui:UIService,
    public shared:SharedService,
    public _liveAnnouncer:LiveAnnouncer,
  ) { }

  form:BehaviorSubject<any> = new BehaviorSubject(null)
  dialogForm = this.form.asObservable();

  tableData:BehaviorSubject<any> = new BehaviorSubject(null)
  dataSource = this.tableData.asObservable();
}
