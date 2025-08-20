import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionRevampComponent } from './user-permission-revamp.component';

describe('UserPermissionRevampComponent', () => {
  let component: UserPermissionRevampComponent;
  let fixture: ComponentFixture<UserPermissionRevampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPermissionRevampComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPermissionRevampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
