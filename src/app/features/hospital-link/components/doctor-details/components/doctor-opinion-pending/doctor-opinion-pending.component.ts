import { Component, Input, OnInit } from '@angular/core';
import { FacilitatorService } from 'src/app/core/service/facilitator/facilitator.service';
import { SharedService } from 'src/app/core/service/shared/shared.service';

@Component({
  selector: 'app-doctor-opinion-pending',
  templateUrl: './doctor-opinion-pending.component.html',
  styleUrls: ['./doctor-opinion-pending.component.scss']
})
export class DoctorOpinionPendingComponent implements OnInit {
  @Input() patientData: any
  allPendingOpinionRequest = []

  constructor(private faciliatorService: FacilitatorService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.getDoctorOpinionRequestByDoctorOpenLink()
  }

  getDoctorOpinionRequestByDoctorOpenLink() {
    this.faciliatorService.getDoctorOpinionRequestByDoctorOpenLink().subscribe((res: any) => {
      if(res?.data?.opinionRequest){
        this.allPendingOpinionRequest = [res?.data?.opinionRequest]
      }
      else{
        this.allPendingOpinionRequest = []

      }
    })
  }
}
