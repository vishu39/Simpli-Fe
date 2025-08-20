import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { regexService } from "src/app/core/service/regex";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-add-doctor-dialog",
  templateUrl: "./add-doctor-dialog.component.html",
  styleUrls: ["./add-doctor-dialog.component.scss"],
})
export class AddDoctorDialogComponent implements OnInit {
  title: string;
  isEdit: boolean = false;
  editData: any = null;

  bucketUrl = environment.cmsS3Bucket;

  public Editor = ClassicEditor;

  doctorForm: FormGroup;
  imageDelete: boolean = false;
  profileDelete: boolean = false;
  image: any;
  profile: any;

  constructor(
    private dialogRef: MatDialogRef<AddDoctorDialogComponent>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    if (this.isEdit && !!this.editData) {
      this.onEdit();
    }
    this.getAllHospital(false);
  }

  treatmentItems: any;
  hospitalItems: any;
  doctorCategoryItems: any;
  testimonialItems: any;
  departmentItems: any;
  newsItems: any;
  cityItems: any;
  languageItems: any;

  onEdit() {
    this.image = this.editData?.image;
    if (!!this.image) {
      this.image["signedUrl"] = `${this.bucketUrl}${this.image?.key}`;
    }
    this.profile = this.editData?.profile;
    if (!!this.profile) {
      this.profile["signedUrl"] = `${this.bucketUrl}${this.profile?.key}`;
    }
    this.treatmentItems = this.editData.treatment;
    this.doctorCategoryItems = this.editData.doctorCategory;
    this.testimonialItems = this.editData.testimonial;
    this.departmentItems = this.editData.department;
    this.newsItems = this.editData.news;
    this.cityItems = this.editData.city;
    this.languageItems = this.editData.language;
    this.doctorForm.patchValue({
      name: this.editData.name,
      slug: this.editData.slug,
      designation: this.editData.designation,
      qualification: this.editData.qualification,
      expertise: this.editData.expertise,
      serviceOffered: this.editData.serviceOffered,
      highlights: this.editData.highlights,
      experience: this.editData.experience,
      rating: this.editData.rating,
      experienceYear: this.editData.experienceYear,
      featured: this.editData.featured,
      emailId: this.editData.emailId,
      contact: this.editData.contact,
    });

    if (this.editData.hospital?.length) {
      this.hospitalItems = this.editData.hospital;
      this.selectedHospitalSearch = this.editData.hospital;
      this.doctorForm.patchValue({
        hospital: [...new Set(this.selectedHospitalSearch)],
      });
    }
  }

