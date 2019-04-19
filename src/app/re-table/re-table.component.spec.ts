import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReTableComponent } from './re-table.component';

describe('ReTableComponent', () => {
  let component: ReTableComponent;
  let fixture: ComponentFixture<ReTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
