import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { regexService } from "src/app/core/service/regex";
import { AddPatientEmailFetchComponent } from "../../dialog/add-patient-email-fetch/add-patient-email-fetch.component";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { MatStep, MatStepper } from "@angular/material/stepper";
import { AssignOpinionEmailFetchComponent } from "../assign-opinion-email-fetch/assign-opinion-email-fetch.component";
import { AssignOpdEmailFetchComponent } from "../assign-opd-email-fetch/assign-opd-email-fetch.component";
import { AssignPreintimationEmailFetchComponent } from "../assign-preintimation-email-fetch/assign-preintimation-email-fetch.component";
import { AssignProformaEmailFetchComponent } from "../assign-proforma-email-fetch/assign-proforma-email-fetch.component";
import { AssignConfirmationEmailFetchComponent } from "../assign-confirmation-email-fetch/assign-confirmation-email-fetch.component";
import { AssignVilEmailFetchComponent } from "../assign-vil-email-fetch/assign-vil-email-fetch.component";
import { cloneDeep } from "lodash";
import { AddVilEmailFetchComponent } from "../add-details/add-vil-email-fetch/add-vil-email-fetch.component";
import { AddOpdEmailFetchComponent } from "../add-details/add-opd-email-fetch/add-opd-email-fetch.component";
import { AddOpinionEmailFetchComponent } from "../add-details/add-opinion-email-fetch/add-opinion-email-fetch.component";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { extractEmailFormMail } from "src/app/shared/constant";
import { AcknowledgementModalComponent } from "src/app/shared/components/dialogs/acknowledgement-modal/acknowledgement-modal.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-email-fetch-overlay",
  templateUrl: "./email-fetch-overlay.component.html",
  styleUrls: ["./email-fetch-overlay.component.scss"],
})
export class EmailFetchOverlayComponent implements OnInit {
  @ViewChild("stepper") stepper!: MatStepper;
  @Input() emailData: any;
  @Output("overlayClose") overlayClose: EventEmitter<any> = new EventEmitter();

