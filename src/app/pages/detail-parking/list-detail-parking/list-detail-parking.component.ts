import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';
import { Parking } from "../../parkings/parking.model";
import { DetailParking } from "../detail-parking.model";
import { DetailParkingService } from "../detail-parking.service";
import * as L from 'leaflet';

interface MarkerProperties {
  position: {
    lat: number;
    lng: number;
  }
};

@Component({
  selector: 'app-list-detail-parking',
  templateUrl: './list-detail-parking.component.html',
  styleUrls: ['./list-detail-parking.component.scss']
})


/**
 *  Dashboard Component
 */
export class DetailParkingComponent implements OnInit {
  searchTerm: any;
  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 5;
  searchForm: FormGroup;
  parking!: DetailParking;
  detail_parking!: any;
  map: any;
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

  detail_parkings: DetailParking | null = null;
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
      parking_id: [''],
    });
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Détail Parking', active: true }
    ];
    this.loadDetailParkings();
  }

  // loadProfils() {
  //   this.profilService.getProfils(this.page, 100, {}).subscribe(
  //     (response: any) => {
  //       if (response.status) {
  //         this.profils = response.data;
  //       } else {
  //         this.errorMessage = response.message || 'Une erreur est survenu';
  //       }
  //     },
  //   );
  // }
  

  loadDetailParkings() {
    console.log(this.parking);
     const idParam = this.route.snapshot.paramMap.get('id');
      this.detail_parking = idParam ? Number(idParam) : null;

      if (!this.detail_parking) {
        this.errorMessage = 'ID du parking non valide.';
        return;
      }
    this.detailParkingService.getDetailParkingsById(this.detail_parking).subscribe(
      (response: any) => {
        if (response) {
          this.detail_parkings = response;
          if (this.detail_parkings && this.detail_parkings.localite) {
            const lat = this.detail_parkings.localite.latitude;
            console.log(lat)
            const lng = this.detail_parkings.localite.longitude;

            if (lat && lng) {
              this.initMap(lat, lng);
            } else {
              this.errorMessage = "Coordonnées non disponibles pour ce parking.";
            }
          }

        } else {
          this.errorMessage = response.message || 'Une erreur est survenue';
        }
      },
    );
  }

  initMap(lat: number, lng: number) {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error("Le conteneur de la carte n'existe pas dans le DOM.");
      return;
    }

    const map = L.map('map').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map).bindPopup('Position du parking').openPopup();
  }

  mapOptions: google.maps.MapOptions = {
    center: { lat: 48.8588548, lng: 2.347035 },
    zoom: 13,
  };

  markers: MarkerProperties[] = [
    { position: { lat: 48.8584, lng: 2.2945 } }, // Eiffel Tower
    { position: { lat: 48.8606, lng: 2.3376 } }, // Louvre Museum
    { position: { lat: 48.8530, lng: 2.3499 } }, // Cathédrale Notre-Dame de Paris
  ];

  
  itemPagination(event: any) {
    this.pageSize = event.target.value;
    // this.loadDetailParkings();
  }

  openModal(modalname: any, item: any, action: any) {
    console.log(item);
    if (item !== null) {
      const formData: any = {
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

  
  // deleteDonneur() {
  //   this.donneurService.deleteDonneur(this.donneur.id).subscribe(
  //     (response: any) => {
  //       if (response['status'] == "success") {
  //         this.closeModal('ok');
  //         Swal.fire('Supprimé!', 'ce donneur a été supprimé.', 'success');
  //         this.loadDonneurs();
  //       } else {
  //         this.errorMessage = response['message'];
  //         Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
  //       }
  //     }
  //   )
  // }

  savePocheDeSang() {
    if (this.actionModal == "add") {
      // console.log(this.editForm.valid);
      if (this.editForm.valid) {
        this.isSubmitted = true;
        const formData = this.editForm.value;
        // console.log(formData.parent_id);
        this.detailParkingService.createDetailParking(formData)
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
                this.loadDetailParkings()
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
    }
  }

  get form() {
    return this.editForm.controls
  }

  action() {
    // if (this.actionModal == 'delete') {
    //   this.delete();
    // }
    // if (this.actionModal == 'stock') {
    //   this.mettreEnStock();
    // }
  }

}
