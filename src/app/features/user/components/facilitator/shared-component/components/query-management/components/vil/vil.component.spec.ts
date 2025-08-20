import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VilComponent } from './vil.component';

describe('VilComponent', () => {
  let component: VilComponent;
  let fixture: ComponentFixture<VilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
