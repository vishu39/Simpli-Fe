import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: "app-shared-template-setting",
  templateUrl: "./template-setting.component.html",
  styleUrls: ["./template-setting.component.scss"],
})
export class TemplateSettingComponent implements OnInit {
  @Input() templateSettingData: any;
  @Input() isLoading: boolean;
  @Output("submitForm") submitForm: EventEmitter<any> = new EventEmitter();

  templateSettingForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.buildForm();
  }
  buildForm() {
    this.templateSettingForm = this.formBuilder.group({
      bgColor: ["", [Validators.required]],
      profileColor: ["", [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.templateSettingData) {
      this.templateSettingForm.patchValue({
        bgColor: this.templateSettingData.bgColor,
        profileColor: this.templateSettingData.profileColor,
      });
    }
  }

  spaceRestrict(event: any) {
    if (event.charCode === 32) {
      event.preventDefault();
    }
  }

  submit() {
    if (this.templateSettingForm.valid) {
      this.submitForm.emit(this.templateSettingForm?.value);
    } else {
      Object.keys(this.templateSettingForm.controls).forEach((key) => {
        this.templateSettingForm.controls[key].markAsTouched();
      });
    }
  }
}
