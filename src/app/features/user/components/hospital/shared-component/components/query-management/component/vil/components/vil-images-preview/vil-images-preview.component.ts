import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

import { cloneDeep } from "lodash";

@Component({
  selector: "app-vil-images-preview",
  templateUrl: "./vil-images-preview.component.html",
  styleUrls: ["./vil-images-preview.component.scss"],
})
export class VilImagesPreviewComponent implements OnInit {
  @Input() fileList: any = [];
  @Input() filePreviewList: any = [];
  @Input() type: string;
  @Input() className: string;
  @Input() vilData: any;
  @Input() patientData: string;
  @Output("mainRefetch") mainRefetch: EventEmitter<any> = new EventEmitter();
  @Input() remove = false;
  @Output("onDelete") onDelete: EventEmitter<any> = new EventEmitter();

  selectedUploadedClass: string;
  selectedUploaderClass: string;

  vilImageArray: any = [];

  passport: any = [];
  attendant: any = [];
  donor: any = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.type == "fileUploaded") {
      this.fileList?.map((file: any) => {
        file["url"] = file?.signedUrl;
        file["type"] = file?.mimetype;
        file["name"] = file?.originalname;
      });
    }

    if (this.vilData?.patientPassport?.length) {
      this.passport = cloneDeep(this.vilData?.patientPassport);
      this.passport?.map((file: any) => {
        file["url"] = file?.signedUrl;
        file["type"] = file?.mimetype;
        file["name"] = file?.originalname;
      });
      this.vilImageArray.push(...this.passport);
    }
    if (this.vilData?.attendantPassport?.length) {
      this.attendant = cloneDeep(this.vilData?.attendantPassport);
      this.attendant?.map((file: any) => {
        file["url"] = file?.signedUrl;
        file["type"] = file?.mimetype;
        file["name"] = file?.originalname;
      });
      this.vilImageArray.push(...this.attendant);
    }
    if (this.vilData?.donorPassport?.length) {
      this.donor = cloneDeep(this.vilData?.donorPassport);
      this.donor?.map((file: any) => {
        file["url"] = file?.signedUrl;
        file["type"] = file?.mimetype;
        file["name"] = file?.originalname;
      });
      this.vilImageArray.push(...this.donor);
    }
  }

  ngOnInit() {}

  isLightBox: boolean = false;
  lightBoxData: any;
  openLightBox($event: any, data: any[], item: any) {
    let i = this.vilImageArray?.findIndex((vd: any) => vd?.url === item?.url);
    if (i !== -1) {
      this.lightBoxData = { data: this.vilImageArray, i, $event };
      this.isLightBox = true;
    }
  }

  closeLightBox({ $event, eventType }) {
    if (eventType == "CLOSE") this.isLightBox = false;
  }

  downloadImage(image: any, name: string) {
    window.open(image, "_blank");
  }

  removeFile(i: number) {
    this.onDelete.emit(i);
  }

  refetch() {
    this.isLightBox = false;
    this.mainRefetch.emit();
  }
}
