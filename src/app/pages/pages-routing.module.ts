import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { VehiculeComponent } from './vehicules/list-vehicule/list-vehicule.component';
import { ParkingComponent } from './parkings/list-parking/list-parking.component';
import { DetailParkingComponent } from './detail-parking/list-detail-parking/list-detail-parking.component';
import { PlaceComponent } from './places/list-place/list-place.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'parking',
    component: ParkingComponent
  },
  {
    path: 'detail-parking/:id',
    component: DetailParkingComponent
  },
  {
    path: 'vehicule',
    component: VehiculeComponent
  },
  {
    path: 'place',
    component: PlaceComponent
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
