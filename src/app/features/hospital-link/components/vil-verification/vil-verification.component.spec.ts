import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VilVerificationComponent } from './vil-verification.component';

describe('VilVerificationComponent', () => {
  let component: VilVerificationComponent;
  let fixture: ComponentFixture<VilVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VilVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VilVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
