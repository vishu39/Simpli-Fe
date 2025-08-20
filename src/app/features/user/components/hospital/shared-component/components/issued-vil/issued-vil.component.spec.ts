import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedVilComponent } from './issued-vil.component';

describe('IssuedVilComponent', () => {
  let component: IssuedVilComponent;
  let fixture: ComponentFixture<IssuedVilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuedVilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuedVilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
