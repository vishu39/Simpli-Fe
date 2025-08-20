import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserPermissionComponent } from './delete-user-permission.component';

describe('DeleteUserPermissionComponent', () => {
  let component: DeleteUserPermissionComponent;
  let fixture: ComponentFixture<DeleteUserPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteUserPermissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteUserPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
