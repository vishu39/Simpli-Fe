import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
  Input,
} from "@angular/core";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { loginType } from "src/app/core/constant";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SidebarService } from "src/app/core/service/sidebar-service.service";
@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() public sidebarItems: any[];
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  userFullName: string;
  userImg: string;
  userType: string;
  headerHeight = 60;
  currentRoute: string;
  routerObj = null;
  activate = false;
  accountDetailsData: any;
  isLoading = true;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private router: Router,
    private facilitatorService: FacilitatorService,
    private hospitalService: HospitalService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private sidebarService: SidebarService
  ) {
    const body = this.elementRef.nativeElement.closest("body");
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, "overlay-open");
      }
    });
  }
  tokenData: any = this.sharedService.decodeToken();

  @HostListener("window:resize", ["$event"])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);

    // setTimeout(() => {
    //   const isShrunk =
    //     this.document.body.classList.contains("side-closed") ||
    //     this.document.body.classList.contains("submenu-closed");
    //   this.sidebarService.setSidebarShrunk(isShrunk);
    //   console.log("Sidebar shrunk state:", isShrunk);
    // }, 0);
  }
  @HostListener("document:mousedown", ["$event"])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, "overlay-open");
    }
  }

  callToggleMenu(event: any, length: any) {
    if (length > 0) {
      const parentElement = event.target.closest("li");
      const activeClass = parentElement.classList.contains("active");

      if (activeClass) {
        this.renderer.removeClass(parentElement, "active");
      } else {
        this.renderer.addClass(parentElement, "active");
      }
    }
  }
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
    this.sidebarItems.map((obj) => {
      obj.active = false;
    });
    let snapShot = this.activatedRoute.snapshot["_routerState"].url;
    this.sidebarItems.map((obj) => {
      if (obj.path == snapShot) {
        obj.active = true;
      }
    });
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
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
  ngOnDestroy() {
    this.routerObj.unsubscribe();
  }
  initLeftSidebar() {
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + "";
    this.listMaxWidth = "500px";
  }
  isOpen() {
    return this.bodyTag.classList.contains("overlay-open");
  }
  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, "ls-closed");
      this.sidebarService.setSidebarShrunk(true);
    } else {
      this.renderer.removeClass(this.document.body, "ls-closed");
      this.sidebarService.setSidebarShrunk(false);
    }
  }
  mouseHover(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("submenu-closed")) {
      this.renderer.addClass(this.document.body, "side-closed-hover");
      this.renderer.removeClass(this.document.body, "submenu-closed");
      this.sidebarService.setSidebarShrunk(false);
    }
  }
  mouseOut(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("side-closed-hover")) {
      this.renderer.removeClass(this.document.body, "side-closed-hover");
      this.renderer.addClass(this.document.body, "submenu-closed");
      this.sidebarService.setSidebarShrunk(true);
    }
  }
  logout() {
    this.sharedService.logout();
  }
  getLink(data) {
    this.sidebarItems.map((obj) => {
      obj.active = false;
    });
    data.active = true;
  }
}
