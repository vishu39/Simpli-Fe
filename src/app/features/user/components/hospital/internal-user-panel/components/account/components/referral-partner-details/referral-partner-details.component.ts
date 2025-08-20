import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-referral-partner-details",
  templateUrl: "./referral-partner-details.component.html",
  styleUrls: ["./referral-partner-details.component.scss"],
})
export class ReferralPartnerDetailsComponent implements OnInit {
  referralPartnerDetailsForm: FormGroup;
  referralPartnerDetailsData: any = null;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;

  address: FormArray;
  logo: File;
  isLoading: Boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.buildForm();
    this.getReferralPartnerDetails();
  }
  buildForm() {
    this.referralPartnerDetailsForm = this.formBuilder.group({
      logo: ["", [Validators.required]],
      address: this.formBuilder.array([this.createAddress()]),
    });
  }
  getReferralPartnerDetails() {
    this.isLoading = true;
    this.facilitatorService.getReferralPartnerDetails().subscribe(
      (res: any) => {
        this.referralPartnerDetailsData = res.data;
        this.isLoading = false;
        // console.log('this.referralPartnerDetailsData', this.referralPartnerDetailsData)
        if (this.referralPartnerDetailsData) {
          this.address = this.referralPartnerDetailsForm.get(
            "address"
          ) as FormArray;
          this.address.controls = [];
          for (
            let i = 0;
            i < this.referralPartnerDetailsData.address.length;
            i++
          ) {
            this.addAddress();
          }
          this.referralPartnerDetailsForm.patchValue({
            address: this.referralPartnerDetailsData.address,
          });

          this.referralPartnerDetailsForm.controls["logo"].clearValidators();
          this.referralPartnerDetailsForm.controls[
            "logo"
          ].updateValueAndValidity();
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }

  createAddress(): FormGroup {
    return this.formBuilder.group({
      id: this.address?.length + 1 ? this.address?.length + 1 : 1,
      line: ["", [Validators.required]],
    });
  }
  addAddress(): void {
    this.address = this.referralPartnerDetailsForm.get("address") as FormArray;
    this.address.push(this.createAddress());
  }
  removeAddress(i: number) {
    if (i > 0) {
      this.address.removeAt(i);
    }
  }

  fileList: any[] = [];
  filePreviewUrls: string[] = [];
  onFileSelected(e: any) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.pdf|\.png)$/i;
    const file = e.target.files[0];
    if (allowedExtensions.exec(file.name)) {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        this.filePreviewUrls = [fileUrl];
        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.filePreviewUrls = [reader.result as string];
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
    this.fileList = [file];
  }

  formSubmit() {
    // console.log('this.referralPartnerDetailsForm', this.referralPartnerDetailsForm.value)
    if (this.referralPartnerDetailsForm.valid) {
      const formData = new FormData();
      formData.append(
        "file",
        this.referralPartnerDetailsForm.value.logo?._files?.[0]
      );
      formData.append(
        "address",
        JSON.stringify(this.referralPartnerDetailsForm.value.address)
      );
      if (!this.referralPartnerDetailsData) {
        this.facilitatorService
          .addReferralPartnerDetails(formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.formDirective.resetForm(); // Reset the ugly validators
            this.fileList = [];
            this.filePreviewUrls = [];
            this.getReferralPartnerDetails();
          });
      } else {
        this.facilitatorService
          .editReferralPartnerDetails(formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.formDirective.resetForm(); // Reset the ugly validators
            this.fileList = [];
            this.filePreviewUrls = [];
            this.getReferralPartnerDetails();
          });
      }
    } else {
      Object.keys(this.referralPartnerDetailsForm.controls).forEach((key) => {
        this.referralPartnerDetailsForm.controls[key].markAsTouched();
      });
    }
  }
  fetchFile(key) {
    const data = {
      key: key,
    };
    this.sharedService.getS3Object(data).subscribe((res: any) => {
      window.open(res.data);
    });
  }
}
