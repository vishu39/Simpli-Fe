import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "shared-whatsapp-fetch-image-previewer",
  templateUrl: "./whatsapp-fetch-image-previewer.component.html",
  styleUrls: ["./whatsapp-fetch-image-previewer.component.scss"],
})
export class WhatsappFetchImagePreviewerComponent implements OnInit {
  @Input() fileList: any = [];
  @Input() filePreviewList: any = [];
  @Input() type: string;
  @Input() remove = true;
  @Output("onDelete") onDelete: EventEmitter<any> = new EventEmitter();
  @Input() className: string;
  @Input() mode: string;
  @Output("onFileRead") onFileRead: EventEmitter<any> = new EventEmitter();
  @Input() isTypeCommonWhatsapp: boolean = false;
  @Input() attachments: any = [];

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
    if (!this.isTypeCommonWhatsapp) {
      this.lightBoxData = { data, i, $event };
      this.isLightBox = true;
    } else {
      let findIndex = this.attachments?.findIndex(
        (a: any) => a?.signedUrl === data[i]?.signedUrl
      );
      this.lightBoxData = { data: this.attachments, i: findIndex, $event };
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

  readFile(i: number, item: any) {
    let uploadType: any;
    if (!!item?.signedUrl) {
      uploadType = "fileUploaded";
    } else {
      uploadType = "fileUploader";
    }
    this.onFileRead.emit({ i, item, uploadType });
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
}
