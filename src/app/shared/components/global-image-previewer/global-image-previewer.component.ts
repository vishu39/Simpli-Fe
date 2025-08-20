import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

import FileSaver from "file-saver";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-global-image-preview",
  templateUrl: "./global-image-previewer.component.html",
  styleUrls: ["./global-image-previewer.component.scss"],
})
export class GlobalImagePreviewerComponent implements OnInit, OnChanges {
  @Input() fileList: any = [];
  @Input() filePreviewList: any = [];
  @Input() type: string;
  @Input() remove = true;
  @Output("onDelete") onDelete: EventEmitter<any> = new EventEmitter();
  @Input() className: string;

  @Input() mode: string= "";
   @Output("onFileRead") onFileRead: EventEmitter<any> = new EventEmitter();

  selectedUploadedClass: string;
  selectedUploaderClass: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.type == "fileUploaded") {
      this.fileList?.map((file: any) => {
        file["url"] = file?.signedUrl;
        file["type"] = file?.mimetype;
        file["name"] = file?.originalname;
      });
    }
  }

  ngOnInit() {}

  isLightBox: boolean = false;
  lightBoxData: any;
  openLightBox($event: any, data: any[], i: number) {
    // let newArray = cloneDeep(data);
    // let fileListForLightbox = [];
    // newArray.map((val: any) => {
    //   if (val.type.includes("application") && val.type !== "application/pdf") {
    //   } else {
    //     fileListForLightbox.push(val);
    //   }
    // });
    this.lightBoxData = { data, i, $event };
    this.isLightBox = true;
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

  getDocIcon(file: any) {
    let imageType = "";
    if (file.name.includes(".doc")) {
      imageType = "word";
    } else if (file.name.includes(".xlsx") || file.name.includes(".xls")) {
      imageType = "excel";
    } else if (file.name.includes(".zip")) {
      imageType = "zip";
    }
    return `../../../../assets/images/icons/${imageType}.png`;
  }

  getRandomDocImage() {
    return `../../../../assets/images/icons/unknown.png`;
  }

    readFile(i: number, item: any) {
    this.onFileRead.emit({ i, item });
  }
}
