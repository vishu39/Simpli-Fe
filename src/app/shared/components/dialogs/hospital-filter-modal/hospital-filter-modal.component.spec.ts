import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalFilterModalComponent } from './hospital-filter-modal.component';

describe('HospitalFilterModalComponent', () => {
  let component: HospitalFilterModalComponent;
  let fixture: ComponentFixture<HospitalFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalFilterModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
