import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { regexService } from "src/app/core/service/regex";
@Component({
  selector: "app-shared-email-setting",
  templateUrl: "./email-setting.component.html",
  styleUrls: ["./email-setting.component.scss"],
})
export class EmailSettingComponent implements OnInit {
  @Input() emailSettingData: any;
  @Input() isLoading: boolean;
  @Output("submitForm") submitForm: EventEmitter<any> = new EventEmitter();

  emailSettingForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.emailSettingData) {
      this.emailSettingForm.patchValue({
        hospitalCommEmailId: this.emailSettingData.hospitalCommEmailId,
        hospitalCommPassword: this.emailSettingData.hospitalCommPassword,
        patientCommEmailId: this.emailSettingData.patientCommEmailId,
        patientCommPassword: this.emailSettingData.patientCommPassword,
        emailHost: this.emailSettingData.emailHost,
        reportCommEmailId: this.emailSettingData.reportCommEmailId,
        reportCommPassword: this.emailSettingData.reportCommPassword,
      });
    }
  }

  buildForm() {
    this.emailSettingForm = this.formBuilder.group({
      hospitalCommEmailId: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(regexService.emailRegex),
        ],
      ],
      hospitalCommPassword: ["", [Validators.required]],
      patientCommEmailId: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(regexService.emailRegex),
        ],
      ],
      patientCommPassword: ["", [Validators.required]],
      reportCommEmailId: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(regexService.emailRegex),
        ],
      ],
      reportCommPassword: ["", [Validators.required]],
      emailHost: ["", [Validators.required]],
    });
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  formSubmit() {
    // console.log('this.emailSettingForm', this.emailSettingForm.value)
    if (this.emailSettingForm.valid) {
      this.submitForm.emit(this.emailSettingForm?.value);
    } else {
      Object.keys(this.emailSettingForm.controls).forEach((key) => {
        this.emailSettingForm.controls[key].markAsTouched();
      });
    }
  }
}
