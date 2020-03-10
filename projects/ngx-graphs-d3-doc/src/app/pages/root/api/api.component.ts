import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit, AfterViewInit {
  @ViewChild('frame') frame: ElementRef;
  path: string;
  constructor(private _snack_bar: MatSnackBar) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    setInterval(() => {
      this.path = this.frame.nativeElement.contentWindow.location.href;
    }, 500);
  }

  copyPathToClipboard(): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.path;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this._snack_bar.open('Link copied to clipboard successfully.', 'OK', {
      duration: 3000,
      announcementMessage: 'Link copied to clipboard successfully.'
    });
  }
}
