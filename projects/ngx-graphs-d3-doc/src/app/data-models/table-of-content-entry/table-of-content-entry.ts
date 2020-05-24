import { ElementRef } from '@angular/core';
import { ScrollOffset } from '../scroll-offset/scroll-offset';

export interface TableOfContentEntry {
  name: string;
  fragment: string;
  element_ref?: ElementRef;
  element_offset?: ScrollOffset;
  step?: 1 | 2 | 3;
}
