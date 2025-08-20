import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopHospitalComponent } from './top-hospital.component';

describe('TopHospitalComponent', () => {
  let component: TopHospitalComponent;
  let fixture: ComponentFixture<TopHospitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopHospitalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopHospitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
