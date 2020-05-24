import { TestBed } from '@angular/core/testing';

import { ScrollOffsetService } from './scroll-offset.service';

describe('ScrollOffsetService', () => {
  let service: ScrollOffsetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollOffsetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
