import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalImagePreviewerComponent } from './global-image-previewer.component';

describe('GlobalImagePreviewerComponent', () => {
  let component: GlobalImagePreviewerComponent;
  let fixture: ComponentFixture<GlobalImagePreviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalImagePreviewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalImagePreviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
