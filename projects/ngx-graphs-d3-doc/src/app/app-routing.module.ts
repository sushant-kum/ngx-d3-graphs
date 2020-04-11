import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';

import { environment as env } from '@doc/src/environments/environment';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@doc/src/app/pages/root/root.module').then(module => module.RootModule)
  },
  {
    path: '**',
    loadChildren: () => import('@doc/src/app/pages/error/error.module').then(module => module.ErrorModule)
  }
];

const router_option: ExtraOptions = {
  enableTracing: env.production ? false : true,
  anchorScrolling: 'enabled',
  onSameUrlNavigation: 'ignore',
  scrollPositionRestoration: 'enabled',
  scrollOffset: [0, 53.5]
};

@NgModule({
  imports: [RouterModule.forRoot(routes, router_option)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
