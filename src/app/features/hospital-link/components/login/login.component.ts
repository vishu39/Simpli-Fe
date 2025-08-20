import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/core/service/shared/shared.service';
import { SupremeService } from 'src/app/core/service/supreme/supreme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  continue: string
  token: string

  constructor(private formBuilder: FormBuilder, private sharedService: SharedService, private _snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) {
    this.continue = route?.snapshot.queryParams.continue
    this.token = route?.snapshot.queryParams.token
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }
  showNotification(colorName: string, text: string) {
    this._snackBar.open(text, '', {
      duration: 5000,
      panelClass: colorName,
    });
  }
  ngOnInit(): void {
    this.buildForm();
  }

  loginFormSubmit() {
    if (!!this.token) {
      if (this.loginForm.valid) {
        let value = this.loginForm.value
        // console.log(this.token);
        // console.log(value.password);

        let payload = {
          hospitalPassword: value.password,
          loginLinkToken: this.token,
        }

        this.sharedService.hospitalLogin(payload).subscribe(
          (res: any) => {
            // console.log(res?.data);
            localStorage.setItem('loginLinkToken', res.data.loginLinkToken);
            localStorage.setItem('cmsToken', res.data.cmsToken)
            this.router.navigate([`/${this.continue}`])

            this.showNotification(
              'snackBar-success',
              res.message,
            );
          }
        )
      }
      else {
        Object.keys(this.loginForm.controls).forEach(key => {
          this.loginForm.controls[key].markAsTouched()
        });
      }
    } else {
      this.sharedService.showNotification(
        "snackBar-danger",
        "Token not found please redirect using link"
      )
    }
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }

  }
}
