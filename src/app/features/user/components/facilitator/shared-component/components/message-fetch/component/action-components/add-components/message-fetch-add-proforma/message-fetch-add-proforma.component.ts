import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ } from "src/app/shared/util";

@Component({
  selector: "app-message-fetch-add-proforma",
  templateUrl: "./message-fetch-add-proforma.component.html",
  styleUrls: ["./message-fetch-add-proforma.component.scss"],
})
export class MessageFetchAddProformaComponent implements OnInit {
  isLoadingRequest = false;
  proformaInvoceForm: FormGroup;
  request: any = [];
  title = "";
  uploadedDoc: any = [];

  @Input() messageData: any;
  @Input() emailFetchData: any;

  constructor(
    private faciliatorService: FacilitatorService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getPendingProformaInvoiceRequest();
    this.getAddVilDataByMessageFetch();
    this.buildForm();

    this.messageData?.messageData.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    let receivedAtDate = moment(this.messageData?.messageData[0]?.timestamp);
    this.proformaInvoceForm.patchValue({
      receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
    });
  }

  addDataFromAi: any;
  addObjFromAi: any;
  isAiLoading = true;
  getAddVilDataByMessageFetch() {
    this.isAiLoading = true;
    let bodyArray: any = [];
    if (this.messageData?.messageData?.length > 0) {
      this.messageData?.messageData?.forEach((md: any) => {
        if (md?.message_type === "chat" || md?.body) {
          bodyArray.push(md?.body);
        }
      });
    }

    this.faciliatorService
      .getAddVilDataByMessageFetch({ message: bodyArray })
      .subscribe(
        (res: any) => {
          this.addDataFromAi = res?.data;
          if (this.messageData?.attachments?.length > 0) {
            this.messageData?.attachments?.map((file: any) => {
              file["url"] = file?.signedUrl;
              file["type"] = file?.mimetype;
              file["name"] = file?.originalname;
            });
          }

          this.addObjFromAi = this.addDataFromAi?.vilData;
          this.isAiLoading = false;
          this.fetchDataFromAi(this.addObjFromAi);
        },
        () => {
          this.isAiLoading = false;
        }
      );
  }

  fetchDataFromAi(data: any) {
    let receivedAtDate = moment(this.emailFetchData?.date);
    this.proformaInvoceForm.patchValue({
      patient: this.emailFetchData?._id,
      // receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
    });

    let hospitalObj: any;

    if (!!data?.hospitalName) {
      hospitalObj = GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ(
        data?.hospitalName,
        this.request,
        "addVil"
      );
    }

    if (!!hospitalObj?.hospitalName) {
      this.onClickHospital(hospitalObj);
    }
  }

  patchFormIfEdit(data: any) {
    const { hospitalName, hospitalId, receivedAt, piId, proformaInvoice } =
      data;
    this.proformaInvoceForm.patchValue({
      hospitalId: hospitalId,
      hospitalName: hospitalName,
      receivedAt: receivedAt,
      piId: piId,
      patient: this.emailFetchData?._id,
      file: proformaInvoice,
    });
    this.proformaInvoceForm.get("hospitalName").disabled;
    this.uploadedDoc = [proformaInvoice];
  }

  buildForm() {
    this.proformaInvoceForm = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
      file: [[], [Validators.required]],
      receivedAt: [
        {
          value: "",
          disabled: true,
        },
      ],
      piId: ["", [Validators.required]],
      patient: [this.emailFetchData?._id, [Validators.required]],
    });
  }

  getPendingProformaInvoiceRequest() {
    this.isLoadingRequest = true;
    this.faciliatorService
      .getPendingProformaInvoiceRequest(this.emailFetchData?._id)
      .subscribe((res: any) => {
        this.isLoadingRequest = false;
        this.request = res?.data;
      });
  }

  onClickHospital(item: any) {
    this.proformaInvoceForm.patchValue({
      hospitalName: item?.hospitalName,
      hospitalId: item?.hospitalId,
      piId: item?.piId,
    });
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

    let currentFile: any;
    if (this.messageData?.attachments?.length > 0) {
      currentFile = this.fileList?.[0];
      if (!!currentFile) {
        this.messageData?.attachments.push(currentFile);
      }
    }
    this.fileList = [file];
  }

  // image preview function
  isLightBox: boolean = false;
  lightBoxData: any;
  openLightBox($event: any, data: any[], i: number) {
    this.lightBoxData = { data, i, $event };
    this.isLightBox = true;
  }

  closeLightBox({ $event, eventType }) {
    if (eventType == "CLOSE") this.isLightBox = false;
  }

  downloadImage(image: any, name: string) {
    window.open(image, "_blank");
  }

  getDocIcon(file: any) {
    let imageType = "";
    if (file.name.includes(".doc")) {
      imageType = "word";
    } else if (file.name.includes(".xlsx") || file.name.includes(".xls")) {
      imageType = "excel";
    } else if (file.name.includes(".zip")) {
      imageType = "zip";
    }
    return `/assets/images/icons/${imageType}.png`;
  }

  getRandomDocImage() {
    return `/assets/images/icons/unknown.png`;
  }

  onFileDrop(event: CdkDragDrop<any>) {
    let id = event?.container?.id;
    let droppedData = event?.item?.data;

    let currentFile: any;
    if (this.messageData?.attachments?.length > 0) {
      if (!!this.fileList?.[0]?.signedUrl) {
        currentFile = this.fileList?.[0];
      }
    }

    if (id === "fileFirst") {
      this.fileList[0] = droppedData;

      this.proformaInvoceForm.patchValue({
        file: droppedData,
      });
      this.proformaInvoceForm.controls["file"].markAsTouched();
      this.proformaInvoceForm.controls["file"].markAsDirty();
      this.proformaInvoceForm.controls["file"].updateValueAndValidity();

      // remove file from attachments
      if (this.messageData?.attachments?.length > 0) {
        let findIndex = this.messageData?.attachments?.findIndex(
          (att: any) => att?.signedUrl === droppedData?.signedUrl
        );
        if (findIndex !== -1) {
          this.messageData?.attachments?.splice(findIndex, 1);
        }
        if (!!currentFile) {
          this.messageData?.attachments.push(currentFile);
        }
      }
    }
  }
}
