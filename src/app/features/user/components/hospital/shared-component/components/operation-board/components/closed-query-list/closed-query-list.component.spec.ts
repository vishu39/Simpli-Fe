import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedQueryListComponent } from './closed-query-list.component';

describe('ClosedQueryListComponent', () => {
  let component: ClosedQueryListComponent;
  let fixture: ComponentFixture<ClosedQueryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedQueryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosedQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
