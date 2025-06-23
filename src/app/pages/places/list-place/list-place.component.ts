import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Place } from '../place.model';
import { PlaceService } from '../place.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-place',
  templateUrl: './list-place.component.html',
  styleUrls: ['./list-place.component.scss']
})

export class PlaceComponent implements OnInit {
  @ViewChild('confirmation') confirmationModal!: TemplateRef<any>;
  
  searchTerm: any;
  totalItems = 0;
  page = 1;
  pageSize = 10;
  selectedPocheId: number | null = null;
  private modalRef!: NgbModalRef;
  searchForm: FormGroup;
  editForm: FormGroup;
  errorMessage = '';
  errorMessage500 = '';
  actionModal = '';
  isSubmitted = false;
  submitted = false;

  // bread crumb items
  breadCrumbItems: Array<{ label: string; active?: boolean }> = [];

  places: Place[] = [];
  Place: Place = {} as Place;
  donneurs: any[] = [];
  typesTransfert: any[] = [];
  campagnes: any[] = [];
  demandes: any[] = [];
  groupesSanguins: any[] = [];
  statuts = [
    { value: 'en_attente', libelle: 'En attente' },
    { value: 'validee', libelle: 'Validée' },
    { value: 'rejetee', libelle: 'Rejetée' },
    { value: 'terminee', libelle: 'Terminée' }
  ];

  constructor(
    private readonly placeService: PlaceService,
    private readonly fb: FormBuilder,
    private readonly modalService: NgbModal
  ) {
    this.searchForm = this.fb.group({
      motif: [''],
      statut: [''],
      type_transfert_id: [''],
      campagne_id: [''],
      search: ['']
    });

    this.editForm = this.fb.group({
      id: [''],
      quantite: [0, [Validators.required, Validators.min(1)]],
      donneur_id: ['', Validators.required],
      groupe_sanguin_id: ['', Validators.required],
      campagne_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Places', active: true }
    ];
    this.loadPlaces();
    this.loadCampagnes();
    this.loadDemandes();
  }

  loadCampagnes() {
    this.placeService.getCampagnes().subscribe(
      (response: any) => {
        if (response.status) {
          this.campagnes = response.data;
        } else {
          this.errorMessage = response.message || 'Erreur lors du chargement des campagnes';
        }
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement des campagnes';
        console.error(error);
      }
    );
  }

  loadDemandes() {
    this.placeService.getDemandes().subscribe(
      (response: any) => {
        if (response.status) {
          this.demandes = response.data;
        } else {
          this.errorMessage = response.message || 'Erreur lors du chargement des demandes';
        }
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement des demandes';
        console.error(error);
      }
    );
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
          this.places = response.data;
          this.totalItems = response.total || response.meta?.total || 0;
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

  onPageChange(page: number): void {
    this.page = page;
    this.loadPlaces();
  }

  confirmDelete(pocheId: number): void {
    this.selectedPocheId = pocheId;
    this.modalRef = this.modalService.open(this.confirmationModal, { centered: true });
  }

  deletePlace(): void {
    if (!this.selectedPocheId) return;
    
    this.placeService.deletePlace(this.selectedPocheId).subscribe(
      (response: any) => {
        if (response.status) {
          Swal.fire({
            title: 'Supprimé!',
            text: 'La poche de sang a été supprimée avec succès.',
            icon: 'success',
            confirmButtonColor: '#3b5de7',
          });
          this.loadPlaces();
        } else {
          this.errorMessage500 = response.message || 'Une erreur est survenue lors de la suppression';
        }
        this.modalRef.close();
      },
      (error) => {
        this.errorMessage500 = 'Une erreur est survenue lors de la suppression';
        console.error(error);
        this.modalRef.close();
      }
    );
  }

  onPageSizeChange(event: any): void {
    this.pageSize = Number(event.target.value);
    this.page = 1;
    this.loadPlaces();
  }

  onSearch(): void {
    this.page = 1;
    this.loadPlaces();
  }

  openModal(modal: any, place: Place | null, action: string): void {
    this.actionModal = action;
    this.isSubmitted = false;
    this.errorMessage = '';
    this.errorMessage500 = '';

    if (action === 'edit' && place) {
      this.editForm.patchValue({
      });
    } else {
      this.editForm.reset({
        nombre_poche: 0,
        statut: 'en_attente'
      });
    }

    this.modalService.open(modal, { centered: true, size: 'lg' });
  }

  closeModal(modal: any): void {
    modal.dismiss('Cross click');
  }



  savePlace(): void {
    this.isSubmitted = true;
    if (this.editForm.invalid) {
      return;
    }

    const formData = this.editForm.value;
    let request: Observable<any>;

    if (this.actionModal === 'add') {
      request = this.placeService.createPlace(formData);
    } else {
      request = this.placeService.updatePlace(formData.id, formData);
    }

    request.subscribe(
      (response: any) => {
        if (response.status) {
          this.modalService.dismissAll();
          this.loadPlaces();
          Swal.fire({
            title: 'Succès!',
            text: `Poche de sang ${this.actionModal === 'add' ? 'ajoutée' : 'modifiée'} avec succès`,
            icon: 'success',
            confirmButtonColor: '#3b5de7',
          });
        } else {
          this.errorMessage500 = response.message || 'Une erreur est survenue lors de la sauvegarde';
        }
      },
      (error) => {
        this.errorMessage500 = 'Une erreur est survenue lors de la sauvegarde';
        console.error(error);
      }
    );
  }



  get form() {
    return this.editForm.controls;
  }

  get actionText(): string {
    return this.actionModal === 'add' ? 'Ajouter' : 'Modifier';
  }

  loadGroupeSanguins() {
    // Implémentez cette méthode si nécessaire
    // Assurez-vous d'injecter le service groupeSanguinService dans le constructeur si vous en avez besoin
    console.warn('Méthode loadGroupeSanguins non implémentée');
  }

}
