import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { regexService } from "src/app/core/service/regex";
import { SupremeService } from "src/app/core/service/supreme/supreme.service";

import { DeviceDetectorService } from "ngx-device-detector";
import { getDeviceId } from "src/app/shared/constant";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  otpControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("^[0-9]{1,6}$"),
  ]);
  deviceInfo: any;

  constructor(
    private formBuilder: FormBuilder,
    private supremeService: SupremeService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {}
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
  showNotification(colorName: string, text: string) {
    this._snackBar.open(text, "", {
      duration: 5000,
      panelClass: colorName,
    });
  }
  ngOnInit(): void {
    // localStorage.setItem("isSupreme", "true");
    this.buildForm();
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }
  loginFormSubmit() {
    if (this.loginForm.valid) {
      let deviceId = getDeviceId();
      this.supremeService
        .login({
          ...this.loginForm.value,
          deviceId,
          deviceInfo: this.deviceInfo,
        })
        .subscribe((res: any) => {
          // localStorage.setItem("userToken", res.data.userToken);
          // localStorage.setItem("cmsToken", res.data.cmsToken);
          localStorage.removeItem("loginType");
          // this.router.navigate(["/supreme/admin"]);
          localStorage.setItem("isSupreme", "true");
          this.storedEmail = res?.data?.email;
          this.isOtpSend = true;
          this.calculateOtpTimer();
          this.showNotification("snackBar-success", res.message);
        });
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.controls[key].markAsTouched();
      });
    }
  }

  regenerateOTP() {
    this.loginForm.reset();
    this.isOtpSend = false;
    this.otpTime = 599;
    this.otpControl.reset();
  }

  storedEmail: any;
  isOtpSend = false;
  verifyOtp() {
    if (this.otpControl.valid) {
      this.supremeService
        .verifyOtp({
          email: this.storedEmail,
          otp: this.otpControl.value,
        })
        .subscribe((res: any) => {
          if(res.data.userToken && res.data.cmsToken){
          localStorage.setItem("userToken", res.data.userToken);
          localStorage.setItem("cmsToken", res.data.cmsToken);
          this.router.navigate(["/supreme/admin"]);
          this.showNotification("snackBar-success", res.message);
          this.isOtpSend = false;
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
}
