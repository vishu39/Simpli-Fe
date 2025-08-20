import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedImagePreviewerComponent } from './detailed-image-previewer.component';

describe('DetailedImagePreviewerComponent', () => {
  let component: DetailedImagePreviewerComponent;
  let fixture: ComponentFixture<DetailedImagePreviewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedImagePreviewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedImagePreviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
