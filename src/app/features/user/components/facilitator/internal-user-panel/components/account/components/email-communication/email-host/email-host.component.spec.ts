import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailHostComponent } from './email-host.component';

describe('EmailHostComponent', () => {
  let component: EmailHostComponent;
  let fixture: ComponentFixture<EmailHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailHostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
