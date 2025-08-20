import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMessageContentComponent } from './add-message-content.component';

describe('AddMessageContentComponent', () => {
  let component: AddMessageContentComponent;
  let fixture: ComponentFixture<AddMessageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMessageContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMessageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
