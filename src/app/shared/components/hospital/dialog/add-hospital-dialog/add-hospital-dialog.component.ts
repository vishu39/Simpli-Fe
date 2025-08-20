import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { environment } from "src/environments/environment";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { cloneDeep } from "lodash";

@Component({
  selector: "app-add-hospital-dialog",
  templateUrl: "./add-hospital-dialog.component.html",
  styleUrls: ["./add-hospital-dialog.component.scss"],
})
export class AddHospitalDialogComponent implements OnInit {
  title: string;
  isEdit: boolean = false;
  editData: any = null;

  hospitalData: any = null;

  hospitalForm: FormGroup;

  bucketUrl = environment.cmsS3Bucket;

  public Editor = ClassicEditor;

  constructor(
    private dialogRef: MatDialogRef<AddHospitalDialogComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if (this.isEdit && !!this.editData) {
      this.onEdit();
    }
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  buildForm() {
    this.hospitalForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      slug: ["", [Validators.required]],
      beds: ["", []],
      established: ["", []],
      speciality: ["", []],
      awards: ["", []],
      infrastructure: ["", []],
      distance: ["", []],
      address: ["", []],
      moneyMatters: ["", []],
      foodDining: ["", []],
      language: ["", []],
      transportation: ["", []],
      rank: ["", []],
      description: ["", []],
      zone: ["", []],
      hospitalCode: ["", []],
      phoneNumber: ["", []],
      featured: [false, []],
      logo: ["", []],
      mainImage: ["", []],
      doctor: ["", []],
      treatment: ["", []],
      testimonial: ["", []],
      department: ["", []],
      city: ["", []],
      news: ["", []],
      country: ["", []],
      accreditation: ["", []],
      group: ["", []],
    });
  }

  doctorItems: any = [];
  treatmentItems: any = [];
  testimonialItems: any = [];
  departmentItems: any = [];
  cityItems: any = [];
  newsItems: any = [];
  countryItems: any = [];
  accreditationItems: any = [];
  groupItems: any = [];

  onEdit() {
    this.hospitalData = this.editData;
    this.logo = this.hospitalData?.logo;
    if (!!this.logo) {
      this.logo["signedUrl"] = `${this.bucketUrl}${this.logo?.key}`;
    }
    this.mainImage = this.hospitalData?.mainImage;
    if (!!this.mainImage) {
      this.mainImage["signedUrl"] = `${this.bucketUrl}${this.mainImage?.key}`;
    }
    this.images = cloneDeep(this.hospitalData?.images);
    this.imagesForPreview = cloneDeep(this.hospitalData?.images);
    if (this.imagesForPreview?.length) {
      this.imagesForPreview.forEach((obj: any) => {
        obj["signedUrl"] = `${this.bucketUrl}${obj?.key}`;
      });
    }

    this.doctorItems = this.hospitalData.doctor;
    this.treatmentItems = this.hospitalData.treatment;
    this.testimonialItems = this.hospitalData.testimonial;
    this.departmentItems = this.hospitalData.department;
    this.cityItems = this.hospitalData.city;
    this.newsItems = this.hospitalData.news;
    this.countryItems = this.hospitalData.country;
    this.accreditationItems = this.hospitalData.accreditation;
    this.groupItems = this.hospitalData.group;

    this.hospitalForm.patchValue({
      name: this.hospitalData.name,
      slug: this.hospitalData.slug,
      beds: this.hospitalData.beds,
      established: this.hospitalData.established,
      speciality: this.hospitalData.speciality,
      awards: this.hospitalData.awards,
      infrastructure: this.hospitalData.infrastructure,
      distance: this.hospitalData.distance,
      address: this.hospitalData.address,
      moneyMatters: this.hospitalData.moneyMatters,
      language: this.hospitalData.language,
      foodDining: this.hospitalData.foodDining,
      transportation: this.hospitalData.transportation,
      rank: this.hospitalData.rank,
      description: this.hospitalData.description,
      zone: this.hospitalData.zone,
      hospitalCode: this.hospitalData.hospitalCode,
      phoneNumber: this.hospitalData.phoneNumber,
      featured: this.hospitalData.featured,
    });
  }

  // logo upload delete function
  logoDelete: boolean = false;
  logo: any;
  logoFile = [];
  logoFileForPreview = [];
  selectLogo(e: any) {
    this.logoFile = [];
    this.logoFileForPreview = [];
    Array.from(e.target.files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoFileForPreview.push(reader.result as string);
        file["url"] = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.logoFile.push(file);
    });
    this.logoDelete = false;
    this.hospitalForm.patchValue({
      logo: this.logoFile?.[0],
    });
  }

  deleteLogoImage(i: any, type: string) {
    switch (type) {
      case "uploaded":
        this.logoDelete = true;
        this.logo = null;
        break;
      case "upload":
        this.logoFile = [];
        this.logoFileForPreview = [];
        this.hospitalForm.patchValue({
          logo: "",
        });
        break;
    }
  }

  // main image upload delete function
  mainImageDelete: boolean = false;
  mainImage: any;
  mainImageFile = [];
  mainImagePreviewUrls = [];
  selectMainImage(e: any) {
    this.mainImageFile = [];
    this.mainImagePreviewUrls = [];
    Array.from(e.target.files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImagePreviewUrls.push(reader.result as string);
        file["url"] = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.mainImageFile.push(file);
    });
    this.mainImageDelete = false;
    this.hospitalForm.patchValue({
      mainImage: this.mainImageFile?.[0],
    });
  }

  deleteMainImage(i: any, type: string) {
    switch (type) {
      case "uploaded":
        this.mainImageDelete = true;
        this.mainImage = null;
        break;
      case "upload":
        this.mainImageFile = [];
        this.mainImagePreviewUrls = [];
        this.hospitalForm.patchValue({
          mainImage: "",
        });
        break;
    }
  }

  // images upload delete function
  images = [];
  imagesForPreview = [];
  imagesUpload = [];
  imagesUploadPreviewUrl = [];
  selectImages(e: any) {
    Array.from(e.target.files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagesUploadPreviewUrl.push(reader.result as string);
        file["url"] = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.imagesUpload.push(file);
    });
  }

  deleteUploaderImages(i: any) {
    this.imagesUpload.splice(i, 1);
    this.imagesUploadPreviewUrl.splice(i, 1);
  }

  deleteUploadedImages(i: any) {
    this.images.splice(i, 1);
    this.imagesForPreview.splice(i, 1);
  }

  formSubmit() {
    if (this.logoFile?.length) {
      this.logoDelete = false;
    }
    if (this.mainImageFile?.length) {
      this.mainImageDelete = false;
    }
    if (this.hospitalForm.valid) {
      const formData = new FormData();
      formData.append("name", this.hospitalForm.value.name);
      formData.append("slug", this.hospitalForm.value.slug);
      formData.append("beds", this.hospitalForm.value.beds);
      formData.append("established", this.hospitalForm.value.established);
      formData.append("speciality", this.hospitalForm.value.speciality);
      formData.append("awards", this.hospitalForm.value.awards);
      formData.append("infrastructure", this.hospitalForm.value.infrastructure);
      formData.append("distance", this.hospitalForm.value.distance);
      formData.append("address", this.hospitalForm.value.address);
      formData.append("moneyMatters", this.hospitalForm.value.moneyMatters);
      formData.append("language", this.hospitalForm.value.language);
      formData.append("transportation", this.hospitalForm.value.transportation);
      formData.append("rank", this.hospitalForm.value.rank);
      formData.append("description", this.hospitalForm.value.description);
      formData.append("foodDining", this.hospitalForm.value.foodDining);
      formData.append("zone", this.hospitalForm.value.zone);
      formData.append("hospitalCode", this.hospitalForm.value.hospitalCode);
      formData.append("phoneNumber", this.hospitalForm.value.phoneNumber);
      formData.append("featured", this.hospitalForm.value.featured);
      formData.append("fileFirst", this.hospitalForm.value.logo);
      formData.append("fileSecond", this.hospitalForm.value.mainImage);
      formData.append("logoDelete", JSON.stringify(this.logoDelete));
      formData.append("mainImageDelete", JSON.stringify(this.mainImageDelete));
      formData.append("treatment", JSON.stringify(this.treatmentItems));
      formData.append("doctor", JSON.stringify(this.doctorItems));
      formData.append("testimonial", JSON.stringify(this.testimonialItems));
      formData.append("department", JSON.stringify(this.departmentItems));
      formData.append("city", JSON.stringify(this.cityItems));
      formData.append("news", JSON.stringify(this.newsItems));
      formData.append("country", JSON.stringify(this.countryItems));
      formData.append("accreditation", JSON.stringify(this.accreditationItems));
      formData.append("group", JSON.stringify(this.groupItems));

      for (var i = 0; i < this.imagesUpload.length; i++) {
        formData.append("fileThird", this.imagesUpload[i]);
      }

      if (this.hospitalData == undefined) {
        this.sharedService.addHospital(formData).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeDialog(true);
        });
      } else {
        formData.append("images", JSON.stringify(this.images));

        this.sharedService
          .editHospital(this.hospitalData._id, formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      Object.keys(this.hospitalForm.controls).forEach((key) => {
        this.hospitalForm.controls[key].markAsTouched();
      });
    }
  }
}
