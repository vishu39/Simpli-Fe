import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadOpinionComponent } from './download-opinion.component';

describe('DownloadOpinionComponent', () => {
  let component: DownloadOpinionComponent;
  let fixture: ComponentFixture<DownloadOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadOpinionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
