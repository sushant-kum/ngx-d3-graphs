import { Component, OnInit, Input } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';

import { CodeSnippet } from '@doc/src/app/data-models/code-snippet/code-snippet';
import { CodeHighlighterService } from '@doc/src/app/services/code-highlighter/code-highlighter.service';

interface Mode {
  show_source: boolean;
}
@Component({
  selector: 'app-usage-example',
  templateUrl: './usage-example.component.html',
  styleUrls: ['./usage-example.component.scss']
})
export class UsageExampleComponent implements OnInit {
  @Input() ue_width_px: number;
  @Input() ue_height_px: number;
  @Input() ue_external_url: string;
  @Input() ue_external_tooltip: string;
  @Input() ue_src: string;
  @Input() ue_title: string;
  @Input() ue_source_code: CodeSnippet[];

  mode: Mode = {
    show_source: false
  };

  constructor(
    private _snack_bar: MatSnackBar,
    private _clipboard: Clipboard,
    public code_highlighter: CodeHighlighterService
  ) {}

  ngOnInit(): void {
    if (this.ue_height_px === undefined) {
      this.ue_height_px = 450;
    }
  }

  copyToClipBoard(str: string): void {
    const pending = this._clipboard.beginCopy(str);
    const result = pending.copy();
    pending.destroy();

    if (result) {
      this._snack_bar.open('File content copied to clipboard successfully.', 'OK', {
        duration: 3000,
        announcementMessage: 'File content copied to clipboard successfully.'
      });
    } else {
      const failure_snackbar = this._snack_bar.open('Filed to copy file content.', 'Retry', {
        duration: 3000,
        announcementMessage: 'Filed to copy file content.'
      });

      failure_snackbar.onAction().subscribe(() => {
        this.copyToClipBoard(str);
      });
    }
  }
}
