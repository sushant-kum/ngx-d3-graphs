import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedAreaExamplesComponent } from './stacked-area-examples.component';

describe('StackedAreaExamplesComponent', () => {
  let component: StackedAreaExamplesComponent;
  let fixture: ComponentFixture<StackedAreaExamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StackedAreaExamplesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedAreaExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
