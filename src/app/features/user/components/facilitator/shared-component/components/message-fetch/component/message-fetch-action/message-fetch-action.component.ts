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
import { MatStep, MatStepper } from "@angular/material/stepper";
import { MessageFetchAddPatientComponent } from "../action-components/message-fetch-add-patient/message-fetch-add-patient.component";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";
import { regexService } from "src/app/core/service/regex";
import { MessageFetchAddOpinionComponent } from "../action-components/add-components/message-fetch-add-opinion/message-fetch-add-opinion.component";
import { MessageFetchAddOpdComponent } from "../action-components/add-components/message-fetch-add-opd/message-fetch-add-opd.component";
import { MessageFetchAddVilComponent } from "../action-components/add-components/message-fetch-add-vil/message-fetch-add-vil.component";
import { MatDialog } from "@angular/material/dialog";
import { MessageFetchAssignOpinionComponent } from "../action-components/assign-components/message-fetch-assign-opinion/message-fetch-assign-opinion.component";
import { MessageFetchAssignOpdComponent } from "../action-components/assign-components/message-fetch-assign-opd/message-fetch-assign-opd.component";
import { MessageFetchAssignPreIntimationComponent } from "../action-components/assign-components/message-fetch-assign-pre-intimation/message-fetch-assign-pre-intimation.component";
import { MessageFetchAssignProformaComponent } from "../action-components/assign-components/message-fetch-assign-proforma/message-fetch-assign-proforma.component";
import { MessageFetchAssignConfirmationComponent } from "../action-components/assign-components/message-fetch-assign-confirmation/message-fetch-assign-confirmation.component";
import { MessageFetchAssignVilComponent } from "../action-components/assign-components/message-fetch-assign-vil/message-fetch-assign-vil.component";
import { AcknowledgementModalComponent } from "src/app/shared/components/dialogs/acknowledgement-modal/acknowledgement-modal.component";
import { convertBufferToFile } from "src/app/shared/constant";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { MessageFetchAddProformaComponent } from "../action-components/add-components/message-fetch-add-proforma/message-fetch-add-proforma.component";

@Component({
  selector: "app-message-fetch-action",
  templateUrl: "./message-fetch-action.component.html",
  styleUrls: ["./message-fetch-action.component.scss"],
})
export class MessageFetchActionComponent implements OnInit {
  @ViewChild("stepper") stepper!: MatStepper;
  @Input() messageData: any;
  @Input() selectedProfile: any;
  @Output("overlayClose") overlayClose: EventEmitter<any> = new EventEmitter();
  attachmentArray: any = [];

  currentStepIndex: number = 0;

  constructor(
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.buildPatientForm();
  }

  ngOnInit(): void {}

  closeOverlay(apiCall = false) {
    this.overlayClose.emit(apiCall);
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

  // stepper first Step
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

  selectedTask: FormControl = new FormControl("");
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

  chooseOptionSelectedControl: FormControl = new FormControl(
    "",
    Validators.required
  );

  // opinion methods and variables
  @ViewChild(MessageFetchAddPatientComponent)
  messageFetchAddPatientComponent!: MessageFetchAddPatientComponent;

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
    this.patientReport = this.messageFetchAddPatientComponent.report;
    this.patientUploadedFiles = this.messageFetchAddPatientComponent.fileList;
    this.addPatientFormSubmit();
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

    this.facilitatorService.checkDuplicatePatient(data).subscribe(
      (res: any) => {
        if (!res?.data?.found) {
          this.messageFetchAddPatientComponent.isDuplicateFound = false;
          this.isDuplicateFound = false;
        } else {
          this.sharedService.stopLoader();
          this.messageFetchAddPatientComponent.isDuplicateFound = true;
          this.isDuplicateFound = true;
          this.messageFetchAddPatientComponent.patientMhid =
            res.data.patientMhidCode;
        }
      },
      (err) => {
        this.sharedService.stopLoader();
      }
    );
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
      let reportMessage = [];
      let fileFirstArray = [];

      let fileFirst = cloneDeep(this.messageFetchAddPatientComponent.fileList);

      fileFirst?.map((ff: any, index: number) => {
        if (!!ff?.signedUrl) {
          ff["filename"] = ff?.name;
          ff["path"] = ff?.url;
          delete ff["message_id"];
          delete ff["timestamp"];
          delete ff["name"];
          delete ff["originalname"];
          delete ff["signedUrl"];
          delete ff["type"];
          delete ff["url"];
          reportMessage.push(ff);
        } else {
          fileFirstArray.push(ff);
        }
      });

      for (var i = 0; i < fileFirstArray?.length; i++) {
        formData.append("fileFirst", fileFirstArray[i]);
      }

      if (reportMessage?.length > 0) {
        formData.append("reportMessage", JSON.stringify(reportMessage));
      }

      this.facilitatorService.addPatient(formData).subscribe((res: any) => {
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
    { name: "Add Proforma Invoice", value: "addProforma" },
  ];

  // step third methods and variables

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
      case "addProforma":
        this.addProformaSubmit();
        break;
    }
  }

