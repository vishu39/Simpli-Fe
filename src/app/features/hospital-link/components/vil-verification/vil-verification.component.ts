import { Component, OnInit } from "@angular/core";
import { HospitalService } from "src/app/core/service/hospital/hospital.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-vil-verification",
  templateUrl: "./vil-verification.component.html",
  styleUrls: ["./vil-verification.component.scss"],
})
export class VilVerificationComponent implements OnInit {
  token: string;

  tokenData: any = null;

  isTokenVerifing = false;

  isVerificationFailed = false;

  constructor(
    private hospitalService: HospitalService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    let token = window.location.href.split("token=")?.[1];
    this.token = token;
    this.verifyIssuedVil();
  }

  verifyIssuedVil() {
    this.isTokenVerifing = true;
    let payload = {
      vilVerificationToken: this.token,
    };
    this.hospitalService.verifyIssuedVil(payload).subscribe(
      (res: any) => {
        let data = this.sharedService.decrypt(res?.data);
        if (!!data) {
          this.tokenData = data;
          this.isVerificationFailed = false;
        } else {
          this.tokenData = null;
          this.isVerificationFailed = true;
        }
        this.isTokenVerifing = false;
      },
      () => {
        this.tokenData = null;
        this.isVerificationFailed = true;
        this.isTokenVerifing = false;
      }
    );
  }
}
