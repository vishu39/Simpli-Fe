import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ } from "src/app/shared/util";
import { cloneDeep } from "lodash";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";

@Component({
  selector: "app-message-fetch-add-vil",
  templateUrl: "./message-fetch-add-vil.component.html",
  styleUrls: ["./message-fetch-add-vil.component.scss"],
})
export class MessageFetchAddVilComponent implements OnInit {
  @Input() messageData: any;
  @Input() emailFetchData: any;
  isLoadingRequest = false;
  vilForm: FormGroup;
  request: any = [];
  title = "";
  uploadedDoc: any = [];

  constructor(
    private facilitatorService: FacilitatorService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.messageData.attachments = cloneDeep(this.messageData?.mainAttachments);
    this.getVilPendingRequest();
    this.buildForm();
    this.getAddVilDataByMessageFetch();

    this.messageData?.messageData.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    let receivedAtDate = moment(this.messageData?.messageData[0]?.timestamp);
    this.vilForm.patchValue({
      receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
    });
    // this.patchFormIfEdit();
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

    this.facilitatorService
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
    this.vilForm.patchValue({
      patient: this.emailFetchData?._id,
      // referenceNo: data?.referenceNo || "",
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

  buildForm() {
    this.vilForm = this.fb.group({
      hospitalId: ["", [Validators.required]],
      hospitalName: ["", [Validators.required]],
      file: ["", [Validators.required]],
      // referenceNo: ["", [Validators.required]],
      vilId: ["", [Validators.required]],
      receivedAt: [
        {
          value: "",
          disabled: true,
        },
      ],
      patient: [this.emailFetchData?._id, [Validators.required]],
    });
  }

  getVilPendingRequest() {
    this.isLoadingRequest = true;
    this.facilitatorService
      .getPendingVilRequest(this.emailFetchData?._id)
      .subscribe((res: any) => {
        this.isLoadingRequest = false;
        this.request = res?.data;
      });
  }

  onClickHospital(item: any) {
    this.vilForm.patchValue({
      hospitalName: item?.hospitalName,
      hospitalId: item?.hospitalId,
      vilId: item?.vilId,
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

      this.vilForm.patchValue({
        file: droppedData,
      });
      this.vilForm.controls["file"].markAsTouched();
      this.vilForm.controls["file"].markAsDirty();
      this.vilForm.controls["file"].updateValueAndValidity();

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
