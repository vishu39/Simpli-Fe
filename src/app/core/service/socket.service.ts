import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { environment } from "src/environments/environment";
import { SwUpdate, SwPush } from "@angular/service-worker";
import { FacilitatorService } from "./facilitator/facilitator.service";
import { GET_LOGIN_TYPE } from "src/app/shared/routing-constant";
import { HospitalService } from "./hospital/hospital.service";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket;

  constructor(
    private swPush: SwPush,
    private facilitatorService: FacilitatorService,
    private hospitalService: HospitalService
  ) {
    this.socket = io.connect(environment.socketUrl);
  }

  getSocket() {
    return this.socket;
  }
  subscribeToNotifications() {
    if (!this.swPush.isEnabled) {
      console.log("Notification is not enabled");
      return;
    }
    this.swPush
      .requestSubscription({
        serverPublicKey: environment.vapidPublicKey,
      })
      .then((sub) => {
        const data = {
          pushNotificationEndpoint: sub,
        };

        let loginType = GET_LOGIN_TYPE();
        if (loginType === "facilitator") {
          this.facilitatorService
            .addPushNotificationEndpoint(data)
            .subscribe((res) => {
              console.log("Subscription successful:", sub);
            });
        }

        if (loginType === "hospital") {
          this.hospitalService
            .addPushNotificationEndpoint(data)
            .subscribe((res) => {
              console.log("Subscription successful:", sub);
            });
        }
      })
      .catch((err) => console.log(err));
    this.swPush.messages.subscribe((message) =>
      console.log("message", message)
    );
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      window.open(notification.data.url);
    });
  }
}
