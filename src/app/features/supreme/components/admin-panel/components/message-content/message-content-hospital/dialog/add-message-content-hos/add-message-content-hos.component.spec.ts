import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMessageContentHosComponent } from './add-message-content-hos.component';

describe('AddMessageContentHosComponent', () => {
  let component: AddMessageContentHosComponent;
  let fixture: ComponentFixture<AddMessageContentHosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMessageContentHosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMessageContentHosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
