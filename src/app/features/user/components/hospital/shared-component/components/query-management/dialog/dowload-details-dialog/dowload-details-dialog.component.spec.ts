import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowloadDetailsDialogComponent } from './dowload-details-dialog.component';

describe('DowloadDetailsDialogComponent', () => {
  let component: DowloadDetailsDialogComponent;
  let fixture: ComponentFixture<DowloadDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DowloadDetailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DowloadDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
