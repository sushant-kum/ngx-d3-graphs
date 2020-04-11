import { Injectable } from '@angular/core';

// import 'clipboard';

import 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';

declare var Prism: any;

@Injectable({
  providedIn: 'root'
})
export class CodeHighlighterService {
  constructor() {}

  highlight(code: string, language: 'html' | 'scss' | 'typescript'): string {
    const grammar = Prism.languages[language];
    return Prism.highlight(code, grammar, language);
  }
}
