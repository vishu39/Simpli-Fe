import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFollowUpComponent } from './download-follow-up.component';

describe('DownloadFollowUpComponent', () => {
  let component: DownloadFollowUpComponent;
  let fixture: ComponentFixture<DownloadFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadFollowUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
