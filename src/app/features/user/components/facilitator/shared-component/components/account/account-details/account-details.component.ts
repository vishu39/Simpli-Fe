import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { regexService } from "src/app/core/service/regex";

@Component({
  selector: "shared-account-details",
  templateUrl: "./account-details.component.html",
  styleUrls: ["./account-details.component.scss"],
})
export class AccountDetailsComponent implements OnInit {
  accountDetailsForm: FormGroup;
  accountDetailsData: any = null;
  address: FormArray;
  gstCertificate: File;
  registrationCertificate: File;
  brandLogo: File;
  brandLogoSymbol: File;
  isLoading: Boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private facilitatorService: FacilitatorService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.buildForm();
    this.getAccountDetails();
  }
  buildForm() {
    this.accountDetailsForm = this.formBuilder.group({
      brandName: ["", [Validators.required]],
      gstNo: ["", [Validators.required]],
      gstCertificate: ["", [Validators.required]],
      registrationCertificate: ["", [Validators.required]],
      brandLogo: ["", [Validators.required]],
      brandLogoSymbol: ["", [Validators.required]],
      registrationNo: ["", [Validators.required]],
      brandEmail: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(regexService.emailRegex),
        ],
      ],
      uhidCode: ["", [Validators.required]],
      address: this.formBuilder.array([this.createAddress()]),
    });
  }
  getAccountDetails() {
    this.isLoading = true;
    this.facilitatorService.getAccountDetails().subscribe(
      (res: any) => {
        this.accountDetailsData = res.data;
        this.isLoading = false;
        // console.log('this.accountDetailsData', this.accountDetailsData)
        if (this.accountDetailsData) {
          this.address = this.accountDetailsForm.get("address") as FormArray;
          this.address.controls = [];
          for (let i = 0; i < this.accountDetailsData.address.length; i++) {
            this.addAddress();
          }
          this.accountDetailsForm.patchValue({
            brandName: this.accountDetailsData.brandName,
            gstNo: this.accountDetailsData.gstNo,
            registrationNo: this.accountDetailsData.registrationNo,
            brandEmail: this.accountDetailsData.brandEmail,
            uhidCode: this.accountDetailsData.uhidCode,
            address: this.accountDetailsData.address,
          });

          this.accountDetailsForm.controls["gstCertificate"].clearValidators();
          this.accountDetailsForm.controls[
            "gstCertificate"
          ].updateValueAndValidity();
          this.accountDetailsForm.controls[
            "registrationCertificate"
          ].clearValidators();
          this.accountDetailsForm.controls[
            "registrationCertificate"
          ].updateValueAndValidity();
          this.accountDetailsForm.controls["brandLogo"].clearValidators();
          this.accountDetailsForm.controls[
            "brandLogo"
          ].updateValueAndValidity();
          this.accountDetailsForm.controls["brandLogoSymbol"].clearValidators();
          this.accountDetailsForm.controls[
            "brandLogoSymbol"
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
    this.address = this.accountDetailsForm.get("address") as FormArray;
    this.address.push(this.createAddress());
  }
  removeAddress(i: number) {
    if (i > 0) {
      this.address.removeAt(i);
    }
  }
  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  fileFirstList: any[] = [];
  fileSecondList: any[] = [];
  fileThirdList: any[] = [];
  fileFourthList: any[] = [];

  fileFirstPreviewUrls: string[] = [];
  fileSecondPreviewUrls: string[] = [];
  fileThirdPreviewUrls: string[] = [];
  fileFourthPreviewUrls: string[] = [];
  onFileSelected(e: any, type: string) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.pdf|\.png)$/i;
    const file = e.target.files[0];
    if (allowedExtensions.exec(file.name)) {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        if (type === "first") {
          this.fileFirstPreviewUrls = [fileUrl];
        }
        if (type === "second") {
          this.fileSecondPreviewUrls = [fileUrl];
        }
        if (type === "third") {
          this.fileThirdPreviewUrls = [fileUrl];
        }
        if (type === "fourth") {
          this.fileFourthPreviewUrls = [fileUrl];
        }
        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (type === "first") {
            this.fileFirstPreviewUrls = [reader.result as string];
          }
          if (type === "second") {
            this.fileSecondPreviewUrls = [reader.result as string];
          }
          if (type === "third") {
            this.fileThirdPreviewUrls = [reader.result as string];
          }
          if (type === "fourth") {
            this.fileFourthPreviewUrls = [reader.result as string];
          }
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }

    if (type === "first") {
      this.fileFirstList = [file];
    }
    if (type === "second") {
      this.fileSecondList = [file];
    }
    if (type === "third") {
      this.fileThirdList = [file];
    }
    if (type === "fourth") {
      this.fileFourthList = [file];
    }
  }

  formSubmit() {
    // console.log('this.accountDetailsForm', this.accountDetailsForm.value)
    if (this.accountDetailsForm.valid) {
      const formData = new FormData();
      formData.append("brandName", this.accountDetailsForm.value.brandName);
      formData.append("gstNo", this.accountDetailsForm.value.gstNo);
      formData.append(
        "fileFirst",
        this.accountDetailsForm.value.gstCertificate?._files?.[0]
      );
      formData.append(
        "fileSecond",
        this.accountDetailsForm.value.registrationCertificate?._files?.[0]
      );
      formData.append(
        "fileThird",
        this.accountDetailsForm.value.brandLogo?._files?.[0]
      );
      formData.append(
        "fileFourth",
        this.accountDetailsForm.value.brandLogoSymbol?._files?.[0]
      );

      formData.append(
        "registrationNo",
        this.accountDetailsForm.value.registrationNo
      );
      formData.append("brandEmail", this.accountDetailsForm.value.brandEmail);
      formData.append("uhidCode", this.accountDetailsForm.value.uhidCode);
      formData.append(
        "address",
        JSON.stringify(this.accountDetailsForm.value.address)
      );

      if (!this.accountDetailsData) {
        this.facilitatorService
          .addAccountDetails(formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            location.reload();
          });
      } else {
        this.facilitatorService
          .editAccountDetails(formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            location.reload();
          });
      }
    } else {
      Object.keys(this.accountDetailsForm.controls).forEach((key) => {
        this.accountDetailsForm.controls[key].markAsTouched();
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
