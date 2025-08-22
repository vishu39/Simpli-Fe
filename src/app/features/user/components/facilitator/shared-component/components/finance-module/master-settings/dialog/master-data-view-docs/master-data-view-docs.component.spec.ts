import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataViewDocsComponent } from './master-data-view-docs.component';

describe('MasterDataViewDocsComponent', () => {
  let component: MasterDataViewDocsComponent;
  let fixture: ComponentFixture<MasterDataViewDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterDataViewDocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDataViewDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
