import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';
import { Parking } from "../../parkings/parking.model";
import { DetailParking } from "../detail-parking.model";
import { DetailParkingService } from "../detail-parking.service";
import { Place } from "../../places/place.model";
import { PlaceService } from "../../places/place.service";
import * as L from 'leaflet';
declare var google: any;
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
  place!: Place;
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
  places: Place [] = [];
  poche_selecteds!: number;
  currentDate!: any;

  constructor(
    private readonly detailParkingService: DetailParkingService,
    private readonly placeService: PlaceService,
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
      heure_entree: [0],
      heure_sortie: [0],
      parking: [''],
      vehicule: ['']
    });
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Détail Parking', active: true }
    ];
    this.loadDetailParkings();
    this.loadPlaces();
  }

  loadPlaces() {
    console.log('Loading poches de sang with params:', {
      page: this.page,
      pageSize: this.pageSize,
      search: this.searchForm.value
    });
    
    this.placeService.getPlaces(this.page, this.pageSize, this.searchForm.value).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response && response.data) {
          this.places = this.detail_parkings?.places ?? [];
          if (this.places) {
            this.totalItems = response.meta?.count || 0
          }
        } else {
          console.error('Invalid response format:', response);
          this.errorMessage = 'Format de réponse invalide du serveur';
        }
      },
      (error) => {
        console.error('API Error:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Erreur lors du chargement des poches de sang';
        }
      }
    );
  }
  

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

  initMap(lat: number, lng: number): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Le conteneur de la carte est introuvable.');
      return;
    }

    const map = new google.maps.Map(mapElement, {
      center: { lat: lat, lng: lng },
      zoom: 15,
    });

    new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map,
      title: "Position du parking"
    });
  }


  // initMap(lat: number, lng: number) {
  //   const mapContainer = document.getElementById('map');
  //   if (!mapContainer) {
  //     console.error("Le conteneur de la carte n'existe pas dans le DOM.");
  //     return;
  //   }

  //   const map = L.map('map').setView([lat, lng], 15);
  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution: '&copy; OpenStreetMap contributors'
  //   }).addTo(map);

  //   L.marker([lat, lng]).addTo(map).bindPopup('Position du parking').openPopup();
  // }

  
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

savePlace() {
  if (this.actionModal == "add") {
    if (this.editForm.valid) {
    console.log('sfghhvnbvc')
      this.isSubmitted = true;
      const formData = this.editForm.value;
      this.placeService.createPlace(formData)
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
            this.loadPlaces();
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
    this.placeService.updatePlace(this.place.id, this.editForm.value)
      .subscribe(
        (response: any) => {
          if (!response?.status) {
            this.errorMessage = response?.message;
            this.isSubmitted = false;
          } else {
            this.closeModal("ok");
            this.editForm.reset();
            this.loadPlaces();
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
