import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-opinion-request-details',
  templateUrl: './opinion-request-details.component.html',
  styleUrls: ['./opinion-request-details.component.scss']
})
export class OpinionRequestDetailsComponent implements OnInit {
@Input() requestData:any
@Input() patientData:any
request=[]

  constructor() { 
  }
  
  ngOnInit(): void {
    this.request=[this.requestData]
    // console.log(this.requestData);
  }

}
