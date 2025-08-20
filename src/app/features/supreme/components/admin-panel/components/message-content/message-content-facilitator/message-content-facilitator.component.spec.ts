import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageContentFacilitatorComponent } from './message-content-facilitator.component';

describe('MessageContentFacilitatorComponent', () => {
  let component: MessageContentFacilitatorComponent;
  let fixture: ComponentFixture<MessageContentFacilitatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageContentFacilitatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageContentFacilitatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
