import { Injectable } from '@angular/core';
import { ScrollOffset } from '../../data-models/scroll-offset/scroll-offset';

@Injectable({
  providedIn: 'root'
})
export class ScrollOffsetService {
  constructor() {}

  getOffset(el: HTMLElement): ScrollOffset {
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  }
}
