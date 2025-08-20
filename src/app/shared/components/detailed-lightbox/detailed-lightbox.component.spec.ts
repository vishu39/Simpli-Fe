import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedLightboxComponent } from './detailed-lightbox.component';

describe('DetailedLightboxComponent', () => {
  let component: DetailedLightboxComponent;
  let fixture: ComponentFixture<DetailedLightboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedLightboxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedLightboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
