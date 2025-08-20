import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricePlanSidebarComponent } from './price-plan-sidebar.component';

describe('PricePlanSidebarComponent', () => {
  let component: PricePlanSidebarComponent;
  let fixture: ComponentFixture<PricePlanSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricePlanSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricePlanSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
