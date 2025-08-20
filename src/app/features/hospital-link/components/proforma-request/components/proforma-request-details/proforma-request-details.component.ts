import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-proforma-request-details',
  templateUrl: './proforma-request-details.component.html',
  styleUrls: ['./proforma-request-details.component.scss']
})
export class ProformaRequestDetailsComponent implements OnInit {
  @Input() requestData:any
  @Input() patientData:any
  request=[]
  
    constructor() { 
    }
    
    ngOnInit(): void {
      this.request=[this.requestData]
    }
  
}
