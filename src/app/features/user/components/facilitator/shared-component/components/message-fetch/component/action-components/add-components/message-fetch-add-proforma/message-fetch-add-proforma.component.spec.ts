import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFetchAddProformaComponent } from './message-fetch-add-proforma.component';

describe('MessageFetchAddProformaComponent', () => {
  let component: MessageFetchAddProformaComponent;
  let fixture: ComponentFixture<MessageFetchAddProformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageFetchAddProformaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageFetchAddProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
