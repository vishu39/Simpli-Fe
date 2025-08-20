import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFetchCommonEmailComponent } from './email-fetch-common-email.component';

describe('EmailFetchCommonEmailComponent', () => {
  let component: EmailFetchCommonEmailComponent;
  let fixture: ComponentFixture<EmailFetchCommonEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailFetchCommonEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailFetchCommonEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
