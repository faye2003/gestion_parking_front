import { NgModule } from "@angular/core";
import { ListUtilisateurComponent } from "./list-utilisateurs/list-utilisateur.component";
import { CommonModule } from "@angular/common";
import { UtilisateurRoutingModule } from "./utilisateur-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { NgbHighlight, NgbTooltipModule, NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    ListUtilisateurComponent
  ],
  imports: [
    CommonModule,
    UtilisateurRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbHighlight
  ]
})
export class UtilisateurModule { }
