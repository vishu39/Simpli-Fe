import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnPremiseUserComponent } from './on-premise-user.component';

describe('OnPremiseUserComponent', () => {
  let component: OnPremiseUserComponent;
  let fixture: ComponentFixture<OnPremiseUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnPremiseUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnPremiseUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
