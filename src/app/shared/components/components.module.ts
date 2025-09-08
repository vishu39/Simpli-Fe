import { NgModule } from "@angular/core";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { SharedModule } from "../modules/shared.module";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { NgxEchartsModule } from "ngx-echarts";
import { ChartsModule as chartjsModule } from "ng2-charts";
import { NgApexchartsModule } from "ng-apexcharts";
import { GlobalImagePreviewerComponent } from "./global-image-previewer/global-image-previewer.component";
import { SmCrudModule } from "src/app/smvt-framework/sm-crud/sm-crud.module";
import { DoctorListComponent } from "./doctor/doctor.component";
import { HospitalComponent } from "./hospital/hospital.component";
import { ChangePasswordComponent } from "./account/change-password/change-password.component";
import { UserProfileComponent } from "./account/user-profile/user-profile.component";
import { HospitalProfileComponent } from "./hospital/components/hospital-profile/hospital-profile.component";
import { DoctorProfileComponent } from "./doctor/components/doctor-profile/doctor-profile.component";
import { EmailSettingComponent } from "./account/email-setting/email-setting.component";
import { AccountDetailsComponent } from "./account/account-details/account-details.component";
import { HospitalStaffComponent } from "./hospital-staff/hospital-staff.component";
import { HospitalStaffDialogComponent } from "./hospital-staff/dialog/hospital-staff-dialog/hospital-staff-dialog.component";
import { HospitalEmailZoneComponent } from "./account/hospital-email-zone/hospital-email-zone.component";
import { ZoneComponent } from "./account/hospital-email-zone/components/zone/zone.component";
import { EmployeeComponent } from "./account/hospital-email-zone/components/employee/employee.component";
import { DefaultEmailComponent } from "./account/hospital-email-zone/components/default-email/default-email.component";
import { DoctorComponent } from "./account/hospital-email-zone/components/doctor/doctor.component";
import { CommonModule } from "@angular/common";
import { ZoneDialogComponent } from "./account/hospital-email-zone/components/zone/dialog/zone-dialog/zone-dialog.component";
import { AddDoctorDialogComponent } from "./doctor/dialog/add-doctor-dialog/add-doctor-dialog.component";
import { AddHospitalDialogComponent } from "./hospital/dialog/add-hospital-dialog/add-hospital-dialog.component";
import { TemplateSettingComponent } from "./account/template-setting/template-setting.component";
import { QueryManagementToolbarComponent } from "./query-management/component/query-management-toolbar/query-management-toolbar.component";
import { PatentListComponent } from "./query-management/component/patent-list/patent-list.component";
import { TopHospitalComponent } from "./account/top-hospital/top-hospital.component";
import { DetailedLightboxComponent } from "./detailed-lightbox/detailed-lightbox.component";
import { DetailedImagePreviewerComponent } from "./detailed-image-previewer/detailed-image-previewer.component";
import { SharedTimlimeComponent } from "./shared-timlime/shared-timlime.component";
import { DownloadDoctorProfileModalComponent } from "./dialogs/download-doctor-profile-modal/download-doctor-profile-modal.component";
import { EmailFetchFilterModalComponent } from "./dialogs/email-fetch/email-fetch-filter-modal/email-fetch-filter-modal.component";
import { QueryManagementFilterDialogComponent } from "./query-management/component/query-management-filter-dialog/query-management-filter-dialog.component";
import { DoctorListFilterModalComponent } from "./dialogs/doctor-list-filter-modal/doctor-list-filter-modal.component";
import { InternalUserFilterModalComponent } from "./dialogs/internal-user-filter-modal/internal-user-filter-modal.component";
import { IssuedVilFilterModalComponent } from "./dialogs/issued-vil-filter-modal/issued-vil-filter-modal.component";
import { SentVilHistoryFilterComponent } from "./dialogs/sent-vil-history-filter/sent-vil-history-filter.component";
import { PatientFilterModalComponent } from "./dialogs/patient-filter-modal/patient-filter-modal.component";
import { HospitalFilterModalComponent } from "./dialogs/hospital-filter-modal/hospital-filter-modal.component";
import { AcknowledgementModalComponent } from "./dialogs/acknowledgement-modal/acknowledgement-modal.component";
import { FollowupModalComponent } from "./dialogs/followup-modal/followup-modal.component";
import { NgxMatIntlTelInputComponent } from "ngx-mat-intl-tel-input";
import { DefaultMessageComponent } from "./account/hospital-email-zone/components/default-message/default-message.component";
import { MessageFetchImagePreviewerComponent } from "./previewers/message-fetch-image-previewer/message-fetch-image-previewer.component";
import { MessageFetchLightBoxComponent } from "./light-box/message-fetch-light-box/message-fetch-light-box.component";
import { CommonSelectedWhatsappMessageComponent } from "./message-fetch/common-selected-whatsapp-message/common-selected-whatsapp-message.component";
import { SharedMessageFetchChoosePatientComponent } from "./message-fetch/shared-message-fetch-choose-patient/shared-message-fetch-choose-patient.component";
import { WhatsappFetchImagePreviewerComponent } from "./message-fetch/whatsapp-fetch-image-previewer/whatsapp-fetch-image-previewer.component";
import { WhatsappFetchImageLightboxComponent } from "./message-fetch/whatsapp-fetch-image-lightbox/whatsapp-fetch-image-lightbox.component";
import { DownloadFollowUpComponent } from "./dialogs/download-follow-up/download-follow-up.component";
import { QueryManagementCheckDetailsComponent } from "./query-management/component/query-management-check-details/query-management-check-details.component";
import { QueryManagementEmailDetailsComponent } from "./query-management/component/query-management-email-details/query-management-email-details.component";
import { PotentialTreatmentModalComponent } from "./dialogs/potential-treatment-modal/potential-treatment-modal.component";
import { FinanceModulePatientListComponent } from "./finance-module/finance-module-patient-list/finance-module-patient-list.component";
import { FinanceModuleToolbarComponent } from "./finance-module/finance-module-toolbar/finance-module-toolbar.component";
import { MasterSettingHospitalFilterDialogComponent } from "./finance-module/dialogs/master-setting-hospital-filter-dialog/master-setting-hospital-filter-dialog.component";
import { MasterSettingCompanyFilterDialogComponent } from "./finance-module/dialogs/master-setting-company-filter-dialog/master-setting-company-filter-dialog.component";
import { MasterSettingPartnerFilterDialogComponent } from "./finance-module/dialogs/master-setting-partner-filter-dialog/master-setting-partner-filter-dialog.component";

