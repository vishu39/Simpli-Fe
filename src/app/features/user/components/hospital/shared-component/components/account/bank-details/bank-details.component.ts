import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "shared-bank-details",
  templateUrl: "./bank-details.component.html",
  styleUrls: ["./bank-details.component.scss"],
})
export class BankDetailsComponent implements OnInit {
  bankDetailsForm: FormGroup;
  isEdit: boolean = false;
  isLoading: boolean = true;
  bankDetailsData: any = [];
  bankAccountTypeData = [];

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getBankDetails();
    this.getBankAccountType();
  }

  getBankDetails() {
    this.isLoading = true;
    this.hospitalService.getBankDetails().subscribe((res: any) => {
      if (res?.data.length) {
        this.bankDetailsData = res?.data[0];
        this.isEdit = true;
        this.isLoading = false;
        this.bankDetailsForm = this.fb.group({
          bankAccount: this.fb.array([this.bankDetailsFormObj()]),
        });
        this.patchBankDetailsForm();
      } else {
        const itemGroup = this.bankAccountArray.at(0);
        itemGroup.patchValue({
          default: true,
        });
        this.isEdit = false;

        this.isLoading = false;
      }
    });
  }

  getBankAccountType() {
    this.sharedService.getBankAccountType().subscribe((res: any) => {
      this.bankAccountTypeData = res?.data;
    });
  }

  createForm() {
    this.bankDetailsForm = this.fb.group({
      bankAccount: this.fb.array([this.bankDetailsFormObj()]),
    });
  }

  get bankAccountArray(): FormArray {
    return this.bankDetailsForm?.get("bankAccount") as FormArray;
  }

  addBank() {
    this.bankAccountArray.push(this.bankDetailsFormObj());
  }

  removeBank(i: number) {
    this.bankAccountArray.removeAt(i);
  }

  bankDetailsFormObj() {
    return this.fb.group({
      displayName: ["", [Validators.required]],
      beneficiaryName: ["", [Validators.required]],
      accountNo: [
        "",
        [Validators.required, Validators.pattern(regexService.accountNo)],
      ],
      accountType: ["", [Validators.required]],
      bankName: ["", [Validators.required]],
      branchName: ["", [Validators.required]],
      ifscCode: [
        "",
        [Validators.required, Validators.pattern(regexService.ifsc)],
      ],
      branchCode: ["", [Validators.required]],
      default: [false],
      swiftCode: ["", [Validators.required]],
      currency: ["", [Validators.required]],
      branchAddress: this.fb.array([this.bankAddressFormObj()]),
    });
  }

  bankAddressFormObj() {
    return this.fb.group({
      line: ["", [Validators.required]],
    });
  }

  bankAddressArray(i: number): FormArray {
    return this.bankAccountArray.at(i)?.get("branchAddress") as FormArray;
  }

  addAddress(i: number): void {
    this.bankAddressArray(i)?.push(this.bankAddressFormObj());
  }

  removeAddress(i: number, mainInd: number) {
    if (i > 0) {
      this.bankAddressArray(mainInd).removeAt(i);
    }
  }

  // patch bank account
  patchBankDetailsForm() {
    if (this.isEdit) {
      this.bankAccountArray.removeAt(0);
      this.bankDetailsData?.bankAccount?.forEach((data: any, bi: number) => {
        let formObj = this.fb.group({
          displayName: [data?.displayName, [Validators.required]],
          beneficiaryName: [data?.beneficiaryName, [Validators.required]],
          accountNo: [
            data?.accountNo,
            [Validators.required, Validators.pattern(regexService.accountNo)],
          ],
          accountType: [data?.accountType, [Validators.required]],
          bankName: [data?.bankName, [Validators.required]],
          branchName: [data?.branchName, [Validators.required]],
          ifscCode: [
            data?.ifscCode,
            [Validators.required, Validators.pattern(regexService.ifsc)],
          ],
          branchCode: [data?.branchCode, [Validators.required]],
          swiftCode: [data?.swiftCode, [Validators.required]],
          currency: [data?.currency, [Validators.required]],
          default: [data?.default || false],
          branchAddress: this.fb.array([this.bankAddressFormObj()]),
        });

        // patch bank address
        let arr = formObj.get("branchAddress") as FormArray;
        arr.removeAt(0);

        data?.branchAddress?.forEach((baData: any, baIndex: any) => {
          let formObj = this.fb.group({
            line: [baData?.line, [Validators.required]],
          });
          arr.push(formObj);
        });

        this.bankAccountArray.push(formObj);
      });
    }
  }

  @ViewChild("checkbox") checkbox: ElementRef;
  onClickCheckbox(event: any, index: number) {
    let checked = event.checked;

    if (checked) {
      let allBankAccount = this.bankAccountArray.value;

      allBankAccount.forEach((res: any, i: number) => {
        const itemGroup = this.bankAccountArray.at(i);
        itemGroup.patchValue({
          default: false,
        });
      });

      const itemGroup = this.bankAccountArray.at(index);
      itemGroup.patchValue({
        default: true,
      });
    } else {
      const itemGroup = this.bankAccountArray.at(index);
      itemGroup.patchValue({
        default: false,
      });
    }
  }

  submit() {
    if (this.bankDetailsForm.valid) {
      if (!this.isEdit) {
        this.hospitalService
          .addBankDetails(this.bankDetailsForm.value)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.getBankDetails();
            this.bankDetailsData = [];
          });
      } else {
        this.hospitalService
          .editBankDetails(
            this.bankDetailsForm.value,
            this.bankDetailsData?._id
          )
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.getBankDetails();
            this.bankDetailsData = [];
          });
      }
    }
  }
}
