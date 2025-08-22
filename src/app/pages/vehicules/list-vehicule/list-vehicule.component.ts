import { Component, OnInit } from "@angular/core";
import { Vehicule } from "../vehicule.model";
import { VehiculeService } from "../vehicule.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';
import { Localite } from "../../parametres/localites/localite.model";
import { LocaliteService } from "../../parametres/localites/localite.service";

@Component({
  selector: 'app-list-vehicule',
  templateUrl: './list-vehicule.component.html',
  styleUrls: ['./list-vehicule.component.scss']
})


/**
 *  Dashboard Component
 */
export class VehiculeComponent implements OnInit {
  searchTerm: any;
  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 5;
  searchForm: FormGroup;
  editForm: FormGroup;
  vehicule!: Vehicule;
  errorMessage = "";
  errorMessage500 = "";
  actionModal = "";
  isSubmitted = false;
  submitted = false;
  today: string = new Date().toISOString().split('T')[0];

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  vehicules: Vehicule[] = [];
  localites: Localite[] = [];

  constructor(
    private readonly vehiculeService: VehiculeService,
    private readonly localiteService: LocaliteService,
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
      { label: 'Vehicules', active: true }
    ];
    this.loadVehicules();
    this.loadLocalites();
  }


  loadLocalites() {
    this.localiteService.getLocalites(this.page, 100, {}).subscribe(
      (response: any) => {
        if (response.status) {
          this.localites = response.data;
        } else {
          this.errorMessage = response.message || 'Une erreur est survenu';
        }
      },
    );
  }


  loadVehicules() {
    this.vehiculeService.getVehicules(this.page, this.pageSize, this.searchForm.value).subscribe(
      (response: any) => {
        if (response.status) {
          this.vehicules =  response.data.data || [];
          console.log(this.vehicules);
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
    this.loadVehicules();
  }

  
  openModal(modalname: any, item: any, action: any) {
    if (item !== null) {
      this.vehicule = item
      this.editForm.patchValue(this.vehicule);
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

  saveVehicule() {
  if (this.actionModal == "add") {
    if (this.editForm.valid) {
      this.isSubmitted = true;
      const formData = this.editForm.value;
      this.vehiculeService.createVehicule(formData)
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
            this.loadVehicules();
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
    this.vehiculeService.updateVehicule(this.vehicule.id, this.editForm.value)
      .subscribe({
        next: (response: any) => {
          if (!response?.status) {
            this.errorMessage = response?.message;
            this.isSubmitted = false;
          } else {
            this.closeModal("ok");
            this.editForm.reset();
            this.loadVehicules();
            this.isSubmitted = false;
            Swal.fire('Mise à jour réussi !', response?.message || 'Mise à jour réussi.', 'success');
          }
        },
        error: (_error) => {
          this.isSubmitted = false;
          this.errorMessage = _error?.error?.message || 'Erreur réseau ou serveur';
          Swal.fire('Erreur!', this.errorMessage, 'error');
        }
      });
    }
  }
  
  isSuccessResponse(response: any): boolean {
    return response && typeof response === 'object' && response.status === true;
  }

  deleteVehicule() {
    this.vehiculeService.deleteVehicule(this.vehicule.id).subscribe(
      (response: any) => {
        if (this.isSuccessResponse(response)) {
          this.closeModal('ok');
          Swal.fire('Supprimé!', 'Ce Véhicule a été supprimé.', 'success');
          this.loadVehicules();
        } else {
          this.errorMessage = response?.message;
          Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
        }
      }
    );
  }

  action() {
    if (this.actionModal == 'delete') {
      this.deleteVehicule();
    }
  }

  
  get form() {
    return this.editForm.controls
  }

}
