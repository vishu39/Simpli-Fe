import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HospitalLinkRoutingModule } from "./hospital-link-routing.module";
import { AppLayoutModule } from "../app-layout/app-layout.module";
import { LoginComponent } from "./components/login/login.component";
import { OpdRequestComponent } from "./components/opd-request/opd-request.component";
import { SharedModule } from "src/app/shared/modules/shared.module";
import { AddDetailsOpdComponent } from "./components/opd-request/components/add-details-opd/add-details-opd.component";
import { RequestDetailsComponent } from "./components/request-details/request-details.component";
import { CompletePageComponent } from "./components/complete-page/complete-page.component";
import { VilRequestComponent } from "./components/vil-request/vil-request.component";
import { OpinionRequestComponent } from "./components/opinion-request/opinion-request.component";
import { ProformaRequestComponent } from "./components/proforma-request/proforma-request.component";
import { ConfirmationRequestComponent } from "./components/confirmation-request/confirmation-request.component";
import { AddDetailsVilComponent } from "./components/vil-request/components/add-details-vil/add-details-vil.component";
import { AddDetailsProformaComponent } from "./components/proforma-request/components/add-details-proforma/add-details-proforma.component";
import { AddDetailsOpinionComponent } from "./components/opinion-request/components/add-details-opinion/add-details-opinion.component";
import { AddDetailsConfiramtionComponent } from "./components/confirmation-request/components/add-details-confiramtion/add-details-confiramtion.component";
import { DoctorDetailsComponent } from "./components/doctor-details/doctor-details.component";
import { AddDoctorDetailsComponent } from "./components/doctor-details/components/add-doctor-details/add-doctor-details.component";
import { DoctorOpinionReceivedComponent } from "./components/doctor-details/components/doctor-opinion-received/doctor-opinion-received.component";
import { DoctorOpinionPendingComponent } from "./components/doctor-details/components/doctor-opinion-pending/doctor-opinion-pending.component";
import { SmCrudModule } from "src/app/smvt-framework/sm-crud/sm-crud.module";
import { OpinionRequestDetailsComponent } from "./components/opinion-request/components/opinion-request-details/opinion-request-details.component";
import { OpdRequestDetailsComponent } from "./components/opd-request/components/opd-request-details/opd-request-details.component";
import { ProformaRequestDetailsComponent } from "./components/proforma-request/components/proforma-request-details/proforma-request-details.component";
import { VilRequestDetailsComponent } from "./components/vil-request/components/vil-request-details/vil-request-details.component";
import { ConfirmationRequestDetailsComponent } from "./components/confirmation-request/components/confirmation-request-details/confirmation-request-details.component";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { VilVerificationComponent } from "./components/vil-verification/vil-verification.component";
import { TreatingDocRecoringComponent } from "./components/treating-doctor/treating-doc-recoring/treating-doc-recoring.component";
import { TreatingDocPendingOpinionComponent } from "./components/treating-doctor/treating-doc-pending-opinion/treating-doc-pending-opinion.component";
import { TreatingDocAddedOpinionComponent } from "./components/treating-doctor/treating-doc-added-opinion/treating-doc-added-opinion.component";
import { RecordOpinionComponent } from "./components/treating-doctor/record-opinion/record-opinion.component";

@NgModule({
  declarations: [
    LoginComponent,
    OpdRequestComponent,
    AddDetailsOpdComponent,
    RequestDetailsComponent,
    CompletePageComponent,
    VilRequestComponent,
    OpinionRequestComponent,
    ProformaRequestComponent,
    ConfirmationRequestComponent,
    AddDetailsVilComponent,
    AddDetailsProformaComponent,
    AddDetailsOpinionComponent,
    AddDetailsConfiramtionComponent,
    DoctorDetailsComponent,
    AddDoctorDetailsComponent,
    DoctorOpinionReceivedComponent,
    DoctorOpinionPendingComponent,
    OpinionRequestDetailsComponent,
    OpdRequestDetailsComponent,
    ProformaRequestDetailsComponent,
    VilRequestDetailsComponent,
    ConfirmationRequestDetailsComponent,
    VilVerificationComponent,
    TreatingDocRecoringComponent,
    TreatingDocPendingOpinionComponent,
    TreatingDocAddedOpinionComponent,
    RecordOpinionComponent,
  ],
  imports: [
    CommonModule,
    HospitalLinkRoutingModule,
    AppLayoutModule,
    SharedModule,
    SmCrudModule,
    ComponentsModule,
  ],
})
export class HospitalLinkModule {}
