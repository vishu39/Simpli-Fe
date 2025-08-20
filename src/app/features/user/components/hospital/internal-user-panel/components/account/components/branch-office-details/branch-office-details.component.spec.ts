import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchOfficeDetailsComponent } from './branch-office-details.component';

describe('BranchOfficeDetailsComponent', () => {
  let component: BranchOfficeDetailsComponent;
  let fixture: ComponentFixture<BranchOfficeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchOfficeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchOfficeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
