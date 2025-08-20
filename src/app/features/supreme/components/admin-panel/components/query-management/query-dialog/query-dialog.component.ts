import { Component, EventEmitter, Inject, Output, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable, map } from "rxjs";
import { DialogFormConfig, SMFormEventData, SMFormListRow } from "src/app/smvt-framework/interfaces/sm-framework-defaults";
import { CommonService } from "src/app/smvt-framework/services/common.service";
import { SmFormComponent } from "src/app/smvt-framework/sm-crud/sm-form/sm-form.component";
import { QueryDialogService } from "./query-dialog.service";
import { Validators } from "@angular/forms";
import { GenericDialogBase } from "src/app/smvt-framework/base-class/generic-dialog-base";

@Component({
  selector: 'app-query-dialog',
  template: `
    <app-sm-form [data]="data" [radioData]="selected" [formConfig]="dialogFormConfig" (formEvent)="onFormEvent($event)" (formSubmit)="onFormSubmit($event)">
      <div *ngIf="isRadio" class="sm-custom-content" custom-fields>
        <ng-container>
            <mat-radio-group [(ngModel)]="selected" class="_radio hide-scrollbar" style="width: 100%">
              <mat-radio-button style="margin-right:10px;" *ngFor="let option of radioGroup" (change)="radioChangeHandler($event,option)" [value]="option.name">{{option.name}}</mat-radio-button>
            </mat-radio-group>
        </ng-container>
      </div>
    </app-sm-form>
  `,
  providers:[QueryDialogService]
})

export class QueryDialog extends GenericDialogBase {
  selected:string;
  mode:string;
  radioGroup:any[];
  isRadio:boolean = true;

  constructor(
    public svc: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matRef: MatDialogRef<QueryDialog>,
    private querySVC: QueryDialogService,
  ) { super(svc) }

  @ViewChild(SmFormComponent) dialogForm: SmFormComponent;

  dialogFormConfig:DialogFormConfig[];
  
