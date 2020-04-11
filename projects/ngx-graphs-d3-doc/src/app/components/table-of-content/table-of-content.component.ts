import { Component, OnInit, Input } from '@angular/core';

/* Import Data models */
import { TableOfContentEntry } from '@doc/src/app/data-models/table-of-content-entry/table-of-content-entry';

@Component({
  selector: 'app-table-of-content',
  templateUrl: './table-of-content.component.html',
  styleUrls: ['./table-of-content.component.scss']
})
export class TableOfContentComponent implements OnInit {
  @Input() toc_title: string;
  @Input() toc_entries: TableOfContentEntry[] = [];
  @Input() toc_current_entry: TableOfContentEntry;

  constructor() {}

  ngOnInit(): void {
    // console.log('this.title', this.title);
    // console.log('this.entries', this.entries);
  }
}
