import { ElementRef } from '@angular/core';

export interface TableOfContentEntry {
  name: string;
  fragment: string;
  element_ref?: ElementRef;
  step?: 2 | 3;
}
