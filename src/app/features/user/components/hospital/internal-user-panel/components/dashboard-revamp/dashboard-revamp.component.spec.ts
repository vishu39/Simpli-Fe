import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRevampComponent } from './dashboard-revamp.component';

describe('DashboardRevampComponent', () => {
  let component: DashboardRevampComponent;
  let fixture: ComponentFixture<DashboardRevampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardRevampComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRevampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
