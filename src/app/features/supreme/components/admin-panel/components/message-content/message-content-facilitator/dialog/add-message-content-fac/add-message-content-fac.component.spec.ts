import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMessageContentFacComponent } from './add-message-content-fac.component';

describe('AddMessageContentFacComponent', () => {
  let component: AddMessageContentFacComponent;
  let fixture: ComponentFixture<AddMessageContentFacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMessageContentFacComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMessageContentFacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
