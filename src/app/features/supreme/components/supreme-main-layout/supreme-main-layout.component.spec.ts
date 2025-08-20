import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupremeMainLayoutComponent } from './supreme-main-layout.component';

describe('SupremeMainLayoutComponent', () => {
  let component: SupremeMainLayoutComponent;
  let fixture: ComponentFixture<SupremeMainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupremeMainLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupremeMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
