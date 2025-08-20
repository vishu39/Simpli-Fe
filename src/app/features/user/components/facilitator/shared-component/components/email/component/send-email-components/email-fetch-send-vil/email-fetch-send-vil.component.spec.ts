import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFetchSendVilComponent } from './email-fetch-send-vil.component';

describe('EmailFetchSendVilComponent', () => {
  let component: EmailFetchSendVilComponent;
  let fixture: ComponentFixture<EmailFetchSendVilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailFetchSendVilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailFetchSendVilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
