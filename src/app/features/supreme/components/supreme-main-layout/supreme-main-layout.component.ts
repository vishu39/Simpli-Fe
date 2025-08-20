import { Component, OnInit } from "@angular/core";
import { DirectionService } from "src/app/core/service/direction.service";
import { RouteInfo } from "src/app/layout/sidebar/sidebar.metadata";

@Component({
  selector: "app-supreme-main-layout",
  templateUrl: "./supreme-main-layout.component.html",
  styleUrls: ["./supreme-main-layout.component.scss"],
})
export class SupremeMainLayoutComponent implements OnInit {
  direction: string;
  public config: any = {};
  constructor(private directoryService: DirectionService) {
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
    // localStorage.setItem("isSupreme", "true");
  }

  ROUTES: RouteInfo[] = [
    {
      path: "/supreme/admin/dashboard",
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
      path: "/supreme/admin/customer",
      title: "Customer",
      iconType: "material-icons-two-tone",
      icon: "savings",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    {
      path: "/supreme/admin/hospital-password",
      title: "Hospital Password",
      iconType: "material-icons-two-tone",
      icon: "lock",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    {
      path: "/supreme/admin/hospital-template",
      title: "Hospital Template",
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
      path: "/supreme/admin/on-premise-user",
      title: "On Premise User",
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
      path: "/supreme/admin/user",
      title: "User",
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
      path: "/supreme/admin/user-permission",
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
      path: "",
      title: "Email Content",
      iconType: "material-icons-two-tone",
      icon: "mail",
      class: "ml-sub-menu",
      active: false,
      groupTitle: false,
      badge: "",
      badgeClass: "",
      submenu: [
        {
          path: "/supreme/admin/email-content-facilitator",
          title: "Email Content Facilitator",
          iconType: "",
          icon: "",
          class: "ml-menu2",
          groupTitle: false,
          active: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/supreme/admin/email-content-hospital",
          title: "Email Content Hospital",
          iconType: "",
          icon: "",
          class: "ml-menu2",
          groupTitle: false,
          active: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
      ],
    },

    {
      path: "",
      title: "Message Content",
      iconType: "material-icons-two-tone",
      icon: "message",
      class: "ml-sub-menu",
      active: false,
      groupTitle: false,
      badge: "",
      badgeClass: "",
      submenu: [
        {
          path: "/supreme/admin/message-content-facilitator",
          title: "Message Content Facilitator",
          iconType: "",
          icon: "",
          class: "ml-menu2",
          groupTitle: false,
          active: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/supreme/admin/message-content-hospital",
          title: "Message Content Hospital",
          iconType: "",
          icon: "",
          class: "ml-menu2",
          groupTitle: false,
          active: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
      ],
    },

    // {
    //   path: "/supreme/admin/email-content-facilitator",
    //   title: "Email Content Facilitator",
    //   iconType: "material-icons-two-tone",
    //   icon: "mail",
    //   class: "",
    //   groupTitle: false,
    //   active: false,
    //   badge: "",
    //   badgeClass: "",
    //   submenu: [],
    // },
    // {
    //   path: "/supreme/admin/email-content-hospital",
    //   title: "Email Content Hospital",
    //   iconType: "material-icons-two-tone",
    //   icon: "mail",
    //   class: "",
    //   groupTitle: false,
    //   active: false,
    //   badge: "",
    //   badgeClass: "",
    //   submenu: [],
    // },
    {
      path: "/supreme/admin/hospital-staff",
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
      path: "/supreme/admin/hospital-communication",
      title: "Hospital Communication",
      iconType: "material-icons-two-tone",
      icon: "forward_to_inbox",
      class: "",
      groupTitle: false,
      active: false,
      badge: "",
      badgeClass: "",
      submenu: [],
    },
    {
      path: "",
      title: "Partner Communication",
      iconType: "material-icons-two-tone",
      icon: "mail",
      class: "ml-sub-menu",
      active: false,
      groupTitle: false,
      badge: "",
      badgeClass: "",
      submenu: [
        {
          path: "/supreme/admin/referral-partner-staff",
          title: "Staff",
          iconType: "",
          icon: "",
          class: "ml-menu2",
          groupTitle: false,
          active: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
        {
          path: "/supreme/admin/referral-partner-zone",
          title: "Zone",
          iconType: "",
          icon: "",
          class: "ml-menu2",
          groupTitle: false,
          active: false,
          badge: "",
          badgeClass: "",
          submenu: [],
        },
      ],
    },
  ];
}
