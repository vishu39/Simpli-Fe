import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { FacilitatorService } from "src/app/core/service/facilitator/facilitator.service";
import { SharedService } from "src/app/core/service/shared/shared.service";

@Component({
  selector: "app-add-details-vil",
  templateUrl: "./add-details-vil.component.html",
  styleUrls: ["./add-details-vil.component.scss"],
})
export class AddDetailsVilComponent implements OnInit {
  @Input() requestData: any;
  @Input() patientData: any;
  @Output("refetch") refetch: EventEmitter<any> = new EventEmitter();

  vilForm: FormGroup;

  constructor(
    private router: Router,
    private faciliatorService: FacilitatorService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.vilForm = this.fb.group({
      hospitalId: [this.requestData?.hospitalId],
      hospitalName: [
        {
          value: this.requestData?.hospitalName,
          disabled: true,
        },
      ],
      file: [[], [Validators.required]],
      receivedAt: [""],
      vilId: [this.requestData?.vilId, [Validators.required]],
      patient: [this.patientData?._id, [Validators.required]],
    });
  }

  fileList: any[] = [];
  filePreviewUrls: string[] = [];
  onFileSelected(e: any) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.pdf|\.png)$/i;
    const file = e.target.files[0];
    if (allowedExtensions.exec(file.name)) {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        this.filePreviewUrls = [fileUrl];
        file["url"] = fileUrl;
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.filePreviewUrls = [reader.result as string];
          file["url"] = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
    this.fileList = [file];
  }

  submit() {
    if (this.vilForm?.valid) {
      const { hospitalId, vilId, patient, receivedAt } = this.vilForm?.value;
      let formData = new FormData();

      let paylaod = {
        hospitalName: this.requestData?.hospitalName,
        hospitalId,
        vilId,
        receivedAt,
        patient,
      };

      for (const key in paylaod) {
        formData.append(key, paylaod[key]);
      }

      formData.append("file", this.fileList[0]);

      this.faciliatorService
        .vilReceivedOpenLink(formData)
        .subscribe((res: any) => {
          this.refetch.emit();
          this.sharedService.showNotification("snackBar-success", res.message);
        });
    } else {
      this.vilForm.markAsTouched();
    }
  }
}
