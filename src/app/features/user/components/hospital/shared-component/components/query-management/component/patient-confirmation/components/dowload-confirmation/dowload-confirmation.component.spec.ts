import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowloadConfirmationComponent } from './dowload-confirmation.component';

describe('DowloadConfirmationComponent', () => {
  let component: DowloadConfirmationComponent;
  let fixture: ComponentFixture<DowloadConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DowloadConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DowloadConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
