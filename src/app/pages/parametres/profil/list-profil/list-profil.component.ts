import { Component, OnInit } from "@angular/core";
import { Profil } from "../profil.model";
import { ProfilService } from "../profil.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-profil',
    templateUrl: './list-profil.component.html',
    styleUrls: ['./list-profil.component.scss']
})


/**
 *  Dashboard Component
 */
export class ProfilComponent implements OnInit {
    searchTerm: any;
    totalItems: number = 0;
    page: number = 1;
    pageSize: number = 5;
    searchForm: FormGroup;
    profil!: Profil;
    editForm: FormGroup;
    errorMessage = "";
    errorMessage500 = "";
    actionModal = "";
    isSubmitted = false;
    submitted = false;

  // bread crumb items
  breadCrumbItems!: Array<{}>;


  profils: Profil[] = [];
  isLoading: boolean = false;
  isSaving: boolean = false;

  constructor(private profilService: ProfilService, private readonly fb: FormBuilder, private readonly modalService: NgbModal) 
  {
    this.searchForm = this.fb.group({
      nom: [''],
      search: ['']
    });
    this.editForm = this.fb.group({
      id: [''],
      nom: [''],
    })
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Profils', active: true }
    ];
    this.loadProfils();
  }

  loadProfils() {
    // console.log(this.searchForm.value);
    this.profilService.getProfils(this.page, this.pageSize, this.searchForm.value).subscribe(
      // users => this.users = users
        (response: any) => {
          if (response.status) {
            this.profils = response.data;
            this.totalItems = response.meta ? response.meta.total : 0;
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
      this.profil = item
      this.editForm.patchValue(this.profil);
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

  deleteProfil() {
    this.profilService.deleteProfil(this.profil.id).subscribe(
      (response: any) => {
        if (response['status'] == "success") {
          this.closeModal('ok');
          Swal.fire('Supprimé!', 'Le type account a été supprimé.', 'success');
          this.loadProfils();
        } else {
          this.errorMessage = response['message'];
          Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
        }
      }
    );
  }

  saveProfil() {
    if (this.actionModal == "add") {
      // console.log(this.editForm.valid);
      if (this.editForm.valid) {
        this.isSubmitted = true;
        const formData = this.editForm.value;
        // console.log(formData.parent_id);
        this.profilService.createProfil(formData)
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
                this.ngOnInit()
                this.isSubmitted = false;
                Swal.fire('Ajout réussi !', 'Le type account a été ajouté.', 'success');
              }
            }, _error => {
              this.isSubmitted = false;
              this.errorMessage = _error['message'];
            }
          );
      }
      else {
        this.errorMessage = "Veuillez remplir le formulaire";
      }
    } else {
      this.isSubmitted = true;
      this.profilService.updateProfil(this.profil.id, this.editForm.value)
        .subscribe(
          (res: any) => {
            if (res['status'] !== "success") {
              this.errorMessage = res['message'];
              this.isSubmitted = false;
            } else {
              this.closeModal("ok");
              this.editForm.reset();
              this.ngOnInit();
              this.isSubmitted = false;
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
      this.deleteProfil();
    } 
  }
  
  delProfil(id: number):void {
    this.profilService.deleteProfil(id).subscribe(
        (response) => {
          if (response.status) {
            Swal.fire('Supprimé!', 'Le type account a été supprimé.', 'success');
            this.ngOnInit();
          } else {
            this.errorMessage = response?.message || 'Une erreur est survenue lors de la récupération des profils';
            console.error('Erreur API:', response);
            this.isLoading = false;
          }
        },
        (error) => {
          console.error('Erreur lors du chargement des profils:', error);
          this.errorMessage500 = 'Une erreur est survenue lors de la récupération des profils';
          this.errorMessage = '';
          this.isLoading = false;
        }
      );
  }


}