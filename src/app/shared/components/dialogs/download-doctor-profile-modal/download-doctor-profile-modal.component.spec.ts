import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadDoctorProfileModalComponent } from './download-doctor-profile-modal.component';

describe('DownloadDoctorProfileModalComponent', () => {
  let component: DownloadDoctorProfileModalComponent;
  let fixture: ComponentFixture<DownloadDoctorProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadDoctorProfileModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadDoctorProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