const COMPONENT = [
  FileUploadComponent,
  BreadcrumbComponent,
  GlobalImagePreviewerComponent,
  DoctorListComponent,
  DoctorProfileComponent,
  HospitalComponent,
  HospitalProfileComponent,
  ChangePasswordComponent,
  UserProfileComponent,
  EmailSettingComponent,
  AccountDetailsComponent,
  HospitalStaffComponent,
  HospitalStaffDialogComponent,
  HospitalEmailZoneComponent,
  ZoneComponent,
  EmployeeComponent,
  DefaultEmailComponent,
  DoctorComponent,
  ZoneDialogComponent,
  TemplateSettingComponent,
  QueryManagementToolbarComponent,
  PatentListComponent,
  TopHospitalComponent,
  DetailedImagePreviewerComponent,
  DetailedLightboxComponent,
  SharedTimlimeComponent,
  DownloadDoctorProfileModalComponent,
  EmailFetchFilterModalComponent,
  QueryManagementFilterDialogComponent,
  DoctorListFilterModalComponent,
  InternalUserFilterModalComponent,
  IssuedVilFilterModalComponent,
  SentVilHistoryFilterComponent,
  PatientFilterModalComponent,
  HospitalFilterModalComponent,
  AcknowledgementModalComponent,
  FollowupModalComponent,
  DefaultMessageComponent,
  MessageFetchImagePreviewerComponent,
  CommonSelectedWhatsappMessageComponent,
  SharedMessageFetchChoosePatientComponent,
  WhatsappFetchImagePreviewerComponent,
  WhatsappFetchImageLightboxComponent,
  DownloadFollowUpComponent,
  QueryManagementCheckDetailsComponent,
  QueryManagementEmailDetailsComponent,
  PotentialTreatmentModalComponent,
  AddDoctorDialogComponent,
  AddHospitalDialogComponent,
  MessageFetchLightBoxComponent,
  FinanceModulePatientListComponent,
  FinanceModuleToolbarComponent,
  MasterSettingHospitalFilterDialogComponent,
  MasterSettingCompanyFilterDialogComponent,
  MasterSettingPartnerFilterDialogComponent,
];

@NgModule({
  declarations: [...COMPONENT],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    MatInputModule,
    NgxEchartsModule.forRoot({
      echarts: () => import("echarts"),
    }),
    chartjsModule,
    NgApexchartsModule,
    SmCrudModule,
    NgxMatIntlTelInputComponent,
  ],
  exports: [...COMPONENT],
})
export class ComponentsModule {}