  // opinion methods and variables
  @ViewChild(MessageFetchAssignOpinionComponent)
  messageFetchAssignOpinionComponent!: MessageFetchAssignOpinionComponent;

  opinionSubmit() {
    if (this.messageFetchAssignOpinionComponent.opinionRequestForm.valid) {
      let values = this.messageFetchAssignOpinionComponent.modifyPayload();
      // values["emailFrom"] = extractEmailFormMail(this.emailData?.from);
      this.facilitatorService.addOpinion(values).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        let acknowledgementPayload = {
          eventName: "opinionRequest",
          patient:
            this.chooseOptionSelectedControl?.value === "add"
              ? this.patientDataFromResponse?.patientId
              : this.choosedPatientFormControl?.value,
          // emailFrom: extractEmailFormMail(this.emailData?.from),
        };
        this.acknowledgementPopupByEvent(acknowledgementPayload, values);
        // this.closeOverlay();
      });
    } else {
      this.messageFetchAssignOpinionComponent.opinionRequestForm.markAllAsTouched();
    }
  }

  // opd methods and variables
  @ViewChild(MessageFetchAssignOpdComponent)
  messageFetchAssignOpdComponent!: MessageFetchAssignOpdComponent;

  opdSubmit() {
    if (this.messageFetchAssignOpdComponent.opdForm.valid) {
      let values = this.messageFetchAssignOpdComponent.modifyPayload();
      // values["emailFrom"] = extractEmailFormMail(this.emailData?.from);
      this.facilitatorService.addOpdRequest(values).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        let acknowledgementPayload = {
          eventName: "opdRequest",
          patient:
            this.chooseOptionSelectedControl?.value === "add"
              ? this.patientDataFromResponse?.patientId
              : this.choosedPatientFormControl?.value,
          // emailFrom: extractEmailFormMail(this.emailData?.from),
        };
        this.acknowledgementPopupByEvent(acknowledgementPayload, values);
        // this.closeOverlay();
      });
    } else {
      this.messageFetchAssignOpdComponent.opdForm.markAllAsTouched();
    }
  }

  // pre intimation methods and variables
  @ViewChild(MessageFetchAssignPreIntimationComponent)
  messageFetchAssignPreIntimationComponent!: MessageFetchAssignPreIntimationComponent;

  preIntimationSubmit() {
    if (this.messageFetchAssignPreIntimationComponent.preIntimationForm.valid) {
      let values =
        this.messageFetchAssignPreIntimationComponent.modifyPayload();
      // values["emailFrom"] = extractEmailFormMail(this.emailData?.from);
      this.facilitatorService.addPreIntimation(values).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        let acknowledgementPayload = {
          eventName: "preIntimation",
          patient:
            this.chooseOptionSelectedControl?.value === "add"
              ? this.patientDataFromResponse?.patientId
              : this.choosedPatientFormControl?.value,
          // emailFrom: extractEmailFormMail(this.emailData?.from),
        };
        this.acknowledgementPopupByEvent(acknowledgementPayload, values);
        // this.closeOverlay();
      });
    } else {
      this.messageFetchAssignPreIntimationComponent.preIntimationForm.markAllAsTouched();
    }
  }

  // proforma invoice methods and variables
  @ViewChild(MessageFetchAssignProformaComponent)
  messageFetchAssignProformaComponent!: MessageFetchAssignProformaComponent;

  proformaSubmit() {
    if (this.messageFetchAssignProformaComponent.proformaInvoiceForm.valid) {
      let values = this.messageFetchAssignProformaComponent.modifyPayload();
      // values["emailFrom"] = extractEmailFormMail(this.emailData?.from);
      this.facilitatorService
        .addProformaInvoiceRequest(values)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          let acknowledgementPayload = {
            eventName: "proformaInvoiceRequest",
            patient:
              this.chooseOptionSelectedControl?.value === "add"
                ? this.patientDataFromResponse?.patientId
                : this.choosedPatientFormControl?.value,
            // emailFrom: extractEmailFormMail(this.emailData?.from),
          };
          this.acknowledgementPopupByEvent(acknowledgementPayload, values);
          // this.closeOverlay();
        });
    } else {
      this.messageFetchAssignProformaComponent.proformaInvoiceForm.markAllAsTouched();
    }
  }

  // proforma invoice methods and variables
  @ViewChild(MessageFetchAssignConfirmationComponent)
  messageFetchAssignConfirmationComponent!: MessageFetchAssignConfirmationComponent;

  confirmationSubmit() {
    if (
      this.messageFetchAssignConfirmationComponent.patientConfirmationForm.valid
    ) {
      let values =
        this.messageFetchAssignConfirmationComponent.patientConfirmationForm.getRawValue();
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
        // emailFrom: extractEmailFormMail(this.emailData?.from),
      };
      let formData = new FormData();
      for (const key in paylaod) {
        formData.append(key, paylaod[key]);
      }
      // file first mapping
      let ticketMessage = [];
      let fileFirstArray = [];
      let fileFirst = cloneDeep(
        this.messageFetchAssignConfirmationComponent.fileList
      );
      fileFirst?.map((ff: any, index: number) => {
        if (!!ff?.signedUrl) {
          ff["filename"] = ff?.name;
          ff["path"] = ff?.url;
          delete ff["message_id"];
          delete ff["timestamp"];
          delete ff["name"];
          delete ff["originalname"];
          delete ff["signedUrl"];
          delete ff["type"];
          delete ff["url"];
          ticketMessage.push(ff);
        } else {
          fileFirstArray.push(ff);
        }
      });
      for (var i = 0; i < fileFirstArray?.length; i++) {
        formData.append("fileFirst", fileFirstArray[i]);
      }
      if (ticketMessage?.length > 0) {
        formData.append("ticketMessage", JSON.stringify(ticketMessage));
      }
      this.facilitatorService
        .addpatientConfirmation(formData)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          let acknowledgementPayload = {
            eventName: "patientConfirmation",
            patient:
              this.chooseOptionSelectedControl?.value === "add"
                ? this.patientDataFromResponse?.patientId
                : this.choosedPatientFormControl?.value,
            // emailFrom: extractEmailFormMail(this.emailData?.from),
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
      this.messageFetchAssignConfirmationComponent.patientConfirmationForm.markAllAsTouched();
    }
  }

  // Vil methods and variables
  @ViewChild(MessageFetchAssignVilComponent)
  messageFetchAssignVilComponent!: MessageFetchAssignVilComponent;

  vilSubmit() {
    if (this.messageFetchAssignVilComponent.vilRequestForm.valid) {
      let formData = new FormData();
      let patientPassportMessage = [];
      let fileFirstArray = [];
      let attendantPassportMessage = [];
      let fileSecondArray = [];
      let donorPassportMessage = [];
      let fileThirdArray = [];
      let fileFirst = cloneDeep(
        this.messageFetchAssignVilComponent.fileFirstList
      );
      let fileSecond = cloneDeep(
        this.messageFetchAssignVilComponent.fileSecondList
      );
      let fileThird = cloneDeep(
        this.messageFetchAssignVilComponent.fileThirdList
      );
      let values =
        this.messageFetchAssignVilComponent.vilRequestForm.getRawValue();
      let payload = {
        patientName: values?.patientName,
        emailId: values?.emailId,
        contact: values?.contact,
        address: values?.address,
        // verifyAddress: values?.verifyAddress,
        givenName: values?.givenName,
        surName: values?.surName,
        gender: values?.gender,
        dob: values?.dob,
        addressInIndia: values?.addressInIndia,
        contactInIndia: values?.contactInIndia,
        country: values?.country,
        treatment: values?.treatment,
        department: values?.department,
        receivedAt: values?.receivedAt,
        passportNumber: values?.passportNumber,
        patient:
          this.chooseOptionSelectedControl?.value === "add"
            ? this.patientDataFromResponse?.patientId
            : this.choosedPatientFormControl?.value,
        doctorName: values?.doctorName,
        appointmentDate: values?.appointmentDate,
        // emailFrom: extractEmailFormMail(this.emailData?.from),
      };
      for (const key in payload) {
        formData.append(key, payload[key]);
      }
      // file first mapping
      fileFirst?.map((ff: any, index: number) => {
        if (!!ff?.signedUrl) {
          ff["filename"] = ff?.name;
          ff["path"] = ff?.url;
          delete ff["message_id"];
          delete ff["timestamp"];
          delete ff["name"];
          delete ff["originalname"];
          delete ff["signedUrl"];
          delete ff["type"];
          delete ff["url"];
          patientPassportMessage.push(ff);
        } else {
          fileFirstArray.push(ff);
        }
      });
      for (var i = 0; i < fileFirstArray?.length; i++) {
        formData.append("fileFirst", fileFirstArray[i]);
      }
      formData.append(
        "patientPassportMessage",
        JSON.stringify(patientPassportMessage)
      );
      // file first mapping end
      // file second mapping
      fileSecond?.map((fs: any, index: number) => {
        fs?.forEach((fse: any) => {
          if (!!fse?.signedUrl) {
            fse["filename"] = fse?.name;
            fse["path"] = fse?.url;
            delete fse["message_id"];
            delete fse["timestamp"];
            delete fse["name"];
            delete fse["originalname"];
            delete fse["signedUrl"];
            delete fse["type"];
            delete fse["url"];
            attendantPassportMessage.push(fse);
          } else {
            fileSecondArray.push(fse);
          }
        });
      });
      for (var i = 0; i < fileSecondArray?.length; i++) {
        formData.append("fileSecond", fileSecondArray[i]);
      }
      formData.append(
        "attendantPassportMessage",
        JSON.stringify(attendantPassportMessage)
      );
      // file second mapping end
      // file third mapping
      fileThird?.map((ft: any, index: number) => {
        ft?.forEach((fte: any) => {
          if (!!fte?.signedUrl) {
            fte["filename"] = fte?.name;
            fte["path"] = fte?.url;
            delete fte["message_id"];
            delete fte["timestamp"];
            delete fte["name"];
            delete fte["originalname"];
            delete fte["signedUrl"];
            delete fte["type"];
            delete fte["url"];
            donorPassportMessage.push(fte);
          } else {
            fileThirdArray.push(fte);
          }
        });
      });
      for (var i = 0; i < fileThirdArray?.length; i++) {
        formData.append("fileThird", fileThirdArray[i]);
      }
      formData.append(
        "donorPassportMessage",
        JSON.stringify(donorPassportMessage)
      );
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
      this.facilitatorService.addVilRequest(formData).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        let acknowledgementPayload = {
          eventName: "vilRequest",
          patient:
            this.chooseOptionSelectedControl?.value === "add"
              ? this.patientDataFromResponse?.patientId
              : this.choosedPatientFormControl?.value,
          // emailFrom: extractEmailFormMail(this.emailData?.from),
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
      this.messageFetchAssignVilComponent.vilRequestForm.markAllAsTouched();
    }
  }

  acknowledgementData: any;
  acknowledgementPopupByEvent(payload: any, values: any) {
    this.sharedService
      .acknowledgementPopupByEvent(payload)
      .subscribe((res: any) => {
        this.acknowledgementData = res?.data;
        if (!this.acknowledgementData?.found) {
          this.closeOverlay(true);
        } else {
          this.openAcknowledgePopup(payload, values);
          this.closeOverlay(true);
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
  @ViewChild(MessageFetchAddVilComponent)
  messageFetchAddVilComponent!: MessageFetchAddVilComponent;

  addVilSubmit() {
    if (this.messageFetchAddVilComponent.vilForm?.valid) {
      const {
        hospitalName,
        hospitalId,
        patient,
        vilId,
        // referenceNo,
        receivedAt,
      } = this.messageFetchAddVilComponent.vilForm?.getRawValue();

      let formData = new FormData();

      let paylaod = {
        hospitalName: hospitalName,
        hospitalId,
        patient,
        vilId,
        receivedAt,
        // referenceNo,
      };

      for (const key in paylaod) {
        formData.append(key, paylaod[key]);
      }

      // file first mapping
      let vilLetterMessage = [];
      let fileFirstArray = [];

      let fileFirst = cloneDeep(this.messageFetchAddVilComponent.fileList);

      fileFirst?.map((ff: any, index: number) => {
        if (!!ff?.signedUrl) {
          ff["filename"] = ff?.name;
          ff["path"] = ff?.url;
          delete ff["message_id"];
          delete ff["timestamp"];
          delete ff["name"];
          delete ff["originalname"];
          delete ff["signedUrl"];
          delete ff["type"];
          delete ff["url"];
          vilLetterMessage = [ff];
        } else {
          fileFirstArray = [ff];
        }
      });

      if (fileFirstArray?.length > 0) {
        formData.append("file", fileFirstArray?.[0]);
      }

      if (vilLetterMessage?.length > 0) {
        formData.append(
          "vilLetterMessage",
          JSON.stringify(vilLetterMessage[0])
        );
      }

      this.facilitatorService.vilReceived(formData).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.closeOverlay(true);
      });
    } else {
      this.messageFetchAddVilComponent.vilForm.markAllAsTouched();
    }
  }

  // add Opd
  @ViewChild(MessageFetchAddOpdComponent)
  messageFetchAddOpdComponent!: MessageFetchAddOpdComponent;

  addOpdSubmit() {
    if (this.messageFetchAddOpdComponent.opdForm?.valid) {
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
      } = this.messageFetchAddOpdComponent.opdForm?.getRawValue();

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

      this.facilitatorService.opdReceived(paylaod).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.closeOverlay(true);
        // localStorage.removeItem(`${this.patientData?._id}addOpdDraft`);
      });
    } else {
      this.messageFetchAddOpdComponent.opdForm.markAllAsTouched();
    }
  }

  // add Opinion
  @ViewChild(MessageFetchAddOpinionComponent)
  messageFetchAddOpinionComponent!: MessageFetchAddOpinionComponent;

  addOpinionSubmit() {
    if (this.messageFetchAddOpinionComponent.opinionForm?.valid) {
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
      } = this.messageFetchAddOpinionComponent.opinionForm?.getRawValue();

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
          // treatmentPackage: treatmentPackage ? treatmentPackage : null,
        },
        patient,
      };

      // console.log('paylaod',paylaod)
      this.facilitatorService.opinionReceived(paylaod).subscribe((res: any) => {
        this.sharedService.showNotification("snackBar-success", res.message);
        this.closeOverlay(true);
        // localStorage.removeItem(`${this.patientData?._id}addOpinionDraft`);
      });
    } else {
      this.messageFetchAddOpinionComponent.opinionForm.markAllAsTouched();
    }
  }

  @ViewChild(MessageFetchAddProformaComponent)
  messageFetchAddProformaComponent!: MessageFetchAddProformaComponent;

  addProformaSubmit() {
    if (this.messageFetchAddProformaComponent.proformaInvoceForm?.valid) {
      const { hospitalName, hospitalId, piId, patient, receivedAt } =
        this.messageFetchAddProformaComponent.proformaInvoceForm?.getRawValue();
      let formData = new FormData();

      let paylaod = {
        hospitalName: hospitalName,
        hospitalId,
        piId,
        receivedAt,
        patient,
      };

      for (const key in paylaod) {
        formData.append(key, paylaod[key]);
      }

      // file first mapping
      let proformaInvoice = [];
      let fileFirstArray = [];

      let fileFirst = cloneDeep(this.messageFetchAddProformaComponent.fileList);

      fileFirst?.map((ff: any, index: number) => {
        if (!!ff?.signedUrl) {
          ff["filename"] = ff?.name;
          ff["path"] = ff?.url;
          delete ff["message_id"];
          delete ff["timestamp"];
          delete ff["name"];
          delete ff["originalname"];
          delete ff["signedUrl"];
          delete ff["type"];
          delete ff["url"];
          proformaInvoice = [ff];
        } else {
          fileFirstArray = [ff];
        }
      });

      if (fileFirstArray?.length > 0) {
        formData.append("file", fileFirstArray?.[0]);
      }

      if (proformaInvoice?.length > 0) {
        formData.append(
          "proformaInvoiceMessage",
          JSON.stringify(proformaInvoice[0])
        );
      }

      this.facilitatorService
        .proformaInvoiceReceived(formData)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeOverlay();
        });
    } else {
      this.messageFetchAddProformaComponent.proformaInvoceForm.markAllAsTouched();
    }
  }
}
