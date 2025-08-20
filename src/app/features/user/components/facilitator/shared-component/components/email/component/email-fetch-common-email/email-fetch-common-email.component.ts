import { Component, Input, OnInit } from "@angular/core";
import tippy, { Instance } from "tippy.js";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-email-fetch-common-email",
  templateUrl: "./email-fetch-common-email.component.html",
  styleUrls: ["./email-fetch-common-email.component.scss"],
})
export class EmailFetchCommonEmailComponent implements OnInit {
  @Input() emailData: any;

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {}

  // emailDetails methods
  getNameFromMail(nameString: string) {
    const regex = /"([^"]+)"/;
    const match = nameString.match(regex);
    if (match && match[1]) {
      return nameString.replace(/"/g, "");
    } else {
      return nameString.replace(/</g, "").replace(/>/g, "").replace(/"/g, "");
    }
  }

  extractEmail(emailString: string): string {
    const emailPattern = /<([^>]+)>/;
    const match = emailString.match(emailPattern);
    return match ? match[0] : "";
  }

  showTooltip(tooltipButton: any) {
    const eventDetails = this.getEventDetails();

    let tooltipInstance: any = tippy(tooltipButton._elementRef.nativeElement, {
      content: eventDetails,
      trigger: "manual",
      placement: "bottom",
      theme: "custom",
      allowHTML: true,
      delay: [0, 0],
      duration: [0, 0],
      onShow(instance) {
        instance.popper.style.backgroundColor = "white";
        instance.popper.style.color = "black";
        instance.popper.style.border = "1px solid lightgrey";
        instance.popper.style.borderRadius = "8px";
        instance.popper.style.padding = "12px";
        instance.popper.style.width = "400px";
      },
    });

    tooltipInstance.show();
  }

  getEventDetails() {
    const escapeHtml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    return `
<div><strong>from:</strong> ${escapeHtml(this.emailData?.from)}</div>
<div><strong>to:</strong>  ${
      this.emailData?.to ? escapeHtml(this.emailData?.to) : "NIL"
    }</div>
<div><strong>cc:</strong> ${
      this.emailData?.cc ? escapeHtml(this.emailData?.cc) : "NIL"
    }</div>
<div><strong>date:</strong> ${this.datePipe.transform(
      this.emailData?.date,
      "EEE, MMM d, hh:mm a"
    )}</div>
<div><strong>subject:</strong> ${this.emailData?.subject || "NIL"}</div>
    `;
  }

  getCcOrBcc(data: any) {
    let mailArray = data?.split(",");

    let newArray = [];
    mailArray.forEach((element) => {
      newArray.push(this.getNameAndMail(element));
    });
    return newArray.join(", ");
  }

  getNameAndMail(data: any) {
    let name = this.getNameFromMail(data);
    let email = this.extractEmail(data)
      .replace(/"/g, "")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}
