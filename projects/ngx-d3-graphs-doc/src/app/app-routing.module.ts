import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('projects/ngx-d3-graphs-doc/src/app/pages/root/root.module').then(module => module.RootModule)
  },
  {
    path: '**',
    loadChildren: () =>
      import('projects/ngx-d3-graphs-doc/src/app/pages/error/error.module').then(module => module.ErrorModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
