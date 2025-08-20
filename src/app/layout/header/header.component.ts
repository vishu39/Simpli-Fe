import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  AfterViewInit,
  Input,
} from "@angular/core";
import { Router } from "@angular/router";
import { ConfigService } from "src/app/config/config.service";
import { RightSidebarService } from "src/app/core/service/rightsidebar.service";
import { LanguageService } from "src/app/core/service/language.service";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { cloneDeep } from "lodash";
import { AddCommentsDialogComponent } from "src/app/features/user/components/facilitator/shared-component/components/operation-board/dialog/add-comments-dialog/add-comments-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { loginType } from "src/app/core/constant";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";
import { hospitalAdminUserType } from "src/app/core/models/role";
import { FormControl } from "@angular/forms";
import { SubjectService } from "src/app/core/service/subject/subject.service";
import { SidebarService } from "src/app/core/service/sidebar-service.service";
const document: any = window.document;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit, AfterViewInit
{
  @Input("class") panelClass: string;
  public config: any = {};
  userImg: string;
  isNavbarCollapsed = true;
  flagvalue;
  countryName;
  langStoreValue: string;
  defaultFlag: string;
  isOpenSidebar: boolean;
  accountDetailsData: any;
  isLoading = true;
  tokenData: any = this.sharedService.decodeToken();

  chatArray = [];
  isCommentLoading: boolean = false;
  totalChatElement: number;
  commentParams = {
    page: 1,
    limit: 10,
    search: "",
    isNotification: true,
  };
  timeoutComment = null;

  location = window.location.href;
  isSupreme = this.location.includes("supreme");

  loginType = GET_LOGIN_TYPE();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private rightSidebarService: RightSidebarService,
    private configService: ConfigService,
    private router: Router,
    public languageService: LanguageService,
    private facilitatorService: FacilitatorService,
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private subjectService: SubjectService,
    private sidebarService: SidebarService
  ) {
    super();

    this.sharedService.realTimeNotificationSubject.subscribe((pn: any) => {
      if (!!pn) {
        this.chatArray.unshift(pn);
        this.getUnReadCommentCount();
      }
    });
    this.sharedService.unreadCommentSubject.subscribe((unread: boolean) => {
      if (unread) {
        this.getUnReadCommentCount();
        this.chatArray = [];
        this.commentParams.page = 1;
        this.getComment();
      }
    });
  }

  listLang = [
    { text: "English", flag: "assets/images/flags/us.svg", lang: "en" },
    { text: "Spanish", flag: "assets/images/flags/spain.svg", lang: "es" },
    { text: "German", flag: "assets/images/flags/germany.svg", lang: "de" },
  ];

  ngOnInit() {
    if (this.tokenData?.userType) {
      let login = loginType();
      if (login === "hospital") {
        this.getAccountDetailsAttributeForHospital();
      } else if (login === "facilitator") {
        this.getAccountDetailsAttributeForFacilitator();
      }
    } else {
      this.isLoading = false;
    }
    this.config = this.configService.configData;
    this.langStoreValue = localStorage.getItem("lang");
    const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.defaultFlag = "assets/images/flags/us.svg";
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }

    if (!this.isSupreme && this.tokenData?.userType !== "treating doctor") {
      this.getComment();
      this.getUnReadCommentCount();
    }

    // email communication
    if (
      !this.isSupreme &&
      this.emailCommunicationShowArray?.includes(this.tokenData?.userType)
    ) {
      let login = loginType();
      if (login === "hospital") {
        this.getEmailCommunicationDefaultEmailForHospital(
          this.tokenData?.userId
        );
        this.sharedService.emailCommunicationChangedSubjectForHospital.subscribe(
          (res: any) => {
            if (res?.isChanged) {
              this.getEmailCommunicationDefaultEmailForHospital(
                this.tokenData?.userId
              );
            }
          }
        );
      } else if (login === "facilitator") {
        this.getEmailCommunicationDefaultEmailForFacilitator(
          this.tokenData?.userId
        );

        this.sharedService.emailCommunicationChangedSubjectForFacilitator.subscribe(
          (res: any) => {
            if (res?.isChanged) {
              this.getEmailCommunicationDefaultEmailForFacilitator(
                this.tokenData?.userId
              );
            }
          }
        );
      }
    }

    // message communication
    if (
      !this.isSupreme &&
      this.messageCommunicationShowArray?.includes(this.tokenData?.userType)
    ) {
      let login = loginType();
      if (login === "hospital") {
        this.getMessageCommunicationDefaultMessageForHospital(
          this.tokenData?.userId
        );
        this.subjectService.messageCommunicationChangedSubjectForHospital.subscribe(
          (res: any) => {
            if (res?.isChanged) {
              this.getMessageCommunicationDefaultMessageForHospital(
                this.tokenData?.userId
              );
            }
          }
        );
      } else if (login === "facilitator") {
        this.getMessageCommunicationDefaultMessageForFacilitator(
          this.tokenData?.userId
        );

        this.subjectService.messageCommunicationChangedSubjectForFacilitator.subscribe(
          (res: any) => {
            if (res?.isChanged) {
              this.getMessageCommunicationDefaultMessageForFacilitator(
                this.tokenData?.userId
              );
            }
          }
        );
      }
    }
  }

  // email communication linking start

  choosedDefaultCommunicationEmailControl: any = new FormControl(null, []);
  emailCommunicationShowArray = [
    hospitalAdminUserType.branchOffice,
    hospitalAdminUserType.employee,
    "admin",
  ];

  emailSettingByUserData: any = [];
  emailCommunicationDefaultEmailData: any = [];

  getAllEmailSettingByUserForHospital(id: any) {
    this.hospitalService.getAllEmailSettingByUser(id).subscribe(
      (res: any) => {
        this.emailSettingByUserData = res?.data;
        if (!!this.emailCommunicationDefaultEmailData?._id) {
          this.selectDefaultCommunicationEmail();
        }
      },
      (err) => {}
    );
  }

  getEmailCommunicationDefaultEmailForHospital(id: any) {
    this.hospitalService.getEmailCommunicationDefaultEmail(id).subscribe(
      (res: any) => {
        this.emailCommunicationDefaultEmailData = res?.data;
        this.getAllEmailSettingByUserForHospital(this.tokenData?.userId);
      },
      (err) => {
        this.getAllEmailSettingByUserForHospital(this.tokenData?.userId);
      }
    );
  }

  getAllEmailSettingByUserForFacilitator(id: any) {
    this.facilitatorService.getAllEmailSettingByUser(id).subscribe(
      (res: any) => {
        this.emailSettingByUserData = res?.data;
        if (!!this.emailCommunicationDefaultEmailData?._id) {
          this.selectDefaultCommunicationEmail();
        }
      },
      (err) => {}
    );
  }

  getEmailCommunicationDefaultEmailForFacilitator(id: any) {
    this.facilitatorService.getEmailCommunicationDefaultEmail(id).subscribe(
      (res: any) => {
        this.emailCommunicationDefaultEmailData = res?.data;
        this.getAllEmailSettingByUserForFacilitator(this.tokenData?.userId);
      },
      (err) => {
        this.getAllEmailSettingByUserForFacilitator(this.tokenData?.userId);
      }
    );
  }

  selectDefaultCommunicationEmail() {
    let defaultEmailIndex = this.emailSettingByUserData?.findIndex(
      (item: any) =>
        item?._id === this.emailCommunicationDefaultEmailData?.defaultEmail
    );

    if (defaultEmailIndex !== -1) {
      this.choosedDefaultCommunicationEmailControl.setValue(
        this.emailSettingByUserData[defaultEmailIndex]?.emailId
      );
    } else {
      this.choosedDefaultCommunicationEmailControl.setValue("");
    }
  }

  onDefalutEmailSelectionChange(event: any) {
    let { value } = event;
    let selectedEmailObj = this.emailSettingByUserData?.find(
      (item: any) => item?.emailId === value
    );
    let payload = {
      user: this.tokenData?.userId,
      defaultEmail: selectedEmailObj?._id,
    };

    let login = loginType();
    if (login === "hospital") {
      this.submitDefaultCommunicationForHospital(
        payload,
        this.emailCommunicationDefaultEmailData
      );
    } else if (login === "facilitator") {
      this.submitDefaultCommunicationForFacilitator(
        payload,
        this.emailCommunicationDefaultEmailData
      );
    }
  }

  submitDefaultCommunicationForHospital(payload: any, selectedEmailObj: any) {
    if (!this.emailCommunicationDefaultEmailData?._id) {
      this.hospitalService
        .addEmailCommunicationDefaultEmail(payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.sharedService.emailCommunicationChangedSubjectForHospital.next({
            isChanged: true,
          });
        });
    } else {
      this.hospitalService
        .editEmailCommunicationDefaultEmail(payload, selectedEmailObj?._id)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.sharedService.emailCommunicationChangedSubjectForHospital.next({
            isChanged: true,
          });
        });
    }
  }

  submitDefaultCommunicationForFacilitator(
    payload: any,
    selectedEmailObj: any
  ) {
    if (!this.emailCommunicationDefaultEmailData?._id) {
      this.facilitatorService
        .addEmailCommunicationDefaultEmail(payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.sharedService.emailCommunicationChangedSubjectForFacilitator.next(
            {
              isChanged: true,
            }
          );
        });
    } else {
      this.facilitatorService
        .editEmailCommunicationDefaultEmail(payload, selectedEmailObj?._id)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.sharedService.emailCommunicationChangedSubjectForFacilitator.next(
            {
              isChanged: true,
            }
          );
        });
    }
  }

  // email communication linking end
  // message communication linking start

  choosedDefaultCommunicationMessageControl: any = new FormControl(null, []);
  messageCommunicationShowArray = [
    hospitalAdminUserType.branchOffice,
    hospitalAdminUserType.employee,
    "admin",
  ];

  messageSettingByUserData: any = [];
  messageCommunicationDefaultMessageData: any = [];

  getAllMessageSettingByUserForHospital(id: any) {
    this.hospitalService.getAllMessageSettingByUser(id).subscribe(
      (res: any) => {
        this.messageSettingByUserData = res?.data;
        if (!!this.messageCommunicationDefaultMessageData?._id) {
          this.selectDefaultCommunicationMessage();
        }
      },
      (err) => {}
    );
  }

  getMessageCommunicationDefaultMessageForHospital(id: any) {
    this.hospitalService.getMessageCommunicationDefaultMessage(id).subscribe(
      (res: any) => {
        this.messageCommunicationDefaultMessageData = res?.data;
        this.getAllMessageSettingByUserForHospital(this.tokenData?.userId);
      },
      (err) => {
        this.getAllMessageSettingByUserForHospital(this.tokenData?.userId);
      }
    );
  }

  getAllMessageSettingByUserForFacilitator(id: any) {
    this.facilitatorService.getAllMessageSettingByUser(id).subscribe(
      (res: any) => {
        this.messageSettingByUserData = res?.data;
        if (!!this.messageCommunicationDefaultMessageData?._id) {
          this.selectDefaultCommunicationMessage();
        }
      },
      (err) => {}
    );
  }

  getMessageCommunicationDefaultMessageForFacilitator(id: any) {
    this.facilitatorService.getMessageCommunicationDefaultMessage(id).subscribe(
      (res: any) => {
        this.messageCommunicationDefaultMessageData = res?.data;
        this.getAllMessageSettingByUserForFacilitator(this.tokenData?.userId);
      },
      (err) => {
        this.getAllMessageSettingByUserForFacilitator(this.tokenData?.userId);
      }
    );
  }

  selectDefaultCommunicationMessage() {
    let defaultMessageIndex = this.messageSettingByUserData?.findIndex(
      (item: any) =>
        item?._id ===
        this.messageCommunicationDefaultMessageData?.defaultMessage
    );

    if (defaultMessageIndex !== -1) {
      this.choosedDefaultCommunicationMessageControl.setValue(
        this.messageSettingByUserData[defaultMessageIndex]?.messageId
      );
    } else {
      this.choosedDefaultCommunicationMessageControl.setValue("");
    }
  }

  onDefalutMessageSelectionChange(event: any) {
    let { value } = event;
    let selectedMessageObj = this.messageSettingByUserData?.find(
      (item: any) => item?.messageId === value
    );
    let payload = {
      user: this.tokenData?.userId,
      defaultMessage: selectedMessageObj?._id,
    };

    let login = loginType();
    if (login === "hospital") {
      this.submitDefaultMessageCommunicationForHospital(
        payload,
        this.messageCommunicationDefaultMessageData
      );
    } else if (login === "facilitator") {
      this.submitDefaultMessageCommunicationForFacilitator(
        payload,
        this.messageCommunicationDefaultMessageData
      );
    }
  }

  submitDefaultMessageCommunicationForHospital(
    payload: any,
    selectedMessageObj: any
  ) {
    if (!this.messageCommunicationDefaultMessageData?._id) {
      this.hospitalService
        .addMessageCommunicationDefaultMessage(payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.subjectService.messageCommunicationChangedSubjectForHospital.next(
            {
              isChanged: true,
            }
          );
        });
    } else {
      this.hospitalService
        .editMessageCommunicationDefaultMessage(
          payload,
          selectedMessageObj?._id
        )
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.subjectService.messageCommunicationChangedSubjectForHospital.next(
            {
              isChanged: true,
            }
          );
        });
    }
  }

  submitDefaultMessageCommunicationForFacilitator(
    payload: any,
    selectedMessageObj: any
  ) {
    if (!this.messageCommunicationDefaultMessageData?._id) {
      this.facilitatorService
        .addMessageCommunicationDefaultMessage(payload)
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.subjectService.messageCommunicationChangedSubjectForFacilitator.next(
            {
              isChanged: true,
            }
          );
        });
    } else {
      this.facilitatorService
        .editMessageCommunicationDefaultMessage(
          payload,
          selectedMessageObj?._id
        )
        .subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res?.message);
          this.subjectService.messageCommunicationChangedSubjectForFacilitator.next(
            {
              isChanged: true,
            }
          );
        });
    }
  }

  // // email communication linking end

  login_type = loginType();

  totalUnreadComments: number;

  getUnReadCommentCount() {
    if (this.login_type === "facilitator") {
      this.facilitatorService.getUnReadCommentCount().subscribe((res: any) => {
        this.totalUnreadComments = res?.data;
      });
    }
    if (this.login_type === "hospital") {
      this.hospitalService.getUnReadCommentCount().subscribe((res: any) => {
        this.totalUnreadComments = res?.data;
      });
    }
  }

  getComment() {
    this.isCommentLoading = true;

    if (this.login_type === "facilitator") {
      this.facilitatorService.getAllComment(this.commentParams).subscribe(
        (res: any) => {
          let data = res?.data;
          this.chatArray.push(...data?.content);
          this.commentParams.page = this.commentParams.page + 1;
          this.totalChatElement = data?.totalElement;
          this.isCommentLoading = false;
          this.sharedService.unreadCommentSubject.next(false);
        },
        (err) => {
          this.isCommentLoading = false;
        }
      );
    }
    if (this.login_type === "hospital") {
      this.hospitalService.getAllComment(this.commentParams).subscribe(
        (res: any) => {
          let data = res?.data;
          this.chatArray.push(...data?.content);
          this.commentParams.page = this.commentParams.page + 1;
          this.totalChatElement = data?.totalElement;
          this.isCommentLoading = false;
          this.sharedService.unreadCommentSubject.next(false);
        },
        (err) => {
          this.isCommentLoading = false;
        }
      );
    }
  }

  onInfiniteScrollComment(): void {
    if (!this.isCommentLoading) {
      if (this.chatArray.length < this.totalChatElement) {
        this.getComment();
      }
    }
  }

  isCommentRead(data: any) {
    let userData: any = this.sharedService.decodeToken();
    let index = data?.findIndex((d: any) => userData?.userId === d?.userId);
    let obj = data?.[index];
    if (obj?.isRead) {
      return true;
    } else {
      return false;
    }
  }

  openCommentModal(item: any) {
    const dialogRef = this.dialog.open(AddCommentsDialogComponent, {
      width: "100%",
      disableClose: true,
      autoFocus: false,
      data: {
        itemData: item,
        title: "Querry",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getUnReadCommentCount();
      this.commentParams.page = 1;
      this.chatArray = []; // Clear existing data when searching
      this.isCommentLoading = false;
      this.getComment();
    });
  }

  getAccountDetailsAttributeForFacilitator() {
    this.isLoading = true;
    this.facilitatorService
      .getAccountDetailsAttribute()
      .subscribe((res: any) => {
        this.accountDetailsData = res.data;
        this.isLoading = false;
      });
  }

  getAccountDetailsAttributeForHospital() {
    this.isLoading = true;
    this.hospitalService.getAccountDetailsAttribute().subscribe((res: any) => {
      this.accountDetailsData = res.data;
      this.isLoading = false;
    });
  }
  ngAfterViewInit() {
    // set theme on startup
    if (localStorage.getItem("theme")) {
      this.renderer.removeClass(this.document.body, this.config.layout.variant);
      this.renderer.addClass(this.document.body, localStorage.getItem("theme"));
    } else {
      this.renderer.addClass(this.document.body, this.config.layout.variant);
    }

    if (localStorage.getItem("menuOption")) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem("menuOption")
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        "menu_" + this.config.layout.sidebar.backgroundColor
      );
    }

    if (localStorage.getItem("choose_logoheader")) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem("choose_logoheader")
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        "logo-" + this.config.layout.logo_bg_color
      );
    }

    if (localStorage.getItem("sidebar_status")) {
      if (localStorage.getItem("sidebar_status") === "close") {
        this.renderer.addClass(this.document.body, "side-closed");
        this.renderer.addClass(this.document.body, "submenu-closed");
      } else {
        this.renderer.removeClass(this.document.body, "side-closed");
        this.renderer.removeClass(this.document.body, "submenu-closed");
      }
    } else {
      if (this.config.layout.sidebar.collapsed === true) {
        this.renderer.addClass(this.document.body, "side-closed");
        this.renderer.addClass(this.document.body, "submenu-closed");
      }
    }
  }
  callFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
    this.languageService.setLanguage(lang);
  }
  mobileMenuSidebarOpen(event: any, className: string) {
    const hasClass = event.target.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains("side-closed");
    if (hasClass) {
      this.renderer.removeClass(this.document.body, "side-closed");
      this.renderer.removeClass(this.document.body, "submenu-closed");
      this.sidebarService.setSidebarShrunk(false);
    } else {
      this.renderer.addClass(this.document.body, "side-closed");
      this.renderer.addClass(this.document.body, "submenu-closed");
      this.sidebarService.setSidebarShrunk(true);
    }
  }
  logout() {
    this.sharedService.logout();
  }
}
