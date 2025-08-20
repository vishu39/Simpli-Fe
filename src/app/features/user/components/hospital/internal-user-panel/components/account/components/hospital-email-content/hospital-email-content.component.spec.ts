import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalEmailContentComponent } from './hospital-email-content.component';

describe('HospitalEmailContentComponent', () => {
  let component: HospitalEmailContentComponent;
  let fixture: ComponentFixture<HospitalEmailContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalEmailContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalEmailContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
