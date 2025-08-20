import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatentListComponent } from './patent-list.component';

describe('PatentListComponent', () => {
  let component: PatentListComponent;
  let fixture: ComponentFixture<PatentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
