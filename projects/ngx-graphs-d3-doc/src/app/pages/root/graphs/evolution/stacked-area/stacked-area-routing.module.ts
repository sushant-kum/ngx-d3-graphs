import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StackedAreaComponent } from './stacked-area.component';

const routes: Routes = [
  {
    path: '',
    component: StackedAreaComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadChildren: () =>
          import('@doc/src/app/pages/root/graphs/evolution/stacked-area/overview/overview.module').then(
            module => module.OverviewModule
          )
      },
      {
        path: 'api',
        loadChildren: () =>
          import('@doc/src/app/pages/root/graphs/evolution/stacked-area/api/api.module').then(
            module => module.ApiModule
          )
      },
      {
        path: 'examples',
        loadChildren: () =>
          import('@doc/src/app/pages/root/graphs/evolution/stacked-area/examples/examples.module').then(
            module => module.ExamplesModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StackedAreaRoutingModule {}
