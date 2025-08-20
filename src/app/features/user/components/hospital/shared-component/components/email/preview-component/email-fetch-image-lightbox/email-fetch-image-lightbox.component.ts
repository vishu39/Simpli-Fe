import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-email-fetch-image-lightbox",
  templateUrl: "./email-fetch-image-lightbox.component.html",
  styleUrls: ["./email-fetch-image-lightbox.component.scss"],
})
export class EmailFetchImageLightboxComponent implements OnInit {
  @Input("isLightbox") isLightboxOpen: any;
  @Input("lightBoxData") lightBoxData: any[];
  @Output("lightBoxEvent") lightBoxEvent: EventEmitter<any> =
    new EventEmitter();
  @Input() hostElement: ElementRef;

  dataArray: any[];
  index: number;
  imgUrl: any;
  type: any;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dataArray = changes.lightBoxData.currentValue?.data;
    this.index = changes.lightBoxData.currentValue?.i;
    this.type = this.dataArray[this.index].type;
  }
  getSource() {
    return this.dataArray[this.index].url;
  }
  emitLightBoxEvent($event, type) {
    let data = { $event: $event, eventType: type };
    this.lightBoxEvent.emit(data);
  }
  next() {
    this.index++;
    if (this.index > this.dataArray.length - 1) this.index = 0;
    this.type = this.dataArray[this.index].type;
  }
  pre() {
    this.index--;
    if (this.index == -1) this.index = this.dataArray.length - 1;
    this.type = this.dataArray[this.index].type;
  }
  rotateL() {
    const image = document.getElementById("lightbox-image") as HTMLImageElement;
    image.style.transform += "rotate(-90deg)";
  }
  rotateR() {
    const image = document.getElementById("lightbox-image") as HTMLImageElement;
    image.style.transform += "rotate(90deg)";
  }
  zoomIn(): void {
    const image = document.getElementById("lightbox-image") as HTMLImageElement;
    image.style.transform += "scale(1.1)";
  }
  zoomOut(): void {
    const image = document.getElementById("lightbox-image") as HTMLImageElement;
    image.style.transform += "scale(0.9)";
  }
}
