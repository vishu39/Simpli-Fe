import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalQueryTabsComponent } from './hospital-query-tabs.component';

describe('HospitalQueryTabsComponent', () => {
  let component: HospitalQueryTabsComponent;
  let fixture: ComponentFixture<HospitalQueryTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalQueryTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalQueryTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
