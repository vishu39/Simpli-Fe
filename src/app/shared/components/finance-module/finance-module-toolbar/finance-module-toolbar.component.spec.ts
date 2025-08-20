import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceModuleToolbarComponent } from './finance-module-toolbar.component';

describe('FinanceModuleToolbarComponent', () => {
  let component: FinanceModuleToolbarComponent;
  let fixture: ComponentFixture<FinanceModuleToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceModuleToolbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceModuleToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
