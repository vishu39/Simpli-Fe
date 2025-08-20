import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationEntriesRightDetailsComponent } from './operation-entries-right-details.component';

describe('OperationEntriesRightDetailsComponent', () => {
  let component: OperationEntriesRightDetailsComponent;
  let fixture: ComponentFixture<OperationEntriesRightDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationEntriesRightDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationEntriesRightDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
