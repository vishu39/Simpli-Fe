import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultEmailComponent } from './default-email.component';

describe('DefaultEmailComponent', () => {
  let component: DefaultEmailComponent;
  let fixture: ComponentFixture<DefaultEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
