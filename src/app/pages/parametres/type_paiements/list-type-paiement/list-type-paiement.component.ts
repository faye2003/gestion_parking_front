import { Component, OnInit } from "@angular/core";
import { TypePaiement } from '../type-paiement.model';
import { TypePaiementService } from "../type-paiement.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-type-paiement',
    templateUrl: './list-type-paiement.component.html',
    styleUrls: ['./list-type-paiement.component.scss']
})


/**
 *  Dashboard Component
 */
export class TypePaiementComponent implements OnInit {
    searchTerm: any;
    totalItems: number = 0;
    page: number = 1;
    pageSize: number = 5;
    searchForm: FormGroup;
    type_paiement!: TypePaiement;
    editForm: FormGroup;
    errorMessage = "";
    errorMessage500 = "";
    actionModal = "";
    isSubmitted = false;
    submitted = false;

  // bread crumb items
  breadCrumbItems!: Array<{}>;


  type_paiements: TypePaiement[] = [];

  constructor(private typePaiementService: TypePaiementService, private readonly fb: FormBuilder, private readonly modalService: NgbModal) 
  {
    this.searchForm = this.fb.group({
      libelle: [''],
      search: ['']
    });
    this.editForm = this.fb.group({
      id: [''],
      libelle: [''],
    })
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Type Paiements', active: true }
    ];
    this.loadTypePaiements();
  }

  loadTypePaiements() {
    this.typePaiementService.getTypePaiements(this.page, this.pageSize, this.searchForm.value).subscribe(
      // users => this.users = users
        (response: any) => {
          if (response.status) {
            this.type_paiements = response.data.data || [];
            this.totalItems = response.meta?.count || 0;
          } else {
            this.errorMessage = response.message || 'Une erreur est survenue';
          }
        },
    );
  }

  itemPagination(event: any) {
    this.pageSize = event.target.value;
    this.ngOnInit();
  }

  openModal(modalname: any, item: any, action: any) {
    if (item !== null) {
      this.type_paiement = item
      this.editForm.patchValue(this.type_paiement);
    } else {
      this.editForm.reset();
    }
    this.actionModal = action
    this.modalService.open(modalname, { centered: true });
  }

  closeModal(_modalname: any) {
    this.modalService.dismissAll();
    this.errorMessage = "";
    this.errorMessage500 = ""
  }

   isSuccessResponse(response: any): boolean {
      return response && typeof response === 'object' && response.status === true;
    }
  
  
    deleteTypePaiement() {
      this.typePaiementService.deleteTypePaiement(this.type_paiement.id).subscribe(
        (response: any) => {
          if (this.isSuccessResponse(response)) {
            this.closeModal('ok');
            Swal.fire('Supprimé!', 'Le type paiement a été supprimé.', 'success');
            this.loadTypePaiements();
          } else {
            this.errorMessage = response?.message;
            Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
          }
        }
      );
    }

  saveTypePaiement() {
    if (this.actionModal == "add") {
      // console.log(this.editForm.valid);
      if (this.editForm.valid) {
        this.isSubmitted = true;
        const formData = this.editForm.value;
        // console.log(formData.parent_id);
        this.typePaiementService.createTypePaiement(formData)
        .subscribe({
          next: (response: any) => {
            console.log('Réponse backend :', response);
            if (!response?.status) {
              this.isSubmitted = false;
              this.errorMessage = response?.message || 'Une erreur est survenue.';
              Swal.fire('Erreur!', this.errorMessage, 'error');
            } else {
              this.closeModal("add");
              this.editForm.reset();
              this.loadTypePaiements();
              this.isSubmitted = false;
              Swal.fire('Ajout réussi !', response.message || 'Ajout réussi.', 'success');
            }
          },
          error: (_error) => {
            this.isSubmitted = false;
            this.errorMessage = _error?.error?.message || 'Erreur réseau ou serveur';
            Swal.fire('Erreur!', this.errorMessage, 'error');
          }
        });
        
      }
      else {
        this.errorMessage = "Veuillez remplir le formulaire";
      }
    } else {
      this.isSubmitted = true;
      this.typePaiementService.updateTypePaiement(this.type_paiement.id, this.editForm.value)
        .subscribe(
          (response: any) => {
            if (!response?.status) {
              this.errorMessage = response['message'];
              this.isSubmitted = false;
            } else {
              this.closeModal("ok");
              this.editForm.reset();
              this.loadTypePaiements();
              this.isSubmitted = false;
              Swal.fire('Mise à jour réussi !', response?.message || 'Mise à jour réussi.', 'success');
            }
          }, _error => {
            this.isSubmitted = false;
            this.errorMessage = _error['message'];
          }
        );
    }
  }

  get form() {
    return this.editForm.controls
  }

  action() {
    if (this.actionModal == 'delete') {
      this.deleteTypePaiement();
    } 
  }
  
  delTypePaiement(id: number):void {
    this.typePaiementService.deleteTypePaiement(id).subscribe(
        (response) => {
          if (response.status) {
            Swal.fire('Supprimé!', 'Le type paiement a été supprimé.', 'success');
            this.ngOnInit();
          } else {
            Swal.fire('Erreur!', response.message || 'Une erreur est survenue.', 'error');
          }
        },
        (error) => {
          Swal.fire('Erreur!', 'Une erreur est survenue lors de la suppression.', 'error');
        }
      );
  }


}