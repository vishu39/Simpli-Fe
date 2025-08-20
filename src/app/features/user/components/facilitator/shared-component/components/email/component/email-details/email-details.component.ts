import { DatePipe } from "@angular/common";
import { Component, ElementRef, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { GET_URL_BASED_ON_LOGIN_TYPE } from "src/app/shared/routing-constant";
import tippy, { Instance } from "tippy.js";
import { AddPatientEmailFetchComponent } from "../../dialog/add-patient-email-fetch/add-patient-email-fetch.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "shared-email-details",
  templateUrl: "./email-details.component.html",
  styleUrls: ["./email-details.component.scss"],
})
export class EmailDetailsComponent implements OnInit {
  id: string = "";
  lastEmailPage: number = 1;

  private tooltipInstance!: Instance;

  constructor(
    private route: ActivatedRoute,
    private facilitatorService: FacilitatorService,
    private router: Router,
    private datePipe: DatePipe,
    private sharedService: SharedService,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe((res: any) => {
      this.id = res.id;
    });
    this.route.queryParams.subscribe((res: any) => {
      this.lastEmailPage = res?.page;
    });
  }

  ngOnInit(): void {
    this.getEmailFetch();
  }

  reload() {
    this.getEmailFetch();
  }

  startingUrl = GET_URL_BASED_ON_LOGIN_TYPE();
  navigateback() {
    this.router.navigate([`${this.startingUrl}/email-fetch`], {
      queryParams: { page: this.lastEmailPage },
    });
  }

  isEmailLoading: boolean = true;
  emailData: any = [];

  getEmailFetch() {
    this.emailData = [];
    this.isEmailLoading = true;
    this.facilitatorService.getEmailFetch(this.id).subscribe(
      (res: any) => {
        this.emailData = res?.data;
        this.getUnreadEmailFetchCount();
        this.sharedService.mailUnreadCountSubject.next(true);
        this.isEmailLoading = false;
      },
      () => {
        this.isEmailLoading = false;
      }
    );
  }

  totalUnreadMessage = 0;
  getUnreadEmailFetchCount() {
    this.facilitatorService.getUnreadEmailFetchCount().subscribe((res: any) => {
      this.totalUnreadMessage = res?.data?.count;
    });
  }

  getNameFromMail(nameString: string) {
    // const regex = /"([^"]+)"/;
    // const match = nameString.match(regex);
    // if (match && match[1]) {
    //   return match?.[1];
    // } else {
    //   return "NIL";
    // }
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
<div><strong>to:</strong> ${
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

    // console.log(name);
    // console.log(email);

    // return `${name} ${email}`;
    return name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  openAddPatientModal() {
    this.overlayVisible = true;
  }

  overlayVisible: boolean = false;
  closeOverlay() {
    this.overlayVisible = false;
  }

  replyToAllVisible: boolean = false;
  replyToAll() {
    this.replyToAllVisible = true;
  }

  closeReplyToAll() {
    this.replyToAllVisible = false;
  }
}
