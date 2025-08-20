import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdRequestDetailsComponent } from './opd-request-details.component';

describe('OpdRequestDetailsComponent', () => {
  let component: OpdRequestDetailsComponent;
  let fixture: ComponentFixture<OpdRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpdRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpdRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
