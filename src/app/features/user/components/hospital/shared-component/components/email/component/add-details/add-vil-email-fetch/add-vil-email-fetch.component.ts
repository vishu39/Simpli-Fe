import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import * as moment from "moment";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { GET_DIRECT_SIMILARITY_FOR_ARRAY_OF_OBJ } from "src/app/shared/util";

@Component({
  selector: "app-add-vil-email-fetch",
  templateUrl: "./add-vil-email-fetch.component.html",
  styleUrls: ["./add-vil-email-fetch.component.scss"],
})
export class AddVilEmailFetchComponent implements OnInit {
  @Input() patientId: string;
  @Input() emailFetchData: any;
  isLoadingRequest = false;
  vilForm: FormGroup;
  request: any = [];
  title = "";
  uploadedDoc: any = [];

  constructor(
    private hospitalService: HospitalService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getVilPendingRequest();
    this.buildForm();
    this.getAddVilDataByEmailFetch();
    // this.patchFormIfEdit();
  }

  addDataFromAi: any;
  addObjFromAi: any;
  isAiLoading = true;
  getAddVilDataByEmailFetch() {
    this.isAiLoading = true;
    this.hospitalService
      .getAddVilDataByEmailFetch(this.emailFetchData?._id)
      .subscribe(
        (res: any) => {
          this.addDataFromAi = res?.data;
          if (this.addDataFromAi?.attachment?.length > 0) {
            this.addDataFromAi?.attachment?.map((file: any) => {
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
      patient: this.patientId,
      referenceNo: data?.referenceNo || "",
      receivedAt: !!receivedAtDate ? receivedAtDate.toISOString() : "",
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
      referenceNo: ["", [Validators.required]],
      vilId: ["", [Validators.required]],
      receivedAt: [
        {
          value: "",
          disabled: true,
        },
      ],
      patient: [this.patientId, [Validators.required]],
    });
  }

  getVilPendingRequest() {
    this.isLoadingRequest = true;
    this.hospitalService
      .getPendingVilRequest(this.patientId)
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
    if (this.addDataFromAi?.attachment?.length > 0) {
      currentFile = this.fileList?.[0];
      if (!!currentFile) {
        this.addDataFromAi?.attachment.push(currentFile);
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
    if (this.addDataFromAi?.attachment?.length > 0) {
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
      if (this.addDataFromAi?.attachment?.length > 0) {
        let findIndex = this.addDataFromAi?.attachment?.findIndex(
          (att: any) => att?.signedUrl === droppedData?.signedUrl
        );
        if (findIndex !== -1) {
          this.addDataFromAi?.attachment?.splice(findIndex, 1);
        }
        if (!!currentFile) {
          this.addDataFromAi?.attachment.push(currentFile);
        }
      }
    }
  }
}
