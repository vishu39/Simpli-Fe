import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAddCompanyComponent } from './master-add-company.component';

describe('MasterAddCompanyComponent', () => {
  let component: MasterAddCompanyComponent;
  let fixture: ComponentFixture<MasterAddCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterAddCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterAddCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
