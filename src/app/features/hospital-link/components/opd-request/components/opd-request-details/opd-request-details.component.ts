import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-opd-request-details',
  templateUrl: './opd-request-details.component.html',
  styleUrls: ['./opd-request-details.component.scss']
})
export class OpdRequestDetailsComponent implements OnInit {
  @Input() requestData:any
  @Input() patientData:any
  request=[]
  
    constructor() { 
    }
    
    ngOnInit(): void {
      this.request=[this.requestData]
    }
}
