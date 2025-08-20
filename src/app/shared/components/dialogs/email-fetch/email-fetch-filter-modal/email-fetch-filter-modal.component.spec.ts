import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFetchFilterModalComponent } from './email-fetch-filter-modal.component';

describe('EmailFetchFilterModalComponent', () => {
  let component: EmailFetchFilterModalComponent;
  let fixture: ComponentFixture<EmailFetchFilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailFetchFilterModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailFetchFilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
