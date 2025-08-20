import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import * as moment from "moment";
import { cloneDeep } from "lodash";

@Component({
  selector: "shared-common-selected-whatsapp-message",
  templateUrl: "./common-selected-whatsapp-message.component.html",
  styleUrls: ["./common-selected-whatsapp-message.component.scss"],
})
export class CommonSelectedWhatsappMessageComponent implements OnInit {
  @Input() messageData: any;
  @Input() selectedProfile: any;
  constructor() {}

  clonedAttachment: any = [];
  clonedMessages: any = [];

  ngOnInit(): void {
    this.scrollToBottom();
    this.messageData?.messageData.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
    this.messageData?.attachments.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    this.clonedAttachment = cloneDeep(this.messageData?.attachments);
    this.clonedMessages = cloneDeep(this.messageData?.messageData);
  }

  @ViewChild("scrollMe") private myScrollContainer: ElementRef;
  scrollCalled: boolean = false;
  isScrollWorking = false;
  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop =
          this.myScrollContainer.nativeElement.scrollHeight;
        this.scrollCalled = true;
        this.isScrollWorking = false;
      } catch (err) {}
    }, 100);
  }

  parseMessage(message: string): string {
    if (!message) return "";
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    message = message.replace(
      urlPattern,
      (url) => `<a href="${url}" target="_blank">${url}</a>`
    );

    message = message.replace(/\n/g, "<br>");
    message = message
      .replace(/\*(.*?)\*/g, "<b>$1</b>")
      .replace(/_(.*?)_/g, "<i>$1</i>");

    return message;
  }

  // date label function start
  // Check if the date label should be shown
  shouldShowDateLabel(index: number): boolean {
    if (index === 0) {
      return true;
    }

    const currentMessageDate = this.getTimeStampInDateFormat(
      this.clonedMessages[index]?.timestamp
    );
    const previousMessageDate = this.getTimeStampInDateFormat(
      this.clonedMessages[index - 1]?.timestamp
    );

    return currentMessageDate !== previousMessageDate;
  }

  getTimeStampInDateFormat(timeStamp: any) {
    let date = new Date(timeStamp);
    return date.toISOString().split("T")[0];
  }

  getFormattedDate(timestamp: Date): string {
    const date = moment(timestamp);
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "days").startOf("day");

    if (date.isSame(today, "day")) {
      return "Today";
    } else if (date.isSame(yesterday, "day")) {
      return "Yesterday";
    } else if (date.isAfter(today.clone().subtract(6, "days"))) {
      return date.format("dddd"); // Returns weekday name (e.g., "Monday")
    } else {
      return date.format("DD/MM/YYYY"); // Formats as date (e.g., "01/01/2024")
    }
  }
}
