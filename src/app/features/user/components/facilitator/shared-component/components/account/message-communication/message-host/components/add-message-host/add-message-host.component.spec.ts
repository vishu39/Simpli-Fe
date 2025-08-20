import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMessageHostComponent } from './add-message-host.component';

describe('AddMessageHostComponent', () => {
  let component: AddMessageHostComponent;
  let fixture: ComponentFixture<AddMessageHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMessageHostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMessageHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
