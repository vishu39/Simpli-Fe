import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAddSalesIncentivesComponent } from './master-add-sales-incentives.component';

describe('MasterAddSalesIncentivesComponent', () => {
  let component: MasterAddSalesIncentivesComponent;
  let fixture: ComponentFixture<MasterAddSalesIncentivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterAddSalesIncentivesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterAddSalesIncentivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
