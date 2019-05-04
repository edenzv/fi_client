import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrPageComponent } from './ocr-page.component';

describe('OcrPageComponent', () => {
  let component: OcrPageComponent;
  let fixture: ComponentFixture<OcrPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcrPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcrPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
