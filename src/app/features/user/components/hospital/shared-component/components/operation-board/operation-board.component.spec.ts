import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationBoardComponent } from './operation-board.component';

describe('OperationBoardComponent', () => {
  let component: OperationBoardComponent;
  let fixture: ComponentFixture<OperationBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
