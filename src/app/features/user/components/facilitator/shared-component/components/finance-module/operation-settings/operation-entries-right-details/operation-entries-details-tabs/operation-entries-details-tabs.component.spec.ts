import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationEntriesDetailsTabsComponent } from './operation-entries-details-tabs.component';

describe('OperationEntriesDetailsTabsComponent', () => {
  let component: OperationEntriesDetailsTabsComponent;
  let fixture: ComponentFixture<OperationEntriesDetailsTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationEntriesDetailsTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationEntriesDetailsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
