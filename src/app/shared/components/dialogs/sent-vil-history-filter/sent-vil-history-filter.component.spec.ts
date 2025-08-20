import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentVilHistoryFilterComponent } from './sent-vil-history-filter.component';

describe('SentVilHistoryFilterComponent', () => {
  let component: SentVilHistoryFilterComponent;
  let fixture: ComponentFixture<SentVilHistoryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentVilHistoryFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentVilHistoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
