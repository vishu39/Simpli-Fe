import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRevampFilterModalComponent } from './dashboard-revamp-filter-modal.component';

describe('DashboardRevampFilterModalComponent', () => {
  let component: DashboardRevampFilterModalComponent;
  let fixture: ComponentFixture<DashboardRevampFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardRevampFilterModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRevampFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
