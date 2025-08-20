import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdComponent } from './opd.component';

describe('OpdComponent', () => {
  let component: OpdComponent;
  let fixture: ComponentFixture<OpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
