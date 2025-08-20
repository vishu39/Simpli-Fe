import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFetchSendOpinionComponent } from './email-fetch-send-opinion.component';

describe('EmailFetchSendOpinionComponent', () => {
  let component: EmailFetchSendOpinionComponent;
  let fixture: ComponentFixture<EmailFetchSendOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailFetchSendOpinionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailFetchSendOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
