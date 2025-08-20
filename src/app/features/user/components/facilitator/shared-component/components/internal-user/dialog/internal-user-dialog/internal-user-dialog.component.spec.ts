import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalUserDialogComponent } from './internal-user-dialog.component';

describe('InternalUserDialogComponent', () => {
  let component: InternalUserDialogComponent;
  let fixture: ComponentFixture<InternalUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalUserDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
