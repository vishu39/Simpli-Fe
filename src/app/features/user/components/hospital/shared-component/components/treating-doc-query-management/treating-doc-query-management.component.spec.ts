import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatingDocQueryManagementComponent } from './treating-doc-query-management.component';

describe('TreatingDocQueryManagementComponent', () => {
  let component: TreatingDocQueryManagementComponent;
  let fixture: ComponentFixture<TreatingDocQueryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatingDocQueryManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatingDocQueryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
