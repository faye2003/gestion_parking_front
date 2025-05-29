import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUtilisateurComponent } from './list-utilisateurs/list-utilisateur.component';

const routes: Routes = [
    {
        path: '',
        component: ListUtilisateurComponent,
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UtilisateurRoutingModule { }
