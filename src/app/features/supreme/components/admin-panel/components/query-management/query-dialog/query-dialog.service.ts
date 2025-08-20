import { Injectable } from '@angular/core';
import { GenericServiceBase } from 'src/app/smvt-framework/base-class/generic-service-base';
import { CommonService } from 'src/app/smvt-framework/services/common.service';

@Injectable({providedIn:'platform'})
export class QueryDialogService extends GenericServiceBase {
  constructor(public svc:CommonService) {
    super(svc);

  }
  
  addRadioGroup = [
    { name: 'Add Opinion' },
    { name: 'Add VIL' },
    { name: 'Add OPD Request' },
    { name: 'Add Proforma Invoice' }
  ]
  assignRadioGroup = [
    { name: 'Pre Intimation' },
    { name: 'OPD Request' },
    { name: 'Proforma Invoice' },
    { name: 'Opinion Request' },
    { name: 'Request VIL' },
    { name: 'Confirmation' },
  ]
  downloadRadioGroup = [
    { name: 'Download Opinion Request'},
    { name: 'Download VIL'},
    { name: 'Download Ticket Copy' },
    { name: 'Download Proforma Invoice' },
  ]
  sendRadioGroup = [
    { name: 'Send Opinion' },
    { name: 'Send VIL' },
    { name: 'Send OPD' },
    { name: 'Send Proforma Invoice' },
    { name: 'Send Confirmation' },
  ]

  setDialogConfig(mode: string) {
    let result
    switch (mode) {
      case 'Add':
        result = this.addRadioGroup;
        break;
      case 'Assign':
        result = this.assignRadioGroup
        break;
      case 'Download':
        result = this.downloadRadioGroup
        break;
      case 'Send':
        result = this.sendRadioGroup
        break;
    }
    return result
  }
}