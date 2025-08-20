import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneDialogComponent } from './zone-dialog.component';

describe('ZoneDialogComponent', () => {
  let component: ZoneDialogComponent;
  let fixture: ComponentFixture<ZoneDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
