import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaRequestComponent } from './proforma-request.component';

describe('ProformaRequestComponent', () => {
  let component: ProformaRequestComponent;
  let fixture: ComponentFixture<ProformaRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProformaRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformaRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
