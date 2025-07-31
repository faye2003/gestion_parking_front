import { Component, OnInit } from "@angular/core";
import { Parking } from "../parking.model";
import { ParkingService } from "../parking.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';
import { Localite } from "../../parametres/localites/localite.model";
import { LocaliteService } from "../../parametres/localites/localite.service";

@Component({
  selector: 'app-list-parking',
  templateUrl: './list-parking.component.html',
  styleUrls: ['./list-parking.component.scss']
})


/**
 *  Dashboard Component
 */
export class ParkingComponent implements OnInit {
  searchTerm: any;
  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 5;
  searchForm: FormGroup;
  parking!: Parking;
  editForm: FormGroup;
  errorMessage = "";
  errorMessage500 = "";
  actionModal = "";
  isSubmitted = false;
  submitted = false;
  today: string = new Date().toISOString().split('T')[0];

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  parkings: Parking[] = [];
  localites: Localite[] = [];

  constructor(
    private readonly parkingService: ParkingService,
    private readonly localiteService: LocaliteService,
    private readonly fb: FormBuilder,
    private readonly modalService: NgbModal,
  ) {
    this.searchForm = this.fb.group({
      id: [''],
      libelle: [''],
      statut: [''],
      search: ['']
    });
    this.editForm = this.fb.group({
      id: [''],
      libelle: [''],
      description: [''],
      statut: [''],
      localite_id: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Parkings', active: true }
    ];
    this.loadParkings();
    this.loadLocalites();
  }


  loadLocalites() {
    this.localiteService.getLocalites(this.page, 100, {}).subscribe(
      (response: any) => {
        if (response.status) {
          this.localites = response.data.data;
        } else {
          this.errorMessage = response.message || 'Une erreur est survenu';
        }
      },
    );
  }


  loadParkings() {
    this.parkingService.getParkings(this.page, this.pageSize, this.searchForm.value).subscribe(
      (response: any) => {
        if (response.status) {
          this.parkings = response.data.data || [];
          console.log(this.parkings);
          this.totalItems =  response.meta?.count || 0;
        } else {
          this.errorMessage = response.message || 'Une erreur est survenue';
        }
      },
    );
  }

  itemPagination(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.page = 1;  // ✅ remettre la pagination à la première page
    this.ngOnInit();
  }

  openModal(modalname: any, item: any, action: any) {
    console.log(item);
    if (item !== null) {
      this.parking = item
      this.editForm.patchValue({
        id: this.parking.id,
        libelle: this.parking.libelle,
        description: this.parking.description,
        statut: this.parking.statut,
        localite_id: this.parking.localite?.id,
      });
    } else {
      this.editForm.reset();
    }
    this.actionModal = action
    this.modalService.open(modalname, { centered: true , size: 'lg' });
  }

  closeModal(_modalname: any) {
    this.modalService.dismissAll();
    this.errorMessage = "";
    this.errorMessage500 = ""
  }


  isSuccessResponse(response: any): boolean {
    return response && typeof response === 'object' && response.status === true;
  }

  deleteParking() {
    this.parkingService.deleteParking(this.parking.id).subscribe(
      (response: any) => {
        if (this.isSuccessResponse(response)) {
          this.closeModal('ok');
          Swal.fire('Supprimé!', 'cette banque de sanque a été supprimé.', 'success');
          this.loadParkings();
        } else {
          this.errorMessage = response['message'];
          Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
        }
      }
    )
  }

  saveParking() {
    if (this.actionModal == "add") {
      // console.log(this.editForm.valid);
      if (this.editForm.valid) {
        this.isSubmitted = true;
        const formData = this.editForm.value;
        // console.log(formData.parent_id);
        this.parkingService.createParking(formData)
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
                this.loadParkings();
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
        this.errorMessage = "Veuillez remplir le formulaire"
      }
    } else {
      this.isSubmitted = true;
      this.parkingService.updateParking(this.parking.id, this.editForm.value)
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
              this.loadParkings();
              this.isSubmitted = false;
              Swal.fire('Mise à jour réussi !', response.message || 'Mise à jour réussi.', 'success');
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

  get form() {
    return this.editForm.controls
  }

  action() {
    if (this.actionModal == 'delete') {
      this.deleteParking();
    }
  }

}
