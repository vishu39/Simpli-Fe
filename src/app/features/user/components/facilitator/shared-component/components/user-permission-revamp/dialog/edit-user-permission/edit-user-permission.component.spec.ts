import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserPermissionComponent } from './edit-user-permission.component';

describe('EditUserPermissionComponent', () => {
  let component: EditUserPermissionComponent;
  let fixture: ComponentFixture<EditUserPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserPermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
