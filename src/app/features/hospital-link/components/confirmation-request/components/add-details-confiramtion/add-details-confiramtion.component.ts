import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FacilitatorService } from 'src/app/core/service/facilitator/facilitator.service';
import { SharedService } from 'src/app/core/service/shared/shared.service';

@Component({
  selector: 'app-add-details-confiramtion',
  templateUrl: './add-details-confiramtion.component.html',
  styleUrls: ['./add-details-confiramtion.component.scss']
})
export class AddDetailsConfiramtionComponent implements OnInit {
  @Input() requestData: any
  @Input() patientData: any
  @Output('refetch') refetch: EventEmitter<any> = new EventEmitter()


  constructor(private router: Router, private faciliatorService: FacilitatorService, private fb: FormBuilder, private sharedService: SharedService) { }

  ngOnInit(): void {
  }

  submit() {
    this.faciliatorService.patientConfirmationApprovedOpenLink().subscribe((res: any) => {
      this.refetch.emit()
      this.sharedService.showNotification(
        'snackBar-success',
        res.message,
      );
    })

  }

}
