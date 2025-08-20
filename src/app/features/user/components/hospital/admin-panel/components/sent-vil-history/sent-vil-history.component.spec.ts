import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentVilHistoryComponent } from './sent-vil-history.component';

describe('SentVilHistoryComponent', () => {
  let component: SentVilHistoryComponent;
  let fixture: ComponentFixture<SentVilHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentVilHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentVilHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
