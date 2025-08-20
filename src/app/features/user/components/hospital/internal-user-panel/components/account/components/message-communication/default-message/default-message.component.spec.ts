import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultMessageComponent } from './default-message.component';

describe('DefaultMessageComponent', () => {
  let component: DefaultMessageComponent;
  let fixture: ComponentFixture<DefaultMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
