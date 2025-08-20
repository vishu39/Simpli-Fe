import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedService } from "src/app/core/service/shared/shared.service";
import { environment } from "src/environments/environment";

@Component({
  selector: 'shared-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.scss']
})
export class DoctorProfileComponent implements OnInit {
  id: string;
  doctorProfileData: any;
  bucketUrl = environment.cmsS3Bucket;
  dataLoading: boolean = false;
  defaultColor = {
    bgColor: "#d6f2fd",
    profileColor: "#00509d",
  };

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    if (!!this?.id) {
      this.getProfileData(this?.id);
    }
  }

  getS3Url(url: string) {
    let src = `${this.bucketUrl}${url}`;
    return src;
  }

  goBack() {
    this.router.navigate(["/user/facilitator/admin/doctor"])
  }

  generateStarRating(rating: number) {
    const maxRating = 5;
    const fullStar =
      '<i class="fas fa-star" style="color: rgb(252, 213, 63);"></i>';
    const halfStar =
      '<i class="fas fa-star-half-alt" style="color: rgb(252, 213, 63);"></i>';
    const emptyStar =
      '<i class="far fa-star" style="color: rgb(252, 213, 63);"></i>';

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.25;

    let starsHTML = "";
    for (let i = 0; i < fullStars; i++) {
      starsHTML += fullStar;
    }

    if (hasHalfStar) {
      starsHTML += halfStar;
    }

    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += emptyStar;
    }

    return starsHTML;
  }

  getProfileData(id: string) {
    this.dataLoading = true;
    this.sharedService
      .getCmsData(`getDoctor/${id}`, {})
      .subscribe((res: any) => {
        if (res?.data) {
          this.doctorProfileData = res?.data;
          this.dataLoading = false;
        }
      });
  }
}
