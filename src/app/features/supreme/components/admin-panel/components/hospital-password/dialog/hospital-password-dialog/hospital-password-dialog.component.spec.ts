import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalPasswordDialogComponent } from './hospital-password-dialog.component';

describe('HospitalPasswordDialogComponent', () => {
  let component: HospitalPasswordDialogComponent;
  let fixture: ComponentFixture<HospitalPasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalPasswordDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
