import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  @Output() toc_itemClicked: EventEmitter<TableOfContentEntry> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onItemClicked(entry: TableOfContentEntry): void {
    this.toc_itemClicked.emit(entry);
  }
}
