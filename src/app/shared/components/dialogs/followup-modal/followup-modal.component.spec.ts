import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupModalComponent } from './followup-modal.component';

describe('FollowupModalComponent', () => {
  let component: FollowupModalComponent;
  let fixture: ComponentFixture<FollowupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowupModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
