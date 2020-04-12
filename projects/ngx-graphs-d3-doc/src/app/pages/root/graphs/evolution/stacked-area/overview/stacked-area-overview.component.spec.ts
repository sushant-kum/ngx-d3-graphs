import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedAreaOverviewComponent } from './stacked-area-overview.component';

describe('StackedAreaOverviewComponent', () => {
  let component: StackedAreaOverviewComponent;
  let fixture: ComponentFixture<StackedAreaOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StackedAreaOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedAreaOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
