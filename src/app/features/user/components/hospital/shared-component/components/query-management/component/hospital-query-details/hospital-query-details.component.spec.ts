import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalQueryDetailsComponent } from './hospital-query-details.component';

describe('HospitalQueryDetailsComponent', () => {
  let component: HospitalQueryDetailsComponent;
  let fixture: ComponentFixture<HospitalQueryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalQueryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalQueryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
