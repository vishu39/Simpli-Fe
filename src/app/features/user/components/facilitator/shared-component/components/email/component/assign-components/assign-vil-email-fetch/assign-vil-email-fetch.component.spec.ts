import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVilEmailFetchComponent } from './assign-vil-email-fetch.component';

describe('AssignVilEmailFetchComponent', () => {
  let component: AssignVilEmailFetchComponent;
  let fixture: ComponentFixture<AssignVilEmailFetchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignVilEmailFetchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignVilEmailFetchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
