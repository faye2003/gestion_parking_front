import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    // canActivate: [AuthGuard],
    data: {
      roles: ['ADMIN', 'SUPER_ADMIN']
    },
    path: 'utilisateur',
    loadChildren: () => import('./utilisateurs/utilisateur.module').then(m => m.UtilisateurModule),
  },
  {
    path: 'parametre',
    // canActivate: [AuthGuard],
    loadChildren: () => import('./parametres/parametre.module').then(m => m.ParametreModule),
    data: {
      roles: ['ADMIN', 'SUPER_ADMIN']
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
