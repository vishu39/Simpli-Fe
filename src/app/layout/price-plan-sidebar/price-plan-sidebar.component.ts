import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  AfterViewInit,
  Renderer2,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ConfigService } from "src/app/config/config.service";
import { RightSidebarService } from "src/app/core/service/rightsidebar.service";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { DirectionService } from "src/app/core/service/direction.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import * as moment from "moment";
import { timeStamp } from "console";
@Component({
  selector: "app-price-plan-sidebar",
  templateUrl: "./price-plan-sidebar.component.html",
  styleUrls: ["./price-plan-sidebar.component.scss"],
})
export class PricePlanSidebarComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  selectedBgColor = "white";
  maxHeight: string;
  maxWidth: string;
  showpanel = false;
  isOpenSidebar: boolean;
  isDarkSidebar = false;
  isDarTheme = false;
  isRtl = false;
  public config: any = {};
  customerPlan: any;
  plan: any;
  customerFeature: any;
  customerUserFeatureLicence: any;
  customerReferralFeatureLicence: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private rightSidebarService: RightSidebarService,
    private configService: ConfigService,
    private directionService: DirectionService,
    private sharedService: SharedService
  ) {
    super();
  }
  ngOnInit() {
    this.config = this.configService.configData;
    this.subs.sink = this.rightSidebarService.sidebarPricePlanState.subscribe(
      (isRunning) => {
        this.isOpenSidebar = isRunning;
      }
    );
    this.setRightSidebarWindowHeight();
  }

  getCustomerPlan() {
    this.sharedService.getCustomerPlan().subscribe((res: any) => {
      this.customerPlan = res.data;
      // console.log('this.customerPlan', this.customerPlan)
      if (this.customerPlan) {
        this.sharedService
          .getPlan(this.customerPlan?.pricePlanId)
          .subscribe((res: any) => {
            this.plan = res.data;
            // console.log('this.plan', this.plan)
          });
      }
    });
  }

  getCustomerFeature() {
    this.sharedService.getCustomerFeature().subscribe((res: any) => {
      this.customerFeature = res.data;
      // console.log('this.customerFeature', this.customerFeature)
    });
  }

  getCustomerUserFeatureLicence() {
    this.sharedService.getCustomerUserFeatureLicence().subscribe((res: any) => {
      this.customerUserFeatureLicence = res.data;
      // console.log('this.customerUserFeatureLicence', this.customerUserFeatureLicence)
    });
  }

  getCustomerReferralFeatureLicence() {
    this.sharedService
      .getCustomerReferralFeatureLicence()
      .subscribe((res: any) => {
        this.customerReferralFeatureLicence = res.data;
        // console.log('this.customerReferralFeatureLicence', this.customerReferralFeatureLicence)
      });
  }
  setRightSidebarWindowHeight() {
    const height = window.innerHeight - 60;
    this.maxHeight = height + "";
    this.maxWidth = "500px";
  }

  onClickedOutside(event: Event) {
    const button = event.target as HTMLButtonElement;
    if (button.id !== "settingBtn") {
      if (this.isOpenSidebar === true) {
        this.toggleRightSidebar();
      }
    }
  }
  toggleRightSidebar(): void {
    this.rightSidebarService.setRightPricePlanSidebar(
      (this.isOpenSidebar = !this.isOpenSidebar)
    );
    if (this.isOpenSidebar) {
      // this.getCustomerPlan();
      // this.getCustomerFeature();
      // this.getCustomerUserFeatureLicence();
      // this.getCustomerReferralFeatureLicence();
      this.getCustomerSubscription();
    }
  }

  isSubscriptionLoading = false;
  customerSubscriptionData: any;
  subscriptionObj: any;
  subscriptionItemArray: any;
  planName: string = "NIL";

  isChargeCardVisible: boolean = false;

  getCustomerSubscription() {
    this.planName = "NIL";
    this.isSubscriptionLoading = true;
    this.sharedService.getCustomerSubscription().subscribe(
      (res: any) => {
        this.customerSubscriptionData = res.data;
        this.subscriptionObj = this.customerSubscriptionData?.subscription;
        this.subscriptionItemArray = this.customerSubscriptionData?.items;

        if (this.subscriptionItemArray?.length > 0) {
          this.getNameFromString(
            this.subscriptionItemArray[0]?.item_price_id,
            "planName"
          );

          let OBJ = this.subscriptionItemArray?.find(
            (sia: any) => sia?.item_type === "charge"
          );

          if (!!OBJ?.item_price_id) {
            this.isChargeCardVisible = true;
          }
        }

        this.isSubscriptionLoading = false;
      },
      () => {
        this.isSubscriptionLoading = false;
      }
    );
  }

  getNameFromString(string: any, type = "") {
    let stringArray = string?.split("-")?.join(" ");
    if (type === "planName") {
      this.planName = !!stringArray ? stringArray : "NIL";
    } else if (type === "returnName") {
      return !!stringArray ? stringArray : "NIL";
    }
  }

  getDate(timeDate: any) {
    if (!!timeDate) {
      let date = new Date(timeDate * 1000);
      return date;
    }
  }

  getEndName(obj: any) {
    if (!!obj?.activated_at) {
      return "Trial ended on";
    } else {
      return "Trial ends on";
    }
  }
}
