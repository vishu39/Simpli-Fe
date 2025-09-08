import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceLogsComponent } from './finance-logs.component';

describe('FinanceLogsComponent', () => {
  let component: FinanceLogsComponent;
  let fixture: ComponentFixture<FinanceLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
