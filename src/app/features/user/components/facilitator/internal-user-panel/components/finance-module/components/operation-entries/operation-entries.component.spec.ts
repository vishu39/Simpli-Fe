import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationEntriesComponent } from './operation-entries.component';

describe('OperationEntriesComponent', () => {
  let component: OperationEntriesComponent;
  let fixture: ComponentFixture<OperationEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationEntriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
