import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SocketService } from "src/app/core/service/socket.service";
import { EmailFetchFilterModalComponent } from "src/app/shared/components/dialogs/email-fetch/email-fetch-filter-modal/email-fetch-filter-modal.component";
import { GET_URL_BASED_ON_LOGIN_TYPE } from "src/app/shared/routing-constant";

@Component({
  selector: "shared-inbox",
  templateUrl: "./inbox.component.html",
  styleUrls: ["./inbox.component.scss"],
})
export class InboxComponent implements OnInit {
  private socket;

  theme = localStorage.getItem("theme");

  selectedEmailFetchList: any = [];

  constructor(
    private hospitalService: HospitalService,
    private router: Router,
    private socketService: SocketService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    // this.socketService.subscribeToNotifications();

    this.socket = this.socketService.getSocket();
    const tokenData = this.sharedService.decodeToken();
    this.socket.emit("addUserFE", {
      id: tokenData["userId"],
      adminId: tokenData["adminId"],
    });
    this.socket.on("sendEmailFetchToFE", (data) => {
      let decodedData = sharedService.decrypt(data);
      this.allEmailFetchData.unshift(decodedData?.emailFetch);
      this.sharedService.mailUnreadCountSubject.next(true);
      this.getUnreadEmailFetchCount();
    });

    this.sharedService.themeSubject.subscribe((res: any) => {
      this.theme = res;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((res: any) => {
      if (!!res?.page) {
        this.emailFetchParams.page = +res?.page;
      }
    });

    this.selectedEmailFetchList = localStorage.getItem(
      "selectedEmailFetchList"
    );

    if (
      this.selectedEmailFetchList !== null &&
      this.selectedEmailFetchList !== undefined
    ) {
      if (this.selectedEmailFetchList?.length > 0) {
        this.selectedEmailFetchList = JSON.parse(this.selectedEmailFetchList);
        this.emailFetchParams.origin = this.selectedEmailFetchList;
      } else {
        this.emailFetchParams.origin = [];
      }
    }

    this.router.navigate([], { queryParams: {} });
    this.getUnreadEmailFetchCount();
    this.getAllEmailFetch();
  }

  reload() {
    this.getAllEmailFetch();
    this.getUnreadEmailFetchCount();
    this.sharedService.mailUnreadCountSubject.next(true);
  }

  emailFetchParams = {
    limit: 10,
    page: 1,
    search: "",
    origin: [],
  };

  isEmailLoading: boolean = true;
  allEmailFetchData: any = [];
  totalElement: any = 0;

  totalNumberOfPages = 0;

  getAllEmailFetch() {
    this.allEmailFetchData = [];
    this.isEmailLoading = true;
    this.hospitalService.getAllEmailFetch(this.emailFetchParams).subscribe(
      (res: any) => {
        this.allEmailFetchData = res?.data?.content;
        this.totalElement = res?.data?.totalElement;

        this.calculateTotalPages();
        this.isEmailLoading = false;
      },
      () => {
        this.isEmailLoading = false;
      }
    );
  }

  totalUnreadMessage = 0;
  getUnreadEmailFetchCount() {
    this.hospitalService.getUnreadEmailFetchCount().subscribe((res: any) => {
      this.totalUnreadMessage = res?.data?.count;
    });
  }

  calculateTotalPages() {
    this.totalNumberOfPages = Math.ceil(
      this.totalElement / this.emailFetchParams.limit
    );
  }

  getNameFromMail(nameString: string, emailData: any) {
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
      return match?.[1];
    } else {
      return nameString?.replace(/</g, "")?.replace(/>/g, "");
    }
  }

  extractEmail(emailString: string): string {
    const emailPattern = /<([^>]+)>/;
    const match = emailString.match(emailPattern);
    return match ? match[0] : "";
  }

  next() {
    this.emailFetchParams.page = this.emailFetchParams?.page + 1;
    if (this.emailFetchParams?.page <= this.totalNumberOfPages) {
      this.getAllEmailFetch();
    } else {
      this.emailFetchParams.page = this.totalNumberOfPages;
    }
  }

  prev() {
    if (this.emailFetchParams?.page > 1) {
      this.emailFetchParams.page = this.emailFetchParams?.page - 1;
      this.getAllEmailFetch();
    }
  }

  fetchFileNameFromKey(key: string) {
    const indexOfZ = key.indexOf("Z");
    const fileName = key.substring(indexOfZ + 1);
    return fileName;
  }

  startingUrl = GET_URL_BASED_ON_LOGIN_TYPE();
  navigateToDetails(id: string) {
    this.router.navigate([`${this.startingUrl}/email-fetch/${id}`], {
      queryParams: {
        page: this.emailFetchParams.page,
      },
    });
  }

  getDisplayedFiles(files: any) {
    return files.slice(0, 2);
  }

  getRemainingCount(files: any): number {
    return files.length - 2;
  }

  timeoutMail = null;
  serchValue(filterValue: string) {
    clearTimeout(this.timeoutMail);
    this.timeoutMail = setTimeout(() => {
      this.emailFetchParams.search = filterValue.trim();
      this.emailFetchParams.page = 1;
      this.getAllEmailFetch();
    }, 600);
  }

  fetchFile(key: string) {
    const data = {
      key: key,
    };
    this.sharedService.getS3Object(data).subscribe((res: any) => {
      window.open(res.data);
    });
  }

  checkTodayDate(date: any) {
    let todatDate = moment().date();
    let mailDate = moment(date).date();
    if (todatDate === mailDate) return true;
    else return false;
  }

  isOriginFilterOpen = false;
  selectedOrigin: any = [];

  openFilterModal() {
    const dialogRef = this.dialog.open(EmailFetchFilterModalComponent, {
      width: "40%",
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.componentInstance.openedComponent = "hospital";
    dialogRef.componentInstance.selectedFilter = {
      origin: this.selectedEmailFetchList,
    };

    dialogRef.afterClosed().subscribe((result) => {
      const { apiCall, filteredData } = result;
      if (apiCall) {
        const { origin } = filteredData;
        if (origin?.length > 0) {
          this.emailFetchParams.page = 1;
          this.emailFetchParams.origin = origin;
          this.allEmailFetchData = [];
          this.getAllEmailFetch();
          localStorage.setItem(
            "selectedEmailFetchList",
            JSON.stringify(origin)
          );
          this.selectedEmailFetchList = origin;
        } else {
          this.emailFetchParams.origin = [];
          this.emailFetchParams.page = 1;
          this.allEmailFetchData = [];
          this.selectedEmailFetchList = origin;
          localStorage.setItem("selectedEmailFetchList", JSON.stringify([]));
          this.getAllEmailFetch();
        }
      }
    });
  }
}
