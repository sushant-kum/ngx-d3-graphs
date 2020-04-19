import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('frame') frame: ElementRef;

  iframe_href: string;
  iframe_src: string;
  iframe_href_detect_interval: NodeJS.Timeout;

  constructor(private _snack_bar: MatSnackBar, private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this.iframe_src = '/assets/api-doc/';

    this._route.queryParams.pipe(filter(params => params.path)).subscribe(params => {
      this.iframe_src += params.path;
    });
  }

  ngAfterViewInit() {
    this.iframe_href_detect_interval = setInterval(() => {
      this.iframe_href = this.frame.nativeElement.contentWindow.location.href;
    }, 500);
  }

  copyPathToClipboard(): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.iframe_href;
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

  ngOnDestroy() {
    clearInterval(this.iframe_href_detect_interval);
  }
}
