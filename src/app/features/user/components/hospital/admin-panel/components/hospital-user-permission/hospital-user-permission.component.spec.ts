import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalUserPermissionComponent } from './hospital-user-permission.component';

describe('HospitalUserPermissionComponent', () => {
  let component: HospitalUserPermissionComponent;
  let fixture: ComponentFixture<HospitalUserPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HospitalUserPermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalUserPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
