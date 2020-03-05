import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RootComponent } from './root.component';

const routes: Routes = [
  {
    path: '',
    component: RootComponent
  },
  {
    path: 'graphs',
    loadChildren: () => import('@doc/src/app/pages/root/graphs/graphs.module').then(module => module.GraphsModule)
  },
  {
    path: 'api',
    loadChildren: () => import('@doc/src/app/pages/root/api/api.module').then(module => module.ApiModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootRoutingModule {}
