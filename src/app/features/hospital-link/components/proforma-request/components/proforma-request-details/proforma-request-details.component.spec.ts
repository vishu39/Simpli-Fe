import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaRequestDetailsComponent } from './proforma-request-details.component';

describe('ProformaRequestDetailsComponent', () => {
  let component: ProformaRequestDetailsComponent;
  let fixture: ComponentFixture<ProformaRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformaRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
