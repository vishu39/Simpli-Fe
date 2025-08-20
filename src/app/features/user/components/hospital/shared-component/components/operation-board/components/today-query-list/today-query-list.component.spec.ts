import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayQueryListComponent } from './today-query-list.component';

describe('TodayQueryListComponent', () => {
  let component: TodayQueryListComponent;
  let fixture: ComponentFixture<TodayQueryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodayQueryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
