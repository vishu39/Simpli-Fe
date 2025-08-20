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
  selector: "app-shared-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  @Input() userProfileData: any;
  @Input() isLoading: boolean;
  @Output("submitForm") submitForm: EventEmitter<any> = new EventEmitter();

  userProfileForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.userProfileData) {
      this.userProfileForm.patchValue({
        designation: this.userProfileData.designation,
      });
    }
  }

  buildForm() {
    this.userProfileForm = this.formBuilder.group({
      designation: ["", [Validators.required]],
    });
  }

  submit() {
    if (this.userProfileForm.valid) {
      this.submitForm.emit(this.userProfileForm.value);
    } else {
      Object.keys(this.userProfileForm.controls).forEach((key) => {
        this.userProfileForm.controls[key].markAsTouched();
      });
    }
  }
}