  attendantsConfig = [
    { name: "attendant_name", type: "text", col: 2, label: "Attendant Name (As per passport)", validators: [Validators.required] },
    { name: "attendant_passport_number", type: "text", col: 2, label: "Passport Number", validators: [Validators.required, Validators.maxLength(12)] },
    { name: "attendant_country", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Attendant Country" },
    { name: "attendant_passport", type: "files", col: 6, optional: false, label: "Upload attendant passports", validators: [Validators.required], startNewRow: true, multiple: true },
  ]
  donorsConfig = [
    { name: "donor_name", type: "text", col: 2, label: "Donor Name (As per passport)", validators: [Validators.required] },
    { name: "donor_passport_number", type: "text", col: 2, label: "Passport Number", validators: [Validators.required, Validators.maxLength(12)] },
    { name: "donor_country", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Donor Country"},
    { name: "donor_passport", type: "files", col: 6, optional: false, label: "Upload donor passports", validators: [Validators.required], startNewRow: true, multiple: true },
  ]
  embassyConfig = [
    { name: "embassy_address", type: "text", col: 3, label: "Embassy Address", validators: [Validators.required] },
  ]
  assignVIL: DialogFormConfig[] = [
    {
      api: "test",
      title: this.data.title,
      cols: 6,
      rows: 6,
      crudType: 'dialog',
      fields: [
        { name: "patient_name", type: "text", col: 3, label: "Patient Name (As Per Passport)", placeholder: "Patient Name As Per Passport", validators: [Validators.required] },
        { name: "passport_number", type: "text", col: 3, label: "Passport Number", validators: [Validators.required, Validators.maxLength(12)] },
        { name: "passport", type: "files", col: 6, optional: false, label: "Upload Patients Passport", validators: [Validators.required], startNewRow: true, multiple: true },
        { name: "attendants", type: "group", col: 6, label: "Attendant", startNewRow: true, groupConfig: this.attendantsConfig, btnColor: '#fff35a', btnName:'Add Attendant' },
        { name: "donors", type: "group", col: 6, label: "Donor", startNewRow: true, groupConfig: this.donorsConfig, btnColor: '#7dd9f6', btnName:'Add Donor' },
        { name: "appointment_date", type: "date-time", optional: true, col: 3, label: "Date of appointment", pickerType: 'both' },
        { name: "doctor_name", type: "text", col: 3, label: "Doctor Name", optional:true },
        { name: "embassy", type: "custom-list", col: 3, list$: this.getCityList$.bind(this), label: "Select Embassy", optional:true},
        { name: '', type:'label-only',label:'OR', startNewRow:true},
        { name: "embassy_details", type: "group", col: 6, label: "Embassy Address", startNewRow: true, groupConfig: this.embassyConfig, btnColor: '#7fd2f6', btnName:'Add Embassy Address' },

        { name: "top_hospitals", type: "radio", col: 6, list$: this.getCityList$.bind(this), label: "Top Used Hospitals", startNewRow: true },
        { name: "hospitals", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Search Hospital", validators: [Validators.required] },
        { name: "employee", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Employee", multiple: true, optional:true, startNewRow: true },
        { name: "aggregator", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Aggregator", optional:true, multiple: false },
        { name: "doctor", type: "text", col: 2, label: "Doctor Name",optional:true },
        { name: "next", type: "button", col: 2, label: "Check Email Details", startNewRow: true, color: 'primary' }
      ]
    },
  ];

  assignOR:DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "top_hospitals", type: "multi-checkbox", col: 6, list$: this.getCityList$.bind(this), label: "Top Used Hospitals",startNewRow:true},
      { name: "hospitals", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Search Hospital", validators: [Validators.required] },
      { name: "employee", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Employee",multiple:true, optional:true, startNewRow:true},
      { name: "aggregator", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Aggregator",optional:true,multiple:false},
      { name: "doctor", type: "text", col: 2, label: "Doctor Name", optional:true},
      { name: "next", type: "button", col: 2, label: "Check Email Details",startNewRow:true,color:'primary'},
    ]
  }]
  assignPreIntimation:DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "top_hospitals", type: "multi-checkbox", col: 6, list$: this.getCityList$.bind(this), label: "Top Used Hospitals",startNewRow:true},
      { name: "hospitals", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Search Hospital", validators: [Validators.required] },
      { name: "employee", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Employee",multiple:true, optional:true, startNewRow:true},
      { name: "aggregator", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Aggregator",optional:true, multiple:false},
      { name: "doctor", type: "text", col: 2, label: "Doctor Name"},
      { name: "next", type: "button", col: 2, label: "Check Email Details",startNewRow:true,color:'primary'},
    ]
  }]

  assignOPD: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "top_hospitals", type: "radio", col: 6, list$: this.getCityList$.bind(this), label: "Top Used Hospitals", startNewRow: true },
      { name: "hospitals", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Search Hospital", validators: [Validators.required] },
      { name: "employee", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Employee", multiple: true,optional:true, startNewRow: true },
      { name: "aggregator", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Aggregator", optional:true, multiple: false },
      { name: "doctor", type: "text", col: 2, label: "Doctor Name" },
      { name: "next", type: "button", col: 2, label: "Check Email Details", startNewRow: true, color: 'primary' },
    ]
  }]

  assignConfirmation: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "patient_details", type: 'label-only', label: 'Patient Details' },
      { name: "patient_name", type: "text", col: 2, label: "Patient Name", disabled: true, startNewRow: true },
      { name: "treatment", type: "text", col: 2, label: "Treatment", disabled: true },
      { name: "country", type: "text", col: 2, label: "Country", disabled: true },
      { name: "hospital", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Hospital", multiple: false, validators: [Validators.required] },
      { name: "cabs", type: "number", col: 2, label: "No. of cabs required", optional: true, validators: [Validators.max(100)]},

      { name: "flight_details", type: 'label-only', label: 'Flight Details', startNewRow: true },
      { name: "flight_name", type: "text", col: 2, label: "Flight Name", optional: true, startNewRow: true },
      { name: "flight_no", type: "text", col: 2, label: "Flight No.", optional: true },
      { name: "arrival_date", type: "date-time", col: 2, label: "Arrival Date And Time", validators: [Validators.required],pickerType:'both'},
      { name: "contact_person", type: "text", col: 2, label: "Contact Person", optional: true},
      { name: "contact_person_number", type: "number", col: 2, label: "Contact Person Number", optional: true},
      { name: "coordinator_address", type: "text", col: 2, label: "Contact Person", optional: true},
      { name: "coordinator_pickup_time", type: "date-time", col: 2, label: "Coordinator Pickup Date And Time", optional:true, pickerType:'both' },
      { name: "ticket", type: "files", col: 6, label: "Upload Ticket", validators: [Validators.required]},
      { name: "remark", type: "textarea", col: 6, label: "Remarks", validators: [Validators.required]},

      
      { name: "top_hospitals", type: "radio", col: 6, list$: this.getCityList$.bind(this), label: "Top Used Hospitals", startNewRow: true },
      { name: "hospitals", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Search Hospital", validators: [Validators.required] },
      { name: "employee", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Employee", optional:true, multiple: true, startNewRow: true },
      { name: "aggregator", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Aggregator", optional:true, multiple: false },
      { name: "doctor", type: "text", col: 2, label: "Doctor Name" },
      { name: "next", type: "button", col: 2, label: "Check Email Details", startNewRow: true, color: 'primary' }
    ]
  }]
  
  treatmentConfig = [
    { name: "treatment_name", type: "text", col: 2, label: "Treatment Name", validators: [Validators.required] },
    { name: "type_of_room", type: "text", col: 2, label: "Type of room", optional:true},
    { name: "min_cost", type: "text", col: 2, label: "Minimum Cost", validators: [Validators.required] },
    { name: "max_cost", type: "text", col: 2, label: "Maximum Cost", optional:true },
  ]

  addOpinion: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "hospitals", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Hospital", validators: [Validators.required] },
      { name: "doctor", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Doctor", validators: [Validators.required] },
      { name: "diagnosis", type: "textarea", col: 6, label: "Diagnosis", validators: [Validators.required]},
      { name: "treatment_plan", type: "textarea", col: 6, label: "Treatment Plan", validators: [Validators.required]},
      { name: "stay_in_country", type: "text", col: 3, label: "Stay in country" },
      { name: "country_duration", type: "text", col: 3, label: "Country Duration" },
      { name: "stay_in_hospital", type: "text", col: 3, label: "Stay in Hospital" },
      { name: "hospital_duration", type: "text", col: 3, label: "Hospital Duration" },
      { name: "min_initial_evaluation", type: "text", col: 3, label: "Minimum initial evaluation",suffixText:'USD'},
      { name: "max_initial_evaluation", type: "text", col: 3, label: "Maximum initial evaluation",suffixText:'USD' },
      { name: "treatment", type: "group", col: 6, label: "Treatment", startNewRow: true, groupConfig: this.treatmentConfig, btnColor:'#fff35a', btnName:'Add Treatment' },
    ]
  }]

