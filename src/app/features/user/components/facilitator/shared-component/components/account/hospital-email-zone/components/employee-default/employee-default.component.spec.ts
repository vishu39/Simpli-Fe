import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDefaultComponent } from './employee-default.component';

describe('EmployeeDefaultComponent', () => {
  let component: EmployeeDefaultComponent;
  let fixture: ComponentFixture<EmployeeDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeDefaultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
