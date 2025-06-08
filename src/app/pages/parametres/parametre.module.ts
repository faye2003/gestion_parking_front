import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParametreRoutingModule } from './parametre-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbPaginationModule, NgbHighlight, NgbTooltipModule, } from '@ng-bootstrap/ng-bootstrap';
import { LocaliteComponent } from './localites/list-localites/list-localite.component';
import { TypeAccountComponent } from './type_accounts/list-type-account/list-type-account.component';
import { AccountComponent } from './accounts/list-accounts/list-account.component';
import { TypePaiementComponent } from './type_paiements/list-type-paiement/list-type-paiement.component';

@NgModule({
  declarations: [
    LocaliteComponent,
    TypeAccountComponent,
    AccountComponent,
    TypePaiementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ParametreRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    SharedModule,
    NgbHighlight,
    NgbTooltipModule
  ]
})
export class ParametreModule { }
