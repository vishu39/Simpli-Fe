import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcommingArrivalListComponent } from './upcomming-arrival-list.component';

describe('UpcommingArrivalListComponent', () => {
  let component: UpcommingArrivalListComponent;
  let fixture: ComponentFixture<UpcommingArrivalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcommingArrivalListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcommingArrivalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
