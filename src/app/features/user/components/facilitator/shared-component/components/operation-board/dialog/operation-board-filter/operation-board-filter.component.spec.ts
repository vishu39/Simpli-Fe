import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationBoardFilterComponent } from './operation-board-filter.component';

describe('OperationBoardFilterComponent', () => {
  let component: OperationBoardFilterComponent;
  let fixture: ComponentFixture<OperationBoardFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationBoardFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationBoardFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
