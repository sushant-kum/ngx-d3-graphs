import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedAreaApiComponent } from './stacked-area-api.component';

describe('StackedAreaApiComponent', () => {
  let component: StackedAreaApiComponent;
  let fixture: ComponentFixture<StackedAreaApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StackedAreaApiComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedAreaApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
