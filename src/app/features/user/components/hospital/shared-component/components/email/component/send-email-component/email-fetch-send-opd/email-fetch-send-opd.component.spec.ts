import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFetchSendOpdComponent } from './email-fetch-send-opd.component';

describe('EmailFetchSendOpdComponent', () => {
  let component: EmailFetchSendOpdComponent;
  let fixture: ComponentFixture<EmailFetchSendOpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailFetchSendOpdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailFetchSendOpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
