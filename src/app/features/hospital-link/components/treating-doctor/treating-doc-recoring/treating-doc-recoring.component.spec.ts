import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatingDocRecoringComponent } from './treating-doc-recoring.component';

describe('TreatingDocRecoringComponent', () => {
  let component: TreatingDocRecoringComponent;
  let fixture: ComponentFixture<TreatingDocRecoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreatingDocRecoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatingDocRecoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
