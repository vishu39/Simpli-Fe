import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRevampDownloadModalComponent } from './dashboard-revamp-download-modal.component';

describe('DashboardRevampDownloadModalComponent', () => {
  let component: DashboardRevampDownloadModalComponent;
  let fixture: ComponentFixture<DashboardRevampDownloadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardRevampDownloadModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardRevampDownloadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
