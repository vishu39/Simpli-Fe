import { Component, OnInit } from "@angular/core";
import { DirectionService } from "src/app/core/service/direction.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { RouteInfo } from "src/app/layout/sidebar/sidebar.metadata";
import { hospitalAdminUserType, role } from "src/app/core/models/role";
import { SocketService } from "src/app/core/service/socket.service";
import {
  commonAccountRoutes,
  commonRoutes,
  routeForBranchOffice,
  routeForDoctor,
  routeForReferral,
} from "./routes";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";

@Component({
  selector: "app-internal-user-main-layout",
  templateUrl: "./internal-user-main-layout.component.html",
  styleUrls: ["./internal-user-main-layout.component.scss"],
})
export class InternalUserMainLayoutComponent implements OnInit {
  direction: string;
  public config: any = {};
  decodedToken: any = this.sharedService.decodeToken();
  userType = hospitalAdminUserType;
  private socket;

  referralPartnerArray = [
    this.userType.referralPartner,
    this.userType.referralDoctor,
    this.userType.insurance,
    this.userType.corporate,
  ];

  constructor(
    private directoryService: DirectionService,
    private sharedService: SharedService,
    private socketService: SocketService,
    private hospitalService: HospitalService
  ) {
    this.socketService.subscribeToNotifications();

    this.socket = this.socketService.getSocket();
    this.socket.emit("addUserFE", {
      id: this.decodedToken["userId"],
      adminId: this.decodedToken["adminId"],
    });
    this.socket.on("sendCommentToFE", (data) => {
      console.log("data", data);
      let decryptData = this.sharedService.decrypt(data);
      this.sharedService.realTimeNotificationSubject.next(decryptData);
    });

    // socket for badge start
    this.socket.on("sendEmailFetchToFE", (data) => {
      let decodedData = sharedService.decrypt(data);
      this.getUnreadEmailFetchCount();
    });

    this.sharedService.mailUnreadCountSubject.subscribe((res: any) => {
      if (!!res) {
        this.getUnreadEmailFetchCount();
      }
    });
    // socket for badge end

    if (this.referralPartnerArray.includes(this.decodedToken.userType)) {
      this.ROUTES = routeForReferral;
    } else if (this.userType.branchOffice === this.decodedToken.userType) {
      this.ROUTES = routeForBranchOffice;
    } else if (this.userType.treatingDoctor === this.decodedToken.userType) {
      this.ROUTES = routeForDoctor;
    } else {
      this.ROUTES = [
        ...commonRoutes,
        {
          path: "",
          title: "Account Settings",
          iconType: "material-icons-two-tone",
          icon: "settings_suggest",
          class: "menu-toggle",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [...commonAccountRoutes],
        },
      ];
    }

    this.directoryService.currentData.subscribe((currentData) => {
      if (currentData) {
        this.direction = currentData;
      } else {
        if (localStorage.getItem("isRtl")) {
          if (localStorage.getItem("isRtl") === "true") {
            this.direction = "rtl";
          } else if (localStorage.getItem("isRtl") === "false") {
            this.direction = "ltr";
          }
        } else {
          if (this.config.layout.rtl == true) {
            this.direction = "rtl";
          } else {
            this.direction = "ltr";
          }
        }
      }
    });
  }
  ngOnInit(): void {
    if (this.userType.treatingDoctor !== this.decodedToken.userType) {
      this.getUnreadEmailFetchCount();
    }
  }

  totalUnreadMessage = 0;
  getUnreadEmailFetchCount() {
    this.hospitalService.getUnreadEmailFetchCount().subscribe((res: any) => {
      this.totalUnreadMessage = res?.data?.count;
      this.ROUTES[8].badge = `${this.totalUnreadMessage}`;
    });
  }

  ROUTES: RouteInfo[] = [];
}