  buildForm() {
    this.doctorForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      slug: ["", [Validators.required]],
      designation: ["", []],
      qualification: ["", []],
      expertise: ["", []],
      serviceOffered: ["", []],
      highlights: ["", []],
      experience: ["", []],
      rating: ["", []],
      experienceYear: ["", []],
      featured: [false, []],
      image: ["", []],
      profile: ["", []],
      treatment: ["", []],
      hospital: ["", []],
      doctorCategory: ["", []],
      testimonial: ["", []],
      department: ["", []],
      news: ["", []],
      city: ["", []],
      language: ["", []],
      emailId: ["", [Validators.pattern(regexService.emailRegex)]],
      contact: ["", []],
    });
  }

  closeDialog(apiCall: boolean): void {
    this.dialogRef.close(apiCall);
  }

  profileFile = [];
  profilePreviewUrls = [];
  uploadProfile(e: any) {
    this.profileFile = [];
    this.profilePreviewUrls = [];
    Array.from(e.target.files).forEach((file: any) => {
      if (file.type === "application/pdf") {
        const fileUrl = URL.createObjectURL(file);
        this.profilePreviewUrls.push(fileUrl);
        file["url"] = fileUrl;
      }
      this.profileFile.push(file);
    });
    this.profileDelete = false;
    this.doctorForm.patchValue({
      profile: this.profileFile?.[0],
    });
  }

  deleteProfile(i: number, type: string) {
    if (type === "uploaded") {
      this.profileDelete = true;
      this.profile = null;
    } else if (type === "upload") {
      this.profileFile = [];
      this.profilePreviewUrls = [];
      this.doctorForm.patchValue({
        profile: "",
      });
    }
  }

  imageFile = [];
  imagePreviewUrls = [];
  selectImage(e: any) {
    this.imageFile = [];
    this.imagePreviewUrls = [];
    Array.from(e.target.files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrls.push(reader.result as string);
        file["url"] = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.imageFile.push(file);
    });
    this.imageDelete = false;
    this.doctorForm.patchValue({
      image: this.imageFile?.[0],
    });
  }

  deleteImage(i: number, type: string) {
    if (type === "uploaded") {
      this.imageDelete = true;
      this.image = null;
    } else if (type === "upload") {
      this.imageFile = [];
      this.imagePreviewUrls = [];
      this.doctorForm.patchValue({
        image: "",
      });
    }
  }

  formSubmit() {
    if (this.profileFile?.length) {
      this.profileDelete = false;
    }
    if (this.imageFile?.length) {
      this.imageDelete = false;
    }
    if (this.doctorForm.valid) {
      const formData = new FormData();
      formData.append("name", this.doctorForm.value.name);
      formData.append("slug", this.doctorForm.value.slug);
      formData.append("designation", this.doctorForm.value.designation);
      formData.append("qualification", this.doctorForm.value.qualification);
      formData.append("expertise", this.doctorForm.value.expertise);
      formData.append("serviceOffered", this.doctorForm.value.serviceOffered);
      formData.append("highlights", this.doctorForm.value.highlights);
      formData.append("experience", this.doctorForm.value.experience);
      formData.append("rating", this.doctorForm.value.rating);
      formData.append("experienceYear", this.doctorForm.value.experienceYear);
      formData.append("featured", this.doctorForm.value.featured);
      formData.append("fileFirst", this.doctorForm.value.image);
      formData.append("fileSecond", this.doctorForm.value.profile);
      formData.append("imageDelete", JSON.stringify(this.imageDelete));
      formData.append("profileDelete", JSON.stringify(this.profileDelete));
      formData.append("treatment", JSON.stringify(this.treatmentItems));
      // formData.append("hospital", JSON.stringify(this.hospitalItems));
      formData.append(
        "hospital",
        JSON.stringify(this.doctorForm.value.hospital)
      );
      formData.append(
        "doctorCategory",
        JSON.stringify(this.doctorCategoryItems)
      );
      formData.append("testimonial", JSON.stringify(this.testimonialItems));
      formData.append("department", JSON.stringify(this.departmentItems));
      formData.append("news", JSON.stringify(this.newsItems));
      formData.append("city", JSON.stringify(this.cityItems));
      formData.append("language", JSON.stringify(this.languageItems));
      formData.append("emailId", this.doctorForm.value.emailId);
      formData.append("contact", this.doctorForm.value.contact);

      if (this.editData == undefined) {
        this.sharedService.addDoctor(formData).subscribe((res: any) => {
          this.sharedService.showNotification("snackBar-success", res.message);
          this.closeDialog(true);
        });
      } else {
        this.sharedService
          .editDoctor(this.editData._id, formData)
          .subscribe((res: any) => {
            this.sharedService.showNotification(
              "snackBar-success",
              res.message
            );
            this.closeDialog(true);
          });
      }
    } else {
      Object.keys(this.doctorForm.controls).forEach((key) => {
        this.doctorForm.controls[key].markAsTouched();
      });
    }
  }

  // hospital linking

  hospitalData: any = [];
  totalElementHospital: number;
  hospitalParams = {
    page: 1,
    limit: 10,
    search: "",
  };

  timeoutHospital = null;
  isLoadingHospital: boolean = false;
  isLoadingHospitalSelectAll: boolean = false;
  selectedHospitalSearch = [];

  getAllHospital(selectAll: Boolean) {
    if (this.isLoadingHospital) {
      return;
    }
    this.isLoadingHospital = true;

    this.sharedService
      .getAllHospital(this.hospitalParams)
      .subscribe((res: any) => {
        if (selectAll) {
          this.hospitalData = [];
        }
        this.hospitalData.push(...res.data.content);
        this.totalElementHospital = res.data.totalElement;
        this.hospitalParams.page = this.hospitalParams.page + 1;

        this.isLoadingHospital = false;

        if (selectAll) {
          const allHospital = this.hospitalData.map((item) => ({
            _id: item._id,
            name: item.name,
          }));
          allHospital.forEach((hospital) => {
            const isHospitalAlreadySelected = this.selectedHospitalSearch.some(
              (selectedHospital) => selectedHospital._id === hospital._id
            );

            if (!isHospitalAlreadySelected) {
              this.selectedHospitalSearch.push(hospital);
            }
          });

          this.doctorForm.patchValue({
            hospital: this.selectedHospitalSearch,
          });
          this.isLoadingHospitalSelectAll = false;
        }
      });
  }
  onInfiniteScrollHospital(): void {
    if (this.hospitalData.length < this.totalElementHospital) {
      this.getAllHospital(false);
    }
  }

  searchHospital(filterValue: string) {
    clearTimeout(this.timeoutHospital);
    this.timeoutHospital = setTimeout(() => {
      this.hospitalParams.search = filterValue.trim();
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 20;
      this.hospitalData = []; // Clear existing data when searching
      this.isLoadingHospital = false;
      this.getAllHospital(false);
    }, 600);
  }

  onClickHospital(item) {
    const index = this.selectedHospitalSearch.findIndex(
      (element) => element._id === item._id
    );
    // console.log('index', index)
    if (index !== -1) {
      // If the item exists, remove it
      this.selectedHospitalSearch.splice(index, 1);
    } else {
      // If the item doesn't exist, push it
      this.selectedHospitalSearch.push(item);
    }
    this.doctorForm.patchValue({
      hospital: [...new Set(this.selectedHospitalSearch)],
    });
  }

  selectAllHospital(event: any) {
    if (event.checked) {
      this.hospitalParams.page = 1;
      this.hospitalParams.limit = 0;
      this.isLoadingHospital = false;
      this.isLoadingHospitalSelectAll = true;
      this.getAllHospital(true);
    } else {
      this.selectedHospitalSearch = [];
      this.doctorForm.patchValue({
        hospital: [],
      });
    }
  }

  compareObjects(item1, item2) {
    return item1._id === item2._id; // Adjust this comparison based on your object structure
  }
}
