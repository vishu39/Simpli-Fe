import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreIntemationComponent } from './pre-intemation.component';

describe('PreIntemationComponent', () => {
  let component: PreIntemationComponent;
  let fixture: ComponentFixture<PreIntemationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreIntemationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreIntemationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
