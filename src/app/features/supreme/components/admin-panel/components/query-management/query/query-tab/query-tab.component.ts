import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DialogFormConfig, SMFormEventData, SMFormListRow } from 'src/app/smvt-framework/interfaces/sm-framework-defaults';
import { CommonService } from 'src/app/smvt-framework/services/common.service';
import { QueryService } from '../query.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-query-tab',
  templateUrl: './query-tab.component.html',
  styleUrls: ['./query-tab.component.scss']
})
export class QueryTabComponent implements OnInit , OnChanges{

  tabs:any[] = this.querySvc.tabs;
  queryButtons: any[] = this.querySvc.queryButtons;
  dialogFormConfig:DialogFormConfig[];
  currentTab: string;

  @Input('tabName') tabName:string;

  constructor(
    private svc : CommonService,
    public querySvc:QueryService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matRef:MatDialogRef<QueryTabComponent>,
  ) { }

  ngOnInit(): void {};
  ngOnChanges(changes: SimpleChanges): void {
    this.currentTab = changes.tabName.currentValue;
    // console.log(this.currentTab);
    switch (this.currentTab) {
      case 'Reports': this.dialogFormConfig = this.Reports
        break;
      case 'Opinion Received': this.dialogFormConfig = this.OpinionReceived
        break;
      case 'Opinion Pending': this.dialogFormConfig = this.opinionsPending
        break;
      case 'Requested For VIL': this.dialogFormConfig = this.requestVIL
        break;
      case 'VIL Response': this.dialogFormConfig = this.vilResponse
        break;
      case 'Patient Confirmed': this.dialogFormConfig = this.patientConfirmation
        break;
      case 'Intimation Sent': this.dialogFormConfig = this.intimationSent
        break;
      case 'PI Requested': this.dialogFormConfig = this.PIRequest
        break;
      case 'PI Response': this.dialogFormConfig = this.PIResponse
        break;
      case 'OPD Requested': this.dialogFormConfig = this.OPDRequested
        break;
      case 'OPD Received': this.dialogFormConfig = this.OPDReceived
        break;
    }
  }
  isFormTab(){
    return (
      this.currentTab === 'Reports' ||
      this.currentTab === 'Opinion Received' ||
      this.currentTab === 'Opinion Pending' || 
      this.currentTab === 'Requested For VIL' || 
      this.currentTab === 'VIL Response' || 
      this.currentTab === 'Patient Confirmed' || 
      this.currentTab === 'Intimation Sent' || 
      this.currentTab === 'PI Requested' || 
      this.currentTab === 'PI Response' || 
      this.currentTab === 'OPD Requested' ||
      this.currentTab === 'OPD Received'  
    )
  }
  Reports : DialogFormConfig[] = [
    {
      api: "test",
      title:'Patient List',
      crudType:'page',
      cols: 4,
      rows: 5,
      fields: [
       { name: "reports", type: "lightbox", col: 6, list$: this.getCityList$.bind(this)},
      ],
    },
  ];
  OpinionReceived : DialogFormConfig[] = [
    {
      api: "test",
      title:'Patient List',
      crudType:'page',
      cols: 4,
      rows: 5,
      fields: [
       { name: "reports", type: "expansion", col: 6, list$: this.getCityList$.bind(this), expansionType:'none',edit:true},
      ],
    },
  ];
  opinionsPending : DialogFormConfig[] = [
    {
      api: "test",
      title:'Patient List',
      crudType:'page',
      cols: 4,
      rows: 5,
      fields: [
        { name: "button", type: "button", col: 2, label: "Test", color: 'warn' }
      ],
    },
  ];
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
  requestVIL : DialogFormConfig[] = [
    {
      api: "test",
      title:'Patient List',
      crudType:'page',
      cols: 6,
      rows: 5,
      fields: [
        { name: "button", type: "button", col: 6, label:'test', color:'warn'},

        { name: "patient_name", type: "text", col: 3, label: "Patient Name (As Per Passport)", placeholder: "Patient Name As Per Passport", validators: [Validators.required], startNewRow:true },
        { name: "passport_number", type: "text", col: 3, label: "Passport Number", validators: [Validators.required, Validators.maxLength(12)] },
        { name: "passport", type: "files", col: 6, optional: false, label: "Upload Patients Passport", validators: [Validators.required], startNewRow: true, multiple: true },
        { name: "attendants", type: "group", col: 6, label: "Attendant", startNewRow: true, groupConfig: this.attendantsConfig, btnColor: '#fff35a', btnName:'Add Attendant' },
        { name: "donors", type: "group", col: 6, label: "Donor", startNewRow: true, groupConfig: this.donorsConfig, btnColor: '#7dd9f6', btnName:'Add Donor' },
        { name: "appointment_date", type: "date-time", optional: true, col: 3, label: "Date of appointment", pickerType: 'both' },
        { name: "doctor_name", type: "text", col: 3, label: "Doctor Name", optional:true },
        { name: "embassy", type: "custom-list", col: 3, list$: this.getCityList$.bind(this), label: "Select Embassy", optional:true},
        { name: '', type:'label-only',label:'OR', startNewRow:true},
        { name: "embassy_details", type: "group", col: 6, label: "Embassy Address", startNewRow: true, groupConfig: this.embassyConfig, btnColor: '#7fd2f6', btnName:'Add Embassy Address' },
      ],
    },
  ];
  vilResponse : DialogFormConfig[] = [
    {
      api: "test",
      title:'Patient List',
      crudType:'page',
      cols: 4,
      rows: 5,
      fields: [
        { name: "button", type: "lightbox", col: 6 ,list$: this.getCityList$.bind(this),},
      ],
    },
  ];
  patientConfirmation : DialogFormConfig[] = [
    {
      api: "test",
      title:'Patient List',
      crudType:'page',
      cols: 6,
      rows: 5,
      fields: [
        { name: "button", type: "lightbox", col: 6, list$: this.getCityList$.bind(this) },
        { name: "patient_details", type: 'label-only', label: 'Patient Details' },
        { name: "patient_name", type: "text", col: 2, label: "Patient Name", disabled: true, startNewRow: true },
        { name: "treatment", type: "text", col: 2, label: "Treatment", disabled: true },
        { name: "country", type: "text", col: 2, label: "Country", disabled: true },
        { name: "hospital", type: "custom-list", col: 2, list$: this.getCityList$.bind(this), label: "Select Hospital", multiple: false, validators: [Validators.required] },
        { name: "cabs", type: "number", col: 2, label: "No. of cabs required", optional: true, validators: [Validators.max(100)] },
        { name: "flight_details", type: 'label-only', label: 'Flight Details', startNewRow: true },
        { name: "flight_name", type: "text", col: 2, label: "Flight Name", optional: true, startNewRow: true },
        { name: "flight_no", type: "text", col: 2, label: "Flight No.", optional: true },
        { name: "arrival_date", type: "date-time", col: 2, label: "Arrival Date And Time", validators: [Validators.required], pickerType: 'both' },
        { name: "contact_person", type: "text", col: 2, label: "Contact Person", optional: true },
        { name: "contact_person_number", type: "number", col: 2, label: "Contact Person Number", optional: true },
        { name: "coordinator_address", type: "text", col: 2, label: "Contact Person", optional: true },
        { name: "coordinator_pickup_time", type: "date-time", col: 2, label: "Coordinator Pickup Date And Time", optional: true, pickerType: 'both' },
        { name: "ticket", type: "files", col: 6, label: "Upload Ticket", validators: [Validators.required] },
        { name: "remark", type: "textarea", col: 6, label: "Remarks", validators: [Validators.required] },
      ],
    },
  ];
  intimationSent : DialogFormConfig[] = [
    {
      api: "test",
      title:'Patient List',
      crudType:'page',
      cols: 4,
      rows: 5,
      fields: [
        { name: "button", type: "button", col: 6 , label:'test' , color:'warn'},
      ],
    },
  ];
  PIRequest : DialogFormConfig[] = [
    {
      api: "test",
      title:'Patient List',
      crudType:'page',
      cols: 4,
      rows: 5,
      fields: [
        { name: "button", type: "button", col: 6 , label:'test' , color:'warn'},
      ],
    },
  ];
  OPDRequested : DialogFormConfig[] = [
    {
      api: "test",
      title:'Patient List',
      crudType:'page',
      cols: 4,
      rows: 5,
      fields: [
        { name: "button", type: "button", col: 6 , label:'test' , color:'warn'},
      ],
    },
  ];
  PIResponse : DialogFormConfig[] = [
    {
      api: "test",
      title:'Patient List',
      crudType:'page',
      cols: 4,
      rows: 5,
      fields: [
        { name: "button", type: "lightbox", col: 6 ,list$: this.getCityList$.bind(this),},
      ],
    },
  ];
  OPDReceived : DialogFormConfig[] = [
    {
      api: "test",
      title:'Patient List',
      crudType:'page',
      cols: 4,
      rows: 5,
      fields: [
       { name: "reports", type: "expansion", col: 6, list$: this.getCityList$.bind(this), expansionType:'none'},
      ],
    },
  ];

  onFormSubmit(data: any) {}
  setMode() {}
  onFormEvent(event: SMFormEventData) {}
  getCityList$(data: any): Observable<SMFormListRow[]> {
    return this.svc.data.get("organizations").pipe(map((res: any) => res.data.map((d: any) => ({ value: d.id, text: d.org_name }))));
  }
}