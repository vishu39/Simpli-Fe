import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceListComponent } from './finance-list.component';

describe('FinanceListComponent', () => {
  let component: FinanceListComponent;
  let fixture: ComponentFixture<FinanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
