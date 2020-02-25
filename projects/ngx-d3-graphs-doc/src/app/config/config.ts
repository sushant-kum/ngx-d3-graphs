import { environment as env } from 'projects/ngx-d3-graphs-doc/src/environments/environment';

export const CONFIG = env.production
  ? {
      app_title: 'NGX D3 Graphs',
      lib_version: '0.0.0',
      doc_version: '0.0.0'
    }
  : {
      app_title: 'NGX D3 Graphs (Dev)',
      lib_version: '0.0.0',
      doc_version: '0.0.0.dev'
    };
