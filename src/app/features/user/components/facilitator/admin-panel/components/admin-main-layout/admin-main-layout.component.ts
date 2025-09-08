import { Component, OnInit } from "@angular/core";
import { DirectionService } from "src/app/core/service/direction.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { SocketService } from "src/app/core/service/socket.service";
import { RouteInfo } from "src/app/layout/sidebar/sidebar.metadata";
@Component({
  selector: "app-admin-main-layout",
  templateUrl: "./admin-main-layout.component.html",
  styleUrls: ["./admin-main-layout.component.scss"],
})
export class AdminMainLayoutComponent implements OnInit {
  direction: string;
  public config: any = {};
  private socket;

  constructor(
    private directoryService: DirectionService,
    private socketService: SocketService,
    private sharedService: SharedService,
    private facilitatorService: FacilitatorService
  ) {
    this.socketService.subscribeToNotifications();

    this.socket = this.socketService.getSocket();
    const tokenData: any = this.sharedService.decodeToken();
    this.socket.emit("addUserFE", {
      id: tokenData["userId"],
      adminId: tokenData["adminId"],
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

    // if (tokenData.roleName === "fac" || tokenData.roleName==='Magnus Admin') {
    //   this.ROUTES.splice(1, 0,
    //     {
    //     path: "/user/facilitator/admin/analytics-dashboard",
    //     title: "Analytics Dashboard",
    //     iconType: "material-icons-two-tone",
    //     icon: "bar_chart",
    //     class: "",
    //     groupTitle: false,
    //     active: false,
    //     badge: "",
    //     badgeClass: "",
    //     submenu: [],
    //   }
    // );
    // }

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
    this.getUnreadEmailFetchCount();
  }

  totalUnreadMessage = 0;
  getUnreadEmailFetchCount() {
    this.facilitatorService.getUnreadEmailFetchCount().subscribe((res: any) => {
      this.totalUnreadMessage = res?.data?.count;
      let findIndex = this.ROUTES.findIndex(
        (r: any) => r.path === "/user/facilitator/admin/email-fetch"
      );
      let index = findIndex !== -1 ? findIndex : 8;
      // this.ROUTES[8].badge = `${this.totalUnreadMessage}`;
      this.ROUTES[index].badge = `${this.totalUnreadMessage}`;
    });
  }

  ROUTES: RouteInfo[] = [
    {
      path: "/user/facilitator/admin/dashboard",
      title: "Dashboard",
      iconType: "material-icons-two-tone",
      icon: "dashboard",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    {
      path: "/user/facilitator/admin/internal-user",
      title: "Internal User",
      iconType: "material-icons-two-tone",
      icon: "person_add",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    {
      path: "/user/facilitator/admin/doctor",
      title: "Doctors",
      iconType: "material-icons-two-tone",
      icon: "vaccines",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    {
      path: "/user/facilitator/admin/hospital",
      title: "Hospital",
      iconType: "material-icons-two-tone",
      icon: "local_hospital",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    {
      path: "/user/facilitator/admin/patient",
      title: "Patient",
      iconType: "material-icons-two-tone",
      icon: "personal_injury",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    // {
    //   path: "/user/facilitator/admin/operation-board",
    //   title: "Operation Board",
    //   iconType: "material-icons-two-tone",
    //   icon: "developer_board",
    //   class: "",
    //   groupTitle: false,
    //   active: false,
    //   badge: "",
    //   badgeClass: "",
    //   submenu: [],
    // },
    {
      path: "/user/facilitator/admin/query-management",
      title: "Query Management",
      iconType: "material-icons-two-tone",
      icon: "emergency",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    {
      path: "/user/facilitator/admin/operation-board",
      title: "Operation Board",
      iconType: "material-icons-two-tone",
      icon: "chat_bubble_outline",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    {
      path: "",
      title: "Finance",
      iconType: "material-icons-two-tone",
      icon: "money",
      class: "menu-toggle",
      active: false,
      groupTitle: false,
      badge: "",
      badgeClass: "",
      submenu: [
        {
          path: "/user/facilitator/admin/finance/master-settings",
          title: "Master Settings",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/finance/billing-entries",
          title: "Billing Entries",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/finance/logs",
          title: "Logs",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
      ],
    },
    {
      path: "/user/facilitator/admin/email-fetch",
      title: "Email Fetch",
      iconType: "material-icons-two-tone",
      icon: "email",
      class: "",
      groupTitle: false,
      active: false,
      badge: "0",
      badgeClass: "badge customBlueBadgeColor sidebar-badge float-end",
      submenu: [],
    },
    {
      path: "/user/facilitator/admin/message-fetch",
      title: "Message Fetch",
      iconType: "material-icons-two-tone",
      icon: "chat",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "badge customBlueBadgeColor sidebar-badge float-end",
      submenu: [],
    },
    {
      path: "/user/facilitator/admin/calendar",
      title: "Calendar",
      iconType: "material-icons-two-tone",
      icon: "event_note",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },

    {
      path: "/user/facilitator/admin/report",
      title: "Report",
      iconType: "material-icons-two-tone",
      icon: "description",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    {
      path: "/user/facilitator/admin/hospital-staff",
      title: "Hospital Staff",
      iconType: "material-icons-two-tone",
      icon: "badge",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    {
      path: "/user/facilitator/admin/user-permission",
      title: "User Permission",
      iconType: "material-icons-two-tone",
      icon: "admin_panel_settings",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    {
      path: "/user/facilitator/admin/error-log",
      title: "Error Log",
      iconType: "material-icons-two-tone",
      icon: "assignment_late",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
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
      submenu: [
        {
          path: "/user/facilitator/admin/account/account-details",
          title: "Account Details",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/template-setting",
          title: "Template Setting",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/auto-reminder-setting",
          title: "Auto Reminder Setting",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/acknowledgement-setting",
          title: "Acknowledgement Setting",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/followup-setting",
          title: "Follow Up Setting",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/email-fetch-setting",
          title: "Email Fetch Setting",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        // {
        //   path: "/user/facilitator/admin/account/email-setting",
        //   title: "Email Setting",
        //   iconType: "",
        //   icon: "",
        //   class: "ml-menu",
        //   active: false,
        //   groupTitle: false,
        //   badge: "",
        //   badgeClass: "",
        //   submenu: [],
        // },
        {
          path: "",
          title: "Email Communication",
          iconType: "",
          icon: "",
          class: "ml-sub-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [
            {
              path: "/user/facilitator/admin/account/email-communication/email-host",
              title: "Email Host",
              iconType: "",
              icon: "",
              class: "ml-menu2",
              active: false,
              groupTitle: false,
              badge: "",
              badgeClass: "",
              submenu: [],
            },
            {
              path: "/user/facilitator/admin/account/email-communication/default-email",
              title: "Default Email",
              iconType: "",
              icon: "",
              class: "ml-menu2",
              active: false,
              groupTitle: false,
              badge: "",
              badgeClass: "",
              submenu: [],
            },
          ],
        },
        {
          path: "",
          title: "Message Communication",
          iconType: "",
          icon: "",
          class: "ml-sub-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [
            {
              path: "/user/facilitator/admin/account/message-communication/message-host",
              title: "Message Host",
              iconType: "",
              icon: "",
              class: "ml-menu2",
              active: false,
              groupTitle: false,
              badge: "",
              badgeClass: "",
              submenu: [],
            },
            {
              path: "/user/facilitator/admin/account/message-communication/default-message",
              title: "Default Message",
              iconType: "",
              icon: "",
              class: "ml-menu2",
              active: false,
              groupTitle: false,
              badge: "",
              badgeClass: "",
              submenu: [],
            },
          ],
        },
        {
          path: "/user/facilitator/admin/account/query-view-setting",
          title: "Query View Setting",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/email-send-setting",
          title: "Email Send Setting",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/message-send-setting",
          title: "Message Send Setting",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/comment-setting",
          title: "Comment Setting",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/communication-setting",
          title: "Communication Setting",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/notification-setting",
          title: "Notification Setting",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/email-content",
          title: "Email Content",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/message-content",
          title: "Message Content",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },

        {
          path: "/user/facilitator/admin/account/hospital-communication",
          title: "Hospital Communication",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "",
          title: "Partner Communication",
          iconType: "",
          icon: "",
          class: "ml-sub-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [
            {
              path: "/user/facilitator/admin/account/referral-partner-communication/pre-staff",
              title: "Pre Staff",
              iconType: "",
              icon: "",
              class: "ml-menu2",
              active: false,
              groupTitle: false,
              badge: "",
              badgeClass: "",
              submenu: [],
            },
            {
              path: "/user/facilitator/admin/account/referral-partner-communication/pre-zone",
              title: "Pre Zone",
              iconType: "",
              icon: "",
              class: "ml-menu2",
              active: false,
              groupTitle: false,
              badge: "",
              badgeClass: "",
              submenu: [],
            },
            {
              path: "/user/facilitator/admin/account/referral-partner-communication/own-staff",
              title: "Own Staff",
              iconType: "",
              icon: "",
              class: "ml-menu2",
              active: false,
              groupTitle: false,
              badge: "",
              badgeClass: "",
              submenu: [],
            },
            {
              path: "/user/facilitator/admin/account/referral-partner-communication/own-zone",
              title: "Own Zone",
              iconType: "",
              icon: "",
              class: "ml-menu2",
              active: false,
              groupTitle: false,
              badge: "",
              badgeClass: "",
              submenu: [],
            },
          ],
        },
        {
          path: "/user/facilitator/admin/account/top-hospital",
          title: "Top Hospital",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/user-profile",
          title: "User Profile",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/user/facilitator/admin/account/change-password",
          title: "Change Password",
          iconType: "",
          icon: "",
          class: "ml-menu",
          active: false,
          groupTitle: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
      ],
    },
  ];
}
