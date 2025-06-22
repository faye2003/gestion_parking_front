import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';
import { Parking } from "../../parkings/parking.model";
import { DetailParking } from "../detail-parking.model";
import { DetailParkingService } from "../detail-parking.service";

@Component({
  selector: 'app-list-detail-campagne',
  templateUrl: './list-detail-campagne.component.html',
  styleUrls: ['./list-detail-campagne.component.scss']
})


/**
 *  Dashboard Component
 */
export class DetailCampagneComponent implements OnInit {
  searchTerm: any;
  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 5;
  searchForm: FormGroup;
  parking: any = null;
  detail_parking!: number;
  ids!: number;
  editForm!: FormGroup;
  editFormValid!: FormGroup;
  errorMessage = "";
  errorMessage500 = "";
  actionModal = "";
  isSubmitted = false;
  submitted = false;

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  detail_parkings: DetailParking[] = [];
  poche_selecteds!: number;
  currentDate!: any;

  constructor(
    private readonly detailParkingService: DetailParkingService,
    private route: ActivatedRoute, 
    private readonly fb: FormBuilder,
    private readonly modalService: NgbModal,
  ) {
    this.searchForm = this.fb.group({
      id: [''],
      search: ['']
    });
    this.editForm = this.fb.group({
      id: [''],
      quantite: [''],
      donneur_id: [''],
      groupe_sanguin_id: [''],
      campagne_id: [''],
    });
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Détail Campagne', active: true }
    ];
    this.loadDetailCampagnes();
    this.loadProfils();
    const id = this.route.snapshot.params['id'];
    this.detailParkingService.getDetailParkingsById(id).subscribe((response: any) => {
      this.parking = response.parkings[0];
    });
  }

  loadProfils() {
    this.profilService.getProfils(this.page, 100, {}).subscribe(
      (response: any) => {
        if (response.status) {
          this.profils = response.data;
        } else {
          this.errorMessage = response.message || 'Une erreur est survenu';
        }
      },
    );
  }

  loadDetailCampagnes() {
    console.log(this.parking);
    this.detail_parking = Number(this.route.snapshot.paramMap.get('id'));
    this.detailParkingService.getDetailParkingsById(this.detail_parking).subscribe(
      (response: any) => {
        if (response.status) {
          this.detail_parkings = response.campagnes;
          this.totalItems = response.meta ? response.meta.total : 0;
        } else {
          this.errorMessage = response.message || 'Une erreur est survenue';
        }
      },
    );
  }
  
  itemPagination(event: any) {
    this.pageSize = event.target.value;
    // this.loadDetailCampagnes();
  }

  openModal(modalname: any, item: any, action: any) {
    console.log(item);
    if (item !== null) {
      this.poche_sang = item
      const formData: any = {
        quantite: (this.poche_sang as any).quantite,
        donneur_id: (this.poche_sang as any).donneur?.id,
        groupe_sanguin_id: (this.poche_sang as any).groupe_sanguin?.id,
        campagne_id: this.poche_sang.campagne?.id
      };
      this.editForm.patchValue(formData);
    } else {
      this.editForm.reset();
    }
    this.actionModal = action
    this.modalService.open(modalname, { centered: true, size: 'lg' });
  }

  closeModal(_modalname: any) {
    this.modalService.dismissAll();
    this.errorMessage = "";
    this.errorMessage500 = ""
  }

  getBadgeClass(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'validée':
        return 'badge bg-success text-white';
      case 'brouillon':
        return 'badge bg-secondary text-white';
      default:
        return 'badge bg-light text-dark';
    }
  }

  mettreEnStock() {
    const ids = this.campagne_poche_sangs.filter(p => p.selected && p.statut === 'Validée').map(p => p.id);
    this.poche_selecteds = ids.length;
    console.log(ids);
    if (ids.length === 0) return;

    this.transfertPocheService.transfertPoche(ids).subscribe(
      (response: any) => {
        if (response['status'] == "success") {
          this.closeModal('ok');
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Les poches ont été mises en stock avec succès.',
            confirmButtonText: 'OK'
          }).then(() => {
            // Recharge la page après que l'utilisateur ait cliqué sur "OK"
            window.location.reload();
          });
        } else {
          this.errorMessage = response['message'];
          Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
        }
    });
  }
  
  deleteDonneur() {
    this.donneurService.deleteDonneur(this.donneur.id).subscribe(
      (response: any) => {
        if (response['status'] == "success") {
          this.closeModal('ok');
          Swal.fire('Supprimé!', 'ce donneur a été supprimé.', 'success');
          this.loadDonneurs();
        } else {
          this.errorMessage = response['message'];
          Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
        }
      }
    )
  }

  savePocheDeSang() {
    if (this.actionModal == "add") {
      // console.log(this.editForm.valid);
      if (this.editForm.valid) {
        this.isSubmitted = true;
        const formData = this.editForm.value;
        // console.log(formData.parent_id);
        this.pocheDeSangService.createPocheSang(formData)
          .subscribe(
            (res: any) => {
              if (res['status'] !== "success") {
                this.isSubmitted = false;
                this.errorMessage = res['message'];
                Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
              }
              else {
                this.closeModal("add");
                this.editForm.reset()
                this.loadPocheSangs()
                this.isSubmitted = false;
                Swal.fire('Ajout réussi !', 'Poche de Sang a été ajouté.', 'success');
              }
            }, _error => {
              this.isSubmitted = false;
              this.errorMessage = _error['message'];
            }
          );
      }
      else {
        this.errorMessage = "Veuillez remplir le formulaire"
      }
    } else {
      this.isSubmitted = true;
      this.pocheDeSangService.updatePocheSang(this.poche_sang.id, this.editForm.value)
        .subscribe(
          (res: any) => {
            if (res['status'] !== "success") {
              this.errorMessage = res['message'];
              this.isSubmitted = false;
            } else {
              this.closeModal("ok");
              this.editForm.reset();
              this.loadPocheSangs();
              this.isSubmitted = false;
                Swal.fire('Ajout réussi !', 'ce poche de sang a été mis à jour.', 'success');
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

  get formDonneur() {
    return this.editFormDonneur.controls
  }

  action() {
    if (this.actionModal == 'delete') {
      this.deleteDonneur();
    }
    if (this.actionModal == 'stock') {
      this.mettreEnStock();
    }
  }

}
