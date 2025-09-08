import { Component, Input, OnInit } from "@angular/core";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "global-shared-finance-billing-view-final-bills",
  templateUrl: "./finance-billing-view-final-bills.component.html",
  styleUrls: ["./finance-billing-view-final-bills.component.scss"],
})
export class FinanceBillingViewFinalBillsComponent implements OnInit {
  @Input() patientData: any = {};
   panelOpenState: any;
   constructor(private facilitatorService: FacilitatorService) {}
 
   ngOnInit(): void {
     this.getAllFinalBillForFinanceBilling();
   }
 
   docsParams: any = {
     page: 1,
     limit: 0,
     search: "",
   };
   isDocsLoading: boolean = false;
   docsData = [];
   getAllFinalBillForFinanceBilling() {
     this.isDocsLoading = true;
     this.facilitatorService
       .getAllFinalBillForFinanceBilling(this.docsParams, this.patientData?._id)
       .subscribe(
         (res: any) => {
           this.docsData = res?.data?.content;
           this.docsData?.map((data:any)=>{
             data.finalBill=[]
             data.dischargeSummary=[]
           })
           this.isDocsLoading = false;
         },
         () => {
           this.isDocsLoading = false;
         }
       );
   }
 
   onClickAccordian(item: any, i:any) {
     this.selectedHospital = item;
     this.getFinalBillForFinanceBillingById(i);
   }
 
   selectedHospital: any = "";
   getFinalBillForFinanceBillingById(i:any) {
     this.facilitatorService
       .getFinalBillForFinanceBillingById(this.patientData?._id, {
         hospitalId: this.selectedHospital?.hospitalId,
       })
       .subscribe((res: any) => {                
         this.docsData[i].finalBill= res?.data[0]?.finalBill
         this.docsData[i].dischargeSummary= res?.data[0]?.dischargeSummary
       });
   }
}
