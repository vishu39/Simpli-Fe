import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchAddVilComponent } from './message-fetch-add-vil.component';

describe('MessageFetchAddVilComponent', () => {
  let component: MessageFetchAddVilComponent;
  let fixture: ComponentFixture<MessageFetchAddVilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchAddVilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchAddVilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
