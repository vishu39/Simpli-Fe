import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { regexService } from "src/app/core/service/regex";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { getDeviceId } from "src/app/shared/constant";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isAdmin: Boolean = true;
  isMember: Boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private hospitalService: HospitalService,
    private sharedService: SharedService,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {
    localStorage.setItem("loginType", "hospital");
    this.sharedService.hospitalLoginSubject.next("admin");
    localStorage.setItem("userType", "admin");
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      emailId: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(regexService.emailRegex),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }
  selectUser(userType: string) {
    if (userType === "admin") {
      this.isAdmin = true;
      this.isMember = false;
      this.sharedService.hospitalLoginSubject.next("admin");
      localStorage.setItem("userType", "admin");
    } else if (userType === "member") {
      this.isMember = true;
      this.isAdmin = false;
      this.sharedService.hospitalLoginSubject.next("member");
      localStorage.setItem("userType", "member");
    }
  }
  loginFormSubmit() {
    if (this.loginForm.valid) {
      let deviceId = getDeviceId();
      if (this.isAdmin) {
        this.loginForm.value.internalUser = false;
        this.hospitalService
          .login({
            ...this.loginForm.value,
            deviceId,
            deviceInfo: this.deviceInfo,
          })
          .subscribe((res: any) => {
            this.storedLoginData = res?.data;
            this.isOtpSend = true;
            this.calculateOtpTimer();
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      } else if (this.isMember) {
        this.loginForm.value.internalUser = true;
        this.hospitalService
          .login({
            ...this.loginForm.value,
            deviceId,
            deviceInfo: this.deviceInfo,
          })
          .subscribe((res: any) => {
            this.storedLoginData = res?.data;
            this.isOtpSend = true;
            this.calculateOtpTimer();
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          });
      }
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.controls[key].markAsTouched();
      });
    }
  }

  otpControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("^[0-9]{1,6}$"),
  ]);
  deviceInfo: any;

  regenerateOTP() {
    this.loginForm.reset();
    this.isOtpSend = false;
    this.otpTime = 599;
    this.otpControl.reset();
  }

  storedLoginData: any;
  isOtpSend = false;
  verifyOtp() {
    if (this.otpControl.valid) {
      let payload={
        emailId: this.storedLoginData.emailId,
        password: this.storedLoginData.password,
        otp: this.otpControl.value,
      }

      if(this.isMember){
        payload['internalUser']=true
      }
      
      this.hospitalService
        .verifyOtp(payload)
        .subscribe((res: any) => {
          if (res.data.userToken && res.data.cmsToken) {
            localStorage.setItem("userToken", res.data.userToken);
            localStorage.setItem("cmsToken", res.data.cmsToken);
            localStorage.setItem("loginType", "hospital");

            if (this.isAdmin) {
              this.router.navigate(["/user/hospital/admin"]);
              this.sharedService.hospitalLoginSubject.next("admin");
              this.isOtpSend = false;
            } else if (this.isMember) {
              this.router.navigate(["/user/hospital/internal-user"]);
              this.sharedService.hospitalLoginSubject.next("member");
              this.isOtpSend = false;
            }

            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
          }
        });
    } else {
      this.otpControl.markAllAsTouched();
    }
  }

  otpTime = 599;
  calculateOtpTimer() {
    setTimeout(() => {
      if( this.isOtpSend){
      this.otpTime = this.otpTime - 1;
      if (this.otpTime > 0) {
          this.calculateOtpTimer();
      }      
    }
    }, 1000);
  }

  convertToMinutesAndSeconds(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  redirectToFacilitatorAuth() {
    this.router.navigate(["/user/facilitator/auth/login"]);
  }
}