  addVIL: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "hospitals", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Hospital", validators: [Validators.required] },
      { name: "vil_doc", type: "files", col: 6, label: "Upload Visa Invitation Letter", validators: [Validators.required]},
    ]
  }]
  addPI: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "hospitals", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Hospital", validators: [Validators.required] },
      { name: "pi_doc", type: "files", col: 6, label: "Upload Proforma Invoice", validators: [Validators.required]},
    ]
  }]

  addOPD: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "hospitals", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Hospital", validators: [Validators.required] },
      { name: "type_doctor", type: "text", col:2, label:"Type Doctor", validators:[Validators.required]},
      { name: "choose_date", type: "date-time", validators:[Validators.required], col: 2, label: "Choose Date", pickerType: 'both' },
      { name: "meeting_link", type: "text", col:2, label:"Meeting Link", optional:true},
      { name: "payment_link", type: "text", col:2, label:"Payment Link", optional:true },
    ]
  }]

  downloadOR: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "format", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Format", validators: [Validators.required] },
      { name: "language", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Language", validators: [Validators.required] },
      { name: "opinion_requests", type: "expansion", col: 6, list$: this.getCityList$.bind(this), label: "Select Language", validators: [Validators.required], startNewRow:true, expansionType:'checkbox'},
    ]
  }]

  downloadVIL: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "vil_files", type: "lightbox", col: 6, list$: this.getCityList$.bind(this)},
    ]
  }]

  downloadProforma: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "proforma_files", type: "lightbox", col: 6, list$: this.getCityList$.bind(this)},
    ]
  }]

  downloadTicket: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "ticket_copy", type: "lightbox", col: 6, list$: this.getCityList$.bind(this)},
    ]
  }]
    
  OrCC = [
    { name: "cc_email", type: "text", col: 3, label: "CC Email", optional:true },
  ]
  sendOR: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "email", type: "email", col: 2, label: "Email", validators: [Validators.required,Validators.email] },
      { name: "format", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Format", validators: [Validators.required] },
      { name: "language", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Language", validators: [Validators.required] },
      { name: "cc", type: "group", col: 6, label: "CC", startNewRow: true, groupConfig: this.OrCC, btnColor: '#7dd9f6', btnName:'Add CC' },
      { name: "opinion_requests", type: "expansion", col: 6, list$: this.getCityList$.bind(this), label: "Select Language", validators: [Validators.required], startNewRow:true, expansionType:'checkbox'},
    ]
  }]

  sendVIL: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "email", type: "email", col: 2, label: "Email", validators: [Validators.required,Validators.email] },
      { name: "cc", type: "group", col: 6, label: "CC", startNewRow: true, groupConfig: this.OrCC, btnColor: '#7dd9f6', btnName:'Add CC' },
      { name: "ticket_copy", type: "lightbox", col: 6, list$: this.getCityList$.bind(this)},
    ]
  }]

  sendProforma: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "email", type: "email", col: 2, label: "Email", validators: [Validators.required,Validators.email] },
      { name: "cc", type: "group", col: 6, label: "CC", startNewRow: true, groupConfig: this.OrCC, btnColor: '#7dd9f6', btnName:'Add CC' },
      { name: "ticket_copy", type: "lightbox", col: 6, list$: this.getCityList$.bind(this)},
    ]
  }]

  sendTicket: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "email", type: "email", col: 2, label: "Email", validators: [Validators.required,Validators.email] },
      { name: "cc", type: "group", col: 6, label: "CC", startNewRow: true, groupConfig: this.OrCC, btnColor: '#7dd9f6', btnName:'Add CC' },
      { name: "ticket_copy", type: "lightbox", col: 6, list$: this.getCityList$.bind(this)},
    ]
  }]

  sendOPD: DialogFormConfig[] = [{
    api: "test",
    title: this.data.title,
    cols: 6,
    rows: 6,
    crudType: 'dialog',
    fields: [
      { name: "email", type: "email", col: 2, label: "Email", validators: [Validators.required,Validators.email] },
      { name: "opinion_requests", type: "expansion", col: 6, list$: this.getCityList$.bind(this), label: "Select Language", validators: [Validators.required], startNewRow:true , expansionType:'radio',headerFields:'OPD'},
    ]
  }]

  queryDialog: DialogFormConfig[] = [{
      api: "query",
      title: 'Query',
      cols: 6,
      rows: 6,
      crudType: 'dialog',
      fields: [
        { name: "name", type: "text", col: 2, label: "Name", validators: [Validators.required]},
        { name: "email", type: "email", col: 2, optional: true, label: "Email", validators: [Validators.email], hint: "johnDoe@test.com"},
        { name: "gender", type: "radio", col: 2, optional: true, label: "Gender" },
        { name: "country", type: "custom-list", col:2, list$: this.getCityList$.bind(this), label: "Country", },
        { name: "age", type: "number", col:2, label: "Age", optional:true},
        { name: "age_duration", type: "custom-list", list$: this.getCityList$.bind(this), col:2, label: "Age Duration", optional:true},
        { name: "treatment", type: "custom-list", col:2, list$: this.getCityList$.bind(this), label: "Treatment"},
        { name: "passport_number", type: "text", col:2, label: "Passport Number", validators: [Validators.maxLength(12)]},
        { name: "referral_partner_id", type: "custom-list", col:2, list$: this.getCityList$.bind(this), label: "Referral Partner"},
        { name: "employee_id", type: "custom-list", col:2, list$: this.getCityList$.bind(this), label: "Employee"},
        { name: "medical_history", type: "textarea", col:6, label: "Medical History"},
        { name: "remark", type: "textarea", col:6, label: "Remarks"},
        { name: "patients_reports", type: "files", col:6, label: "Patients Reports", multiple:true},
      ],
    },
  ];

  ngOnInit(): void {
    this.mode = this.data?.data?.mode;
    this.radioGroup = this.querySVC.setDialogConfig(this.mode);
    if (this.mode === 'ADD_QUERY') {
      this.isRadio = false;
      this.dialogFormConfig = this?.queryDialog;
      this.queryDialog[0].mode = 'Create';
    }
    if (this.mode === 'Edit') {
      this.isRadio = false;
      this.dialogFormConfig = this?.queryDialog;
      this.queryDialog[0].mode = 'Edit';
    }
    if(this.mode === 'Assign') {
      this.selected = 'Opinion Request'; 
      this.dialogFormConfig = this?.assignOR;
    }
    if(this.mode === 'Add') {
      this.selected = 'Add Opinion'; 
      this.dialogFormConfig = this?.addOpinion;
    }
    if(this.mode === 'Download') {
      this.selected = 'Download Opinion Request'; 
      this.dialogFormConfig = this?.downloadOR;
    }
    if(this.mode === 'Send') {
      this.selected = 'Send Opinion'; 
      this.dialogFormConfig = this?.sendOR;
    }
  }
  onFormSubmit(data: any) { }
  onFormEvent(event: SMFormEventData) {
    // console.log(event);
  }
  getCityList$(data: any): Observable<SMFormListRow[]> {
    return this.svc.data.get("organizations").pipe(map((res: any) => res.data.map((d: any) => ({ value: d.id, text: d.org_name }))));
  }
  nextHandler(){};

  radioChangeHandler(e:any,val:any){
    switch (val.name) {
      case 'Opinion Request': this.dialogFormConfig = this?.assignOR;
        break;
      case 'Request VIL': this.dialogFormConfig = this?.assignVIL;
        break;
      case 'OPD Request': this.dialogFormConfig = this?.assignOPD;
        break;
      case 'Confirmation': this.dialogFormConfig = this?.assignConfirmation;
        break;
      case 'Pre Intimation': this.dialogFormConfig = this?.assignPreIntimation;
        break;
      case 'Proforma Invoice': this.dialogFormConfig = this?.assignPreIntimation;
        break;
      case 'Add Opinion': this.dialogFormConfig = this?.addOpinion;
        break;
      case 'Add VIL': this.dialogFormConfig = this?.addVIL;
        break;
      case 'Add OPD Request': this.dialogFormConfig = this?.addOPD;
        break;
      case 'Add Proforma Invoice': this.dialogFormConfig = this?.addPI;
        break;
      case 'Download Opinion Request': this.dialogFormConfig = this?.downloadOR;
        break;
      case 'Download VIL': this.dialogFormConfig = this?.downloadVIL;
        break;
      case 'Download Proforma Invoice': this.dialogFormConfig = this?.downloadProforma;
        break;
      case 'Download Ticket Copy': this.dialogFormConfig = this?.downloadTicket;
        break;
      case 'Send Opinion': this.dialogFormConfig = this?.sendOR;
        break;
      case 'Send VIL': this.dialogFormConfig = this?.sendVIL;
        break;
      case 'Send OPD': this.dialogFormConfig = this?.sendOPD;
        break;
      case 'Send Proforma Invoice': this.dialogFormConfig = this?.sendProforma;
        break;
      case 'Send Confirmation': this.dialogFormConfig = this?.sendTicket;
        break;
    }
  }
}