  currentStepIndex: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private hospitalService: HospitalService,
    private dialog: MatDialog
  ) {
    this.buildPatientForm();
  }

  ngOnInit(): void {}

  closeOverlay() {
    this.overlayClose.emit();
  }

  navigateStepperToNext(stepper: any) {
    const currentStep = stepper.selectedIndex;

    switch (currentStep) {
      case 1:
        if (this.chooseOptionSelectedControl?.value === "add") {
          if (this.addPatientForm?.valid) {
            this.onPatientSubmit();
          } else {
            this.addPatientForm.markAllAsTouched();
          }
        } else if (
          this.chooseOptionSelectedControl?.value === "choose" ||
          this.chooseOptionSelectedControl?.value === "details"
        ) {
          if (this.choosedPatientFormControl?.valid) {
            this.nextStep();
          } else {
            this.choosedPatientFormControl.markAllAsTouched();
          }
        }
        break;

      case 2:
        this.finalStepSubmitFunction();
        break;
    }
  }

  navigateStepperToPrevious(stepper: any) {
    this.previousStep();
  }

  navigateFromButton = false;
  nextStep() {
    this.navigateFromButton = true;
    const currentStep = this.stepper.selectedIndex;
    this.stepper.next();
    this.currentStepIndex = currentStep + 1;
    this.navigateFromButton = false;
  }

  @ViewChildren("stepTwo") stepTwo: MatStep;

  stepOneOption: string = "";
  stepTwoOption: string = "";
  previousStep() {
    const currentStep = this.stepper.selectedIndex;
    this.stepper.previous();
    this.currentStepIndex = currentStep - 1;
    if (currentStep === 2) {
      if (this.chooseOptionSelectedControl.value === "add") {
        this.stepper.reset();
        this.buildPatientForm();
      } else {
        this.stepTwoOption = this.choosedPatientFormControl.value;
        this.stepper.reset();
        if (!!this.stepOneOption) {
          this.chooseOptionSelectedControl.setValue(this.stepOneOption);
          if (!!this.stepTwoOption) {
            this.choosedPatientFormControl.setValue(this.stepTwoOption);
          }
          this.nextStep();
        }
      }
    }
    if (currentStep === 1) {
      if (this.chooseOptionSelectedControl.value === "add") {
        this.buildPatientForm();
      }
      this.stepper.reset();
      this.stepOneOption = "";
      this.stepTwoOption = "";
    }
  }
  // Step First methods and variables

  selectMethodArray = [
    {
      title: "Add Patient",
      iconName: "add_to_queue",
      value: "add",
    },
    {
      title: "Assign Hospital",
      iconName: "list_alt",
      value: "choose",
    },
    {
      title: "Add Details",
      iconName: "note_add",
      value: "details",
    },
  ];

  chooseOptionSelectedControl: FormControl = new FormControl(
    "",
    Validators.required
  );

  onOptionSelect(value: string) {
    if (value === "choose" || value === "add") {
      this.selectedTask.patchValue("opinionRequest");
    }
    if (value === "details") {
      this.selectedTask.patchValue("addOpinion");
    }
    this.chooseOptionSelectedControl.setValue(value);
    this.stepOneOption = value;
    if (this.chooseOptionSelectedControl?.valid) {
      this.nextStep();
    } else {
      this.chooseOptionSelectedControl.markAllAsTouched();
    }
  }

  // add patient stepper methods and variables

  @ViewChild(AddPatientEmailFetchComponent)
  addPatientEmailFetchComponent!: AddPatientEmailFetchComponent;

  addPatientForm: FormGroup;
  patientReport: any = [];
  patientUploadedFiles: any = [];
  isDuplicateFound: boolean = false;
  // patientDataFromResponse: any = {
  //   patientId: "66a0fa7b784b7ebb71312cb4",
  // };
  patientDataFromResponse: any;

  buildPatientForm() {
    this.addPatientForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      country: [null, [Validators.required]],
      gender: ["", []],
      treatment: [null, []],
      age: ["", []],
      ageDuration: ["", []],
      contact: ["", [Validators.pattern(regexService.contactRegex)]],
      emailId: ["", [Validators.pattern(regexService.emailRegex)]],
      passportNumber: [""],
      referralPartner: [""],
      referralType: [""],
      referralPartnerName: [""],
      medicalHistory: ["", []],
      remarks: [""],
      receivedAt: [
        {
          value: "",
          disabled: true,
        },
      ],
      report: [],
      mode: ["preIntimation", [Validators.required]],
    });
  }

  onChangeMode(event: any) {
    if (event.value === "normal") {
      this.addPatientForm = this.formBuilder.group({
        name: [this.addPatientForm.value.name, [Validators.required]],
        country: [this.addPatientForm.value.country, [Validators.required]],
        gender: [this.addPatientForm.value.gender, [Validators.required]],
        treatment: [this.addPatientForm.value.treatment, [Validators.required]],
        age: [this.addPatientForm.value.age, [Validators.required]],
        ageDuration: [
          this.addPatientForm.value.ageDuration,
          [Validators.required],
        ],
        contact: [
          this.addPatientForm.value.contact,
          [Validators.required, Validators.pattern(regexService.contactRegex)],
        ],
        emailId: [
          this.addPatientForm.value.emailId,
          [Validators.required, Validators.pattern(regexService.emailRegex)],
        ],
        passportNumber: [this.addPatientForm.value.passportNumber],
        referralPartner: [this.addPatientForm.getRawValue().referralPartner],
        medicalHistory: [
          this.addPatientForm.value.medicalHistory,
          [Validators.required],
        ],
        remarks: [this.addPatientForm.value.remarks],
        receivedAt: [
          {
            value: this.addPatientForm.getRawValue().receivedAt,
            disabled: true,
          },
        ],
        report: [],
        mode: ["normal", [Validators.required]],
        referralType: [this.addPatientForm.getRawValue().referralType],
        referralPartnerName: [
          this.addPatientForm.getRawValue().referralPartnerName,
        ],
      });
    } else if (event.value === "preIntimation") {
      this.addPatientForm = this.formBuilder.group({
        name: [this.addPatientForm.value.name, [Validators.required]],
        country: [this.addPatientForm.value.country, [Validators.required]],
        gender: [this.addPatientForm.value.gender, []],
        treatment: [this.addPatientForm.value.treatment, []],
        age: [this.addPatientForm.value.age, []],
        ageDuration: [this.addPatientForm.value.ageDuration, []],
        contact: [
          this.addPatientForm.value.contact,
          [Validators.pattern(regexService.contactRegex)],
        ],
        emailId: [
          this.addPatientForm.value.emailId,
          [Validators.pattern(regexService.emailRegex)],
        ],
        passportNumber: [this.addPatientForm.value.passportNumber],
        referralPartner: [this.addPatientForm.getRawValue().referralPartner],
        medicalHistory: [this.addPatientForm.value.medicalHistory, []],
        remarks: [this.addPatientForm.value.remarks],
        receivedAt: [
          {
            value: this.addPatientForm.getRawValue().receivedAt,
            disabled: true,
          },
        ],
        report: [],
        mode: ["preIntimation", [Validators.required]],
        referralType: [this.addPatientForm.getRawValue().referralType],
        referralPartnerName: [
          this.addPatientForm.getRawValue().referralPartnerName,
        ],
      });
    }
  }

  onPatientSubmit() {
    this.patientReport = this.addPatientEmailFetchComponent.report;
    this.patientUploadedFiles = this.addPatientEmailFetchComponent.fileList;
    this.addPatientFormSubmit();
    // this.checkDuplicatePatient();
    // this.nextStep();
  }

  patientFormBack() {
    this.isDuplicateFound = false;
    this.previousStep();
    this.chooseOptionSelectedControl.patchValue("");
    this.stepOneOption = "";
  }

  recheckFormSubmit() {
    this.isDuplicateFound = false;
  }

  checkDuplicatePatient() {
    // if (this.addPatientForm.valid) {
    const data = {
      name: this.addPatientForm.getRawValue().name,
      country: this.addPatientForm.getRawValue().country,
      age: this.addPatientForm.getRawValue().age,
      ageDuration: this.addPatientForm.getRawValue().ageDuration,
      passportNumber: this.addPatientForm.getRawValue().passportNumber,
    };
    this.sharedService.startLoader();

    if (data?.ageDuration === null) {
      data.ageDuration = "";
    }
    if (data?.country === null) {
      data.country = "";
    }
    if (data?.name === null) {
      data.name = "";
    }
    if (data?.age === null) {
      data.age = "";
    }
    if (data?.passportNumber === null) {
      data.passportNumber = "";
    }

    this.hospitalService.checkDuplicatePatient(data).subscribe(
      (res: any) => {
        if (!res?.data?.found) {
          this.addPatientEmailFetchComponent.isDuplicateFound = false;
          this.isDuplicateFound = false;
          // this.addPatientFormSubmit();
        } else {
          this.sharedService.stopLoader();
          this.addPatientEmailFetchComponent.isDuplicateFound = true;
          this.isDuplicateFound = true;
          this.addPatientEmailFetchComponent.patientMhid =
            res.data.patientMhidCode;
        }
      },
      (err) => {
        this.sharedService.stopLoader();
      }
    );
    // }
    // } else {
    //   Object.keys(this.addPatientForm.controls).forEach((key) => {
    //     this.addPatientForm.controls[key].markAsTouched();
    //   });
    // }
  }

  addPatientFormSubmit() {
    if (this.addPatientForm.valid) {
      const formData = new FormData();
      formData.append("name", this.addPatientForm.value.name);
      formData.append(
        "gender",
        this.addPatientForm.value.gender === null
          ? ""
          : this.addPatientForm.value.gender
      );
      formData.append(
        "country",
        this.addPatientForm.value.country === null
          ? ""
          : this.addPatientForm.value.country
      );
      formData.append(
        "treatment",
        this.addPatientForm.value.treatment === null
          ? ""
          : this.addPatientForm.value.treatment
      );
      formData.append("age", this.addPatientForm.value.age);
      formData.append(
        "receivedAt",
        this.addPatientForm.getRawValue().receivedAt
      );
      formData.append(
        "ageDuration",
        this.addPatientForm.value.ageDuration === null
          ? ""
          : this.addPatientForm.value.ageDuration
      );
      formData.append("contact", this.addPatientForm.value.contact);
      formData.append("emailId", this.addPatientForm.value.emailId);
      formData.append(
        "passportNumber",
        this.addPatientForm.value.passportNumber
      );

      if (this.addPatientForm.getRawValue().referralPartner) {
        formData.append(
          "referralPartner",
          this.addPatientForm.getRawValue().referralPartner
        );
        formData.append(
          "referralType",
          this.addPatientForm.getRawValue().referralType
        );
        formData.append(
          "referralPartnerName",
          this.addPatientForm.getRawValue().referralPartnerName
        );
      }
      formData.append(
        "medicalHistory",
        this.addPatientForm.value.medicalHistory
      );
      formData.append("remarks", this.addPatientForm.value.remarks);

      // file first mapping
      let report = [];
      let fileFirstArray = [];

      let fileFirst = cloneDeep(this.addPatientEmailFetchComponent.fileList);

      fileFirst?.map((ff: any, index: number) => {
        if (!!ff?.signedUrl) {
          report.push(ff);
        } else {
          fileFirstArray.push(ff);
        }
      });

      for (var i = 0; i < fileFirstArray?.length; i++) {
        formData.append("fileFirst", fileFirstArray[i]);
      }

      if (report?.length > 0) {
        formData.append("report", JSON.stringify(report));
      }

      this.hospitalService.addPatient(formData).subscribe((res: any) => {
        let resData = res?.data;
        this.patientDataFromResponse = resData;

        this.nextStep();

        this.sharedService.showNotification("snackBar-success", res.message);
      });
    } else {
      Object.keys(this.addPatientForm.controls).forEach((key) => {
        this.addPatientForm.controls[key].markAsTouched();
      });
    }
  }

  // choose patient methods and variables
  choosedPatientData: any;
  choosedPatientIdFormControl: any = new FormControl(null, Validators.required);
  choosedPatientFormControl: any = new FormControl(null, Validators.required);

  // step third methods and variables

  radioGroup = [
    { name: "Pre Intimation", value: "preIntimation" },
    { name: "OPD Request", value: "opdRequest" },
    { name: "Proforma Invoice", value: "proformaInvoice" },
    { name: "Opinion Request", value: "opinionRequest" },
    { name: "Request VIL", value: "requestVil" },
    { name: "Confirmation", value: "confirmation" },
  ];

  radioGroupForDetails = [
    { name: "Add Opinion", value: "addOpinion" },
    { name: "Add VIL", value: "addVil" },
    { name: "Add OPD", value: "addOpd" },
  ];

  // step third methods and variables

  selectedTask: FormControl = new FormControl("");

  selectChange(value: any) {
    this.selectedTask.setValue(value);
  }

  finalStepSubmitFunction() {
    switch (this.selectedTask?.value) {
      case "opinionRequest":
        this.opinionSubmit();
        break;
      case "opdRequest":
        this.opdSubmit();
        break;
      case "preIntimation":
        this.preIntimationSubmit();
        break;
      case "proformaInvoice":
        this.proformaSubmit();
        break;
      case "requestVil":
        this.vilSubmit();
        break;
      case "confirmation":
        this.confirmationSubmit();
        break;
      case "addOpinion":
        this.addOpinionSubmit();
        break;
      case "addVil":
        this.addVilSubmit();
        break;
      case "addOpd":
        this.addOpdSubmit();
        break;
    }
  }

  // opinion methods and variables
  @ViewChild(AssignOpinionEmailFetchComponent)
  assignOpinionEmailFetchComponent!: AssignOpinionEmailFetchComponent;

  opinionSubmit() {
    if (this.assignOpinionEmailFetchComponent.opinionRequestForm.valid) {
      let values = this.assignOpinionEmailFetchComponent.modifyPayload();
      values["emailFrom"] = extractEmailFormMail(this.emailData?.from);
      this.hospitalService.addOpinionRequest(values).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        let acknowledgementPayload = {
          eventName: "opinionRequest",
          patient:
            this.chooseOptionSelectedControl?.value === "add"
              ? this.patientDataFromResponse?.patientId
              : this.choosedPatientFormControl?.value,
          emailFrom: extractEmailFormMail(this.emailData?.from),
        };

        this.acknowledgementPopupByEvent(acknowledgementPayload, values);
        // this.closeOverlay();
      });
    } else {
      this.assignOpinionEmailFetchComponent.opinionRequestForm.markAllAsTouched();
    }
  }

  // opd methods and variables
  @ViewChild(AssignOpdEmailFetchComponent)
  assignOpdEmailFetchComponent!: AssignOpdEmailFetchComponent;

  opdSubmit() {
    if (this.assignOpdEmailFetchComponent.opdForm.valid) {
      let values = this.assignOpdEmailFetchComponent.modifyPayload();
      values["emailFrom"] = extractEmailFormMail(this.emailData?.from);
      this.hospitalService.addOpdRequest(values).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        let acknowledgementPayload = {
          eventName: "opdRequest",
          patient:
            this.chooseOptionSelectedControl?.value === "add"
              ? this.patientDataFromResponse?.patientId
              : this.choosedPatientFormControl?.value,
          emailFrom: extractEmailFormMail(this.emailData?.from),
        };

        this.acknowledgementPopupByEvent(acknowledgementPayload, values);
        // this.closeOverlay();
      });
    } else {
      this.assignOpdEmailFetchComponent.opdForm.markAllAsTouched();
    }
  }

  // pre intimation methods and variables
  @ViewChild(AssignPreintimationEmailFetchComponent)
  assignPreintimationEmailFetchComponent!: AssignPreintimationEmailFetchComponent;

  preIntimationSubmit() {
    if (this.assignPreintimationEmailFetchComponent.preIntimationForm.valid) {
      let values = this.assignPreintimationEmailFetchComponent.modifyPayload();
      values["emailFrom"] = extractEmailFormMail(this.emailData?.from);
      this.hospitalService.addPreIntimation(values).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        let acknowledgementPayload = {
          eventName: "preIntimation",
          patient:
            this.chooseOptionSelectedControl?.value === "add"
              ? this.patientDataFromResponse?.patientId
              : this.choosedPatientFormControl?.value,
          emailFrom: extractEmailFormMail(this.emailData?.from),
        };

        this.acknowledgementPopupByEvent(acknowledgementPayload, values);
        // this.closeOverlay();
      });
    } else {
      this.assignPreintimationEmailFetchComponent.preIntimationForm.markAllAsTouched();
    }
  }

  // proforma invoice methods and variables
  @ViewChild(AssignProformaEmailFetchComponent)
  assignProformaEmailFetchComponent!: AssignProformaEmailFetchComponent;

  proformaSubmit() {
    if (this.assignProformaEmailFetchComponent.proformaInvoiceForm.valid) {
      let values = this.assignProformaEmailFetchComponent.modifyPayload();
      values["emailFrom"] = extractEmailFormMail(this.emailData?.from);
      this.hospitalService
        .addProformaInvoiceRequest(values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          let acknowledgementPayload = {
            eventName: "proformaInvoiceRequest",
            patient:
              this.chooseOptionSelectedControl?.value === "add"
                ? this.patientDataFromResponse?.patientId
                : this.choosedPatientFormControl?.value,
            emailFrom: extractEmailFormMail(this.emailData?.from),
          };

          this.acknowledgementPopupByEvent(acknowledgementPayload, values);
          // this.closeOverlay();
        });
    } else {
      this.assignProformaEmailFetchComponent.proformaInvoiceForm.markAllAsTouched();
    }
  }

  // proforma invoice methods and variables
  @ViewChild(AssignConfirmationEmailFetchComponent)
  assignConfirmationEmailFetchComponent!: AssignConfirmationEmailFetchComponent;

  confirmationSubmit() {
    if (
      this.assignConfirmationEmailFetchComponent.patientConfirmationForm.valid
    ) {
      let values =
        this.assignConfirmationEmailFetchComponent.patientConfirmationForm.getRawValue();
      let paylaod = {
        patient: values?.patient,
        hospitalName: values?.hospitalName,
        hospitalId: values?.hospitalId,
        cabs: values?.cabs,
        flightName: values?.flightName,
        flightNo: values?.flightNo,
        arrivalDate: values?.arrivalDate,
        contactPerson: values?.contactPerson,
        contactPersonNo: values?.contactPersonNo,
        coordinatorAddress: values?.coordinatorAddress,
        coordinatorPickUpTime: values?.coordinatorPickUpTime,
        remarks: values?.remarks,
        receivedAt: values?.receivedAt,
        emailFrom: extractEmailFormMail(this.emailData?.from),
      };

      let formData = new FormData();
      for (const key in paylaod) {
        formData.append(key, paylaod[key]);
      }

      // file first mapping
      let ticket = [];
      let fileFirstArray = [];

      let fileFirst = cloneDeep(
        this.assignConfirmationEmailFetchComponent.fileList
      );

      fileFirst?.map((ff: any, index: number) => {
        if (!!ff?.signedUrl) {
          ticket.push(ff);
        } else {
          fileFirstArray.push(ff);
        }
      });

      for (var i = 0; i < fileFirstArray?.length; i++) {
        formData.append("fileFirst", fileFirstArray[i]);
      }

      if (ticket?.length > 0) {
        formData.append("ticket", JSON.stringify(ticket));
      }

      this.hospitalService
        .addpatientConfirmation(formData)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          let acknowledgementPayload = {
            eventName: "patientConfirmation",
            patient:
              this.chooseOptionSelectedControl?.value === "add"
                ? this.patientDataFromResponse?.patientId
                : this.choosedPatientFormControl?.value,
            emailFrom: extractEmailFormMail(this.emailData?.from),
          };

          let ackEventPayload = {
            ...paylaod,
          };

          this.acknowledgementPopupByEvent(
            acknowledgementPayload,
            ackEventPayload
          );
          // this.closeOverlay();
          // localStorage.removeItem(`${this.patientId}patientConfirmationDraft`);
        });
    } else {
      this.assignConfirmationEmailFetchComponent.patientConfirmationForm.markAllAsTouched();
    }
  }

  // Vil methods and variables
  @ViewChild(AssignVilEmailFetchComponent)
  assignVilEmailFetchComponent!: AssignVilEmailFetchComponent;

  vilSubmit() {
    if (this.assignVilEmailFetchComponent.vilRequestForm.valid) {
      let formData = new FormData();
      let patientPassport = [];
      let fileFirstArray = [];
      let attendantPassport = [];
      let fileSecondArray = [];
      let donorPassport = [];
      let fileThirdArray = [];

      let fileFirst = cloneDeep(
        this.assignVilEmailFetchComponent.fileFirstList
      );
      let fileSecond = cloneDeep(
        this.assignVilEmailFetchComponent.fileSecondList
      );
      let fileThird = cloneDeep(
        this.assignVilEmailFetchComponent.fileThirdList
      );

      let values =
        this.assignVilEmailFetchComponent.vilRequestForm.getRawValue();
      let payload = {
        patientName: values?.patientName,
        emailId: values?.emailId,
        contact: values?.contact,
        address: values?.address,
        // verifyAddress: values?.verifyAddress,
        treatment: values?.treatment,
        department: values?.department,
        givenName: values?.givenName,
        surName: values?.surName,
        gender: values?.gender,
        dob: values?.dob,
        addressInIndia: values?.addressInIndia,
        contactInIndia: values?.contactInIndia,
        country: values?.country,
        receivedAt: values?.receivedAt,
        passportNumber: values?.passportNumber,
        patient:
          this.chooseOptionSelectedControl?.value === "add"
            ? this.patientDataFromResponse?.patientId
            : this.choosedPatientFormControl?.value,
        doctorName: values?.doctorName,
        appointmentDate: values?.appointmentDate,
        emailFrom: extractEmailFormMail(this.emailData?.from),
      };

      for (const key in payload) {
        formData.append(key, payload[key]);
      }

      // file first mapping
      fileFirst?.map((ff: any, index: number) => {
        if (!!ff?.signedUrl) {
          patientPassport.push(ff);
        } else {
          fileFirstArray.push(ff);
        }
      });

      for (var i = 0; i < fileFirstArray?.length; i++) {
        formData.append("fileFirst", fileFirstArray[i]);
      }

      formData.append("patientPassport", JSON.stringify(patientPassport));
      // file first mapping end

      // file second mapping
      fileSecond?.map((fs: any, index: number) => {
        fs?.forEach((fse: any) => {
          if (!!fse?.signedUrl) {
            attendantPassport.push(fse);
          } else {
            fileSecondArray.push(fse);
          }
        });
      });

      for (var i = 0; i < fileSecondArray?.length; i++) {
        formData.append("fileSecond", fileSecondArray[i]);
      }

      formData.append("attendantPassport", JSON.stringify(attendantPassport));
      // file second mapping end

      // file third mapping
      fileThird?.map((ft: any, index: number) => {
        ft?.forEach((fte: any) => {
          if (!!fte?.signedUrl) {
            donorPassport.push(fte);
          } else {
            fileThirdArray.push(fte);
          }
        });
      });

      for (var i = 0; i < fileThirdArray?.length; i++) {
        formData.append("fileThird", fileThirdArray[i]);
      }

      formData.append("donorPassport", JSON.stringify(donorPassport));
      // file third mapping end

      formData.append(
        "vilRequest",
        JSON.stringify([
          {
            hospitalName: values?.hospitalName,
            hospitalId: values?.hospitalId,
          },
        ])
      );
      formData.append("embassy", JSON.stringify(values?.embassyForm));
      let donorDetails = values?.donorDetails;
      donorDetails?.map((value: any) => {
        delete value["files"];
      });
      formData.append("donorDetails", JSON.stringify(donorDetails));

      let attendantDetails = values?.attendantDetails;
      attendantDetails?.map((value: any) => {
        delete value["files"];
      });
      formData.append("attendantDetails", JSON.stringify(attendantDetails));

      this.hospitalService.addVilRequest(formData).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        let acknowledgementPayload = {
          eventName: "vilRequest",
          patient:
            this.chooseOptionSelectedControl?.value === "add"
              ? this.patientDataFromResponse?.patientId
              : this.choosedPatientFormControl?.value,
          emailFrom: extractEmailFormMail(this.emailData?.from),
        };

        let ackEventPayload = {
          ...payload,
          embassy: values?.embassyForm,
          donorDetails: donorDetails,
          attendantDetails: attendantDetails,
          vilRequest: [
            {
              hospitalName: values?.hospitalName,
              hospitalId: values?.hospitalId,
            },
          ],
        };

        this.acknowledgementPopupByEvent(
          acknowledgementPayload,
          ackEventPayload
        );
        // this.closeOverlay();
        // localStorage.removeItem(`${this.patientId}vilRequestDraft`);
      });
    } else {
      this.assignVilEmailFetchComponent.vilRequestForm.markAllAsTouched();
    }
  }

  acknowledgementData: any;
  acknowledgementPopupByEvent(payload: any, values: any) {
    this.sharedService
      .acknowledgementPopupByEvent(payload)
      .subscribe((res: any) => {
        this.acknowledgementData = res?.data;
        if (!this.acknowledgementData?.found) {
          this.closeOverlay();
        } else {
          this.openAcknowledgePopup(payload, values);
          this.closeOverlay();
        }
      });
  }

  openAcknowledgePopup(payload: any, values: any) {
    const dialogRef = this.dialog.open(AcknowledgementModalComponent, {
      width: "60%",
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.componentInstance.dialogTitle = "";
    dialogRef.componentInstance.acknowledgementData = this.acknowledgementData;
    dialogRef.componentInstance.acknowledgementPayload = payload;
    dialogRef.componentInstance.eventPayload = values;
    dialogRef.componentInstance.type = payload?.eventName;
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
      }
    });
  }

  // add detials methods and variables

  // add Vil
  @ViewChild(AddVilEmailFetchComponent)
  addVilEmailFetchComponent!: AddVilEmailFetchComponent;

  addVilSubmit() {
    if (this.addVilEmailFetchComponent.vilForm?.valid) {
      const {
        hospitalName,
        hospitalId,
        patient,
        vilId,
        referenceNo,
        receivedAt,
      } = this.addVilEmailFetchComponent.vilForm?.getRawValue();

      let formData = new FormData();

      let paylaod = {
        hospitalName: hospitalName,
        hospitalId,
        patient,
        vilId,
        receivedAt,
        referenceNo,
      };

      for (const key in paylaod) {
        formData.append(key, paylaod[key]);
      }

      // file first mapping
      let vilLetter = [];
      let fileFirstArray = [];

      let fileFirst = cloneDeep(this.addVilEmailFetchComponent.fileList);

      fileFirst?.map((ff: any, index: number) => {
        if (!!ff?.signedUrl) {
          vilLetter = [ff];
        } else {
          fileFirstArray = [ff];
        }
      });

      if (fileFirstArray?.length > 0) {
        formData.append("file", fileFirstArray?.[0]);
      }

      if (vilLetter?.length > 0) {
        formData.append("vilLetter", JSON.stringify(vilLetter[0]));
      }

      this.hospitalService.addVil(formData).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.closeOverlay();
      });
    } else {
      this.addVilEmailFetchComponent.vilForm.markAllAsTouched();
    }
  }

  // add Opd
  @ViewChild(AddOpdEmailFetchComponent)
  addOpdEmailFetchComponent!: AddOpdEmailFetchComponent;

  addOpdSubmit() {
    if (this.addOpdEmailFetchComponent.opdForm?.valid) {
      const {
        hospitalName,
        hospitalId,
        opdAt,
        meetingLink,
        paymentLink,
        doctorName,
        patient,
        opdId,
        receivedAt,
        otherDoctorName,
      } = this.addOpdEmailFetchComponent.opdForm?.getRawValue();

      let paylaod = {
        opdReceived: {
          hospitalName: hospitalName,
          hospitalId,
          paymentLink,
          meetingLink,
          opdId,
          opdAt,
          receivedAt,
          doctorName:
            doctorName === "Other" ? otherDoctorName || "Other" : doctorName,
        },
        patient,
      };

      this.hospitalService.addOpd(paylaod).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.closeOverlay();
        // localStorage.removeItem(`${this.patientData?._id}addOpdDraft`);
      });
    } else {
      this.addOpdEmailFetchComponent.opdForm.markAllAsTouched();
    }
  }

  // add Opinion
  @ViewChild(AddOpinionEmailFetchComponent)
  addOpinionEmailFetchComponent!: AddOpinionEmailFetchComponent;

  addOpinionSubmit() {
    if (this.addOpinionEmailFetchComponent.opinionForm?.valid) {
      const {
        hospitalId,
        hospitalName,
        hospitalCity,
        doctorName,
        doctorId,
        diagnosis,
        treatmentPlan,
        stayInCountry,
        stayInHospital,
        hospitalDuration,
        countryDuration,
        remarks,
        accreditation,
        initialEvaluationMinimum,
        initialEvaluationMaximum,
        treatment,
        opinionId,
        patient,
        receivedAt,
        otherDoctorName,
        currency,
        treatmentPackage,
      } = this.addOpinionEmailFetchComponent.opinionForm?.getRawValue();

      let paylaod = {
        opinionReceived: {
          hospitalName: hospitalName,
          hospitalId,
          hospitalCity,
          treatment,
          treatmentPlan,
          stayInCountry,
          stayInHospital,
          hospitalDuration,
          countryDuration,
          accreditation,
          initialEvaluationMaximum,
          initialEvaluationMinimum,
          doctorId,
          opinionId,
          diagnosis,
          remarks,
          receivedAt,
          doctorName:
            doctorName === "Other" ? otherDoctorName || "Other" : doctorName,
          currency,
          treatmentPackage: treatmentPackage ? treatmentPackage : null,
        },
        patient,
      };
      // console.log('paylaod',paylaod)
      this.hospitalService.addOpinion(paylaod).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.closeOverlay();
        // localStorage.removeItem(`${this.patientData?._id}addOpinionDraft`);
      });
    } else {
      this.addOpinionEmailFetchComponent.opinionForm.markAllAsTouched();
    }
  }
}
