import { Component, OnInit } from "@angular/core";
import { Localite } from '../localite.model';
import { LocaliteService } from "../localite.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-localite',
  templateUrl: './list-localite.component.html',
  styleUrls: ['./list-localite.component.scss']
})


/**
 *  Dashboard Component
 */
export class LocaliteComponent implements OnInit {
  searchTerm: any;
  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 5;
  searchForm: FormGroup;
  localite!: Localite;
  editForm: FormGroup;
  errorMessage = "";
  errorMessage500 = "";
  actionModal = "";
  isSubmitted = false;
  submitted = false;

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  localites: Localite[] = [];

  constructor(private readonly localiteService: LocaliteService, private readonly fb: FormBuilder,
    private readonly modalService: NgbModal) {
    this.searchForm = this.fb.group({
      libelle: [''],
      search: ['']
    });
    this.editForm = this.fb.group({
      id: [''],
      libelle: ['', Validators.required],
      latitude: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      longitude: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]]
    })
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Localites', active: true }
    ];
    this.loadLocalites();
  }

  loadLocalites() {
    this.localiteService.getLocalites(this.page, this.pageSize, this.searchForm.value).subscribe(
      (response: any) => {
        if (response.status) {
          this.localites = response.data.data;
          this.totalItems = response.meta?.count || 0;
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
    if (item !== null) {
      this.localite = item
      this.editForm.patchValue({
        id: this.localite.id,
        libelle: this.localite.libelle,
        latitude: this.localite.latitude,
        longitude: this.localite.longitude
      });
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


  deleteLocalite() {
    this.localiteService.deleteLocalite(this.localite.id).subscribe(
      (response: any) => {
        if (this.isSuccessResponse(response)) {
          this.closeModal('ok');
          Swal.fire('Supprimé!', 'La localité a été supprimé.', 'success');
          this.loadLocalites();
        } else {
          this.errorMessage = response['message'];
          Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
        }
      }
    )
  }

  saveLocalite() {
    if (this.actionModal == "add") {
      // console.log(this.editForm.valid);
      if (this.editForm.valid) {
        this.isSubmitted = true;
        const formData = this.editForm.value;
        // console.log(formData.parent_id);
       this.localiteService.createLocalite(formData)
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
              this.loadLocalites();
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
      this.localiteService.updateLocalite(this.localite.id, this.editForm.value)
        .subscribe(
          (response: any) => {
            if (!response?.status) {
              this.errorMessage = response['message'];
              this.isSubmitted = false;
            } else {
              this.closeModal("ok");
              this.editForm.reset();
              this.loadLocalites();
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
      this.deleteLocalite();
    }
  }

}
