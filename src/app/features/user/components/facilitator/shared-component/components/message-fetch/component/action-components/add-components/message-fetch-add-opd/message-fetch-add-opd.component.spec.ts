import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchAddOpdComponent } from './message-fetch-add-opd.component';

describe('MessageFetchAddOpdComponent', () => {
  let component: MessageFetchAddOpdComponent;
  let fixture: ComponentFixture<MessageFetchAddOpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchAddOpdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchAddOpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
