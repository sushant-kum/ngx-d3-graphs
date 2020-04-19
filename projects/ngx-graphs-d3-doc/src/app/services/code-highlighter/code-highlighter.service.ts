import { Injectable } from '@angular/core';

import 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-json';

declare var Prism: any;

@Injectable({
  providedIn: 'root'
})
export class CodeHighlighterService {
  constructor() {}

  highlight(code: string, language: 'html' | 'scss' | 'typescript' | 'json'): string {
    const grammar = Prism.languages[language];
    return Prism.highlight(code, grammar, language);
  }
}
