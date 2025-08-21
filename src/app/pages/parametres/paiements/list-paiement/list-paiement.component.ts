import { Component, OnInit } from "@angular/core";
import { Paiement } from "../paiement.model";
import { PaiementService } from "../paiement.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-paiement',
  templateUrl: './list-paiement.component.html',
  styleUrls: ['./list-paiement.component.scss']
})


/**
 *  Dashboard Component
 */
export class PaiementComponent implements OnInit {
  searchTerm: any;
  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 5;
  searchForm: FormGroup;
  editForm: FormGroup;
  paiement!: Paiement;
  errorMessage = "";
  errorMessage500 = "";
  actionModal = "";
  isSubmitted = false;
  submitted = false;
  today: string = new Date().toISOString().split('T')[0];

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  paiements: Paiement[] = [];

  constructor(
    private readonly paiementService: PaiementService,
    private readonly fb: FormBuilder,
    private readonly modalService: NgbModal,
  ) {
    this.searchForm = this.fb.group({
      id: [''],
      marque: [''],
      immatricule: [''],
      couleur: [''],
      parking: [''],
      search: ['']
    });
    this.editForm = this.fb.group({
      id: [''],
      marque: [''],
      immatricule: [''],
      couleur: ['']
    })
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Paiements', active: true }
    ];
    this.loadPaiements();
  }


  loadPaiements() {
    this.paiementService.getPaiements(this.page, this.pageSize, this.searchForm.value).subscribe(
      (response: any) => {
        if (response.status) {
          this.paiements =  response.data.data || [];
          console.log(this.paiements);
          this.totalItems = response.meta ? response.meta.total : 0;
        } else {
          this.errorMessage = response.message || 'Une erreur est survenue';
        }
      },
    );
  }

  showTable: boolean = true;
  public selectedProduct: any = null;

  showListBanque():void {
    this.showTable = true;
    this.selectedProduct = null;
  }

  itemPagination(event: any) {
    this.pageSize = event.target.value;
    this.loadPaiements();
  }

  
  openModal(modalname: any, item: any, action: any) {
    if (item !== null) {
      this.paiement = item
      this.editForm.patchValue(this.paiement);
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

  savePaiement() {
  if (this.actionModal == "add") {
    if (this.editForm.valid) {
      this.isSubmitted = true;
      const formData = this.editForm.value;
      this.paiementService.createPaiement(formData)
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
            this.loadPaiements();
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

    } else {
      this.errorMessage = "Veuillez remplir le formulaire";
    }
  } else {
    this.isSubmitted = true;
    this.paiementService.updatePaiement(this.paiement.id, this.editForm.value)
      .subscribe(
        (response: any) => {
          if (!response?.status) {
            this.errorMessage = response?.message;
            this.isSubmitted = false;
          } else {
            this.closeModal("ok");
            this.editForm.reset();
            this.loadPaiements();
            this.isSubmitted = false;
            Swal.fire('Mise à jour réussi !', response?.message || 'Mise à jour réussi.', 'success');
          }
        },
        _error => {
          this.isSubmitted = false;
          this.errorMessage = _error?.message || 'Erreur réseau ou serveur';
        }
      );
    }
  }
  

  deletePaiement() {
    this.paiementService.deletePaiement(this.paiement.id).subscribe(
      (response: any) => {
        if (response['status'] == "success") {
          this.closeModal('ok');
          Swal.fire('Supprimé!', 'cette banque de sanque a été supprimé.', 'success');
          this.loadPaiements();
        } else {
          this.errorMessage = response['message'];
          Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
        }
      }
    )
  }
  action() {
    if (this.actionModal == 'delete') {
      this.deletePaiement();
    }
  }

  
  get form() {
    return this.editForm.controls
  }

}
