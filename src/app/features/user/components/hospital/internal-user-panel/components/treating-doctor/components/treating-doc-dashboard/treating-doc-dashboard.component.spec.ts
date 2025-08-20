import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatingDocDashboardComponent } from './treating-doc-dashboard.component';

describe('TreatingDocDashboardComponent', () => {
  let component: TreatingDocDashboardComponent;
  let fixture: ComponentFixture<TreatingDocDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatingDocDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatingDocDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
