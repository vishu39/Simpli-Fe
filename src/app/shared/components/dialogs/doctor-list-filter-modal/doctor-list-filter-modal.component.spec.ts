import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorListFilterModalComponent } from './doctor-list-filter-modal.component';

describe('DoctorListFilterModalComponent', () => {
  let component: DoctorListFilterModalComponent;
  let fixture: ComponentFixture<DoctorListFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorListFilterModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorListFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
