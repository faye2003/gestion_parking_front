import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocaliteComponent } from './localites/list-localites/list-localite.component';
import { TypeAccountComponent } from './type_accounts/list-type-account/list-type-account.component';
import { AccountComponent } from './accounts/list-accounts/list-account.component';
import { TypePaiementComponent } from './type_paiements/list-type-paiement/list-type-paiement.component';
const routes: Routes = [
  {
    path: 'localite',
    component: LocaliteComponent
  },
  {
    path: 'type-account',
    component: TypeAccountComponent
  },
  {
    path: 'account',
    component: AccountComponent
  },
  {
    path: 'type-paiement',
    component: TypePaiementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametreRoutingModule { }
