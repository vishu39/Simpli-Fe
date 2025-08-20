import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordOpinionComponent } from './record-opinion.component';

describe('RecordOpinionComponent', () => {
  let component: RecordOpinionComponent;
  let fixture: ComponentFixture<RecordOpinionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordOpinionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
