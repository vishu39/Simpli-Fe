import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalUserMainLayoutComponent } from './internal-user-main-layout.component';

describe('InternalUserMainLayoutComponent', () => {
  let component: InternalUserMainLayoutComponent;
  let fixture: ComponentFixture<InternalUserMainLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalUserMainLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalUserMainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
