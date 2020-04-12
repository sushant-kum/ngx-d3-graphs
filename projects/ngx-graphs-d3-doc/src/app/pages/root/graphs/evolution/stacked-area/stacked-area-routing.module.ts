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
          import('@doc/src/app/pages/root/graphs/evolution/stacked-area/overview/stacked-area-overview.module').then(
            module => module.StackedAreaOverviewModule
          )
      },
      {
        path: 'api',
        loadChildren: () =>
          import('@doc/src/app/pages/root/graphs/evolution/stacked-area/api/stacked-area-api.module').then(
            module => module.StackedAreaApiModule
          )
      },
      {
        path: 'examples',
        loadChildren: () =>
          import('@doc/src/app/pages/root/graphs/evolution/stacked-area/examples/stacked-area-examples.module').then(
            module => module.StackedAreaExamplesModule
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
