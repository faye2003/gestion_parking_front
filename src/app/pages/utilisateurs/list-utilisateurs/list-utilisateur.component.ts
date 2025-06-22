import { Component, OnInit, inject } from "@angular/core";
import { Utilisateur } from '../utilisateur.model';
import { UserService } from "../utilisateur.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';
import { ProfilService } from "../../parametres/profil/profil.service";

@Component({
  selector: 'app-utilisateur',
  templateUrl: './list-utilisateur.component.html',
  styleUrls: ['./list-utilisateur.component.scss']
})


/**
 *  Dashboard Component
 */
export class ListUtilisateurComponent implements OnInit {
  displayedColumns = ['name', 'email', 'bloodGroup', 'status', 'actions'];
  breadCrumbItems!: Array<{}>;
  searchTerm: any;
  users: Utilisateur[] = [];
  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 5;
  searchForm: FormGroup;
  editForm: FormGroup;
  user!: Utilisateur;
  errorMessage = "";
  errorMessage500 = "";
  actionModal = "";
  isSubmitted = false;
  submitted = false;
  profils: any[] = [];

  constructor(private readonly userService: UserService, private readonly profilService: ProfilService, private readonly fb: FormBuilder,
    private readonly modalService: NgbModal
  ) {
    this.searchForm = this.fb.group({
      prenom: [''],
      email: [''],
      nom: [''],
      search: ['']
    });
    this.editForm = this.fb.group({
      id: [''],
      prenom: [''],
      nom: [''],
      email: [''],
      profil: [null, Validators.required],
      localite_id: [''],
      telephone: [''],
      adresse: [''],
    })
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Utilisateurs', active: true }
    ];
    this.loadUsers();
    this.loadProfils();
  }

  loadUsers() {
    this.userService.getUsers(this.page, this.pageSize, this.searchForm.value).subscribe((response: any) => {
      this.users = response.data.data;
      this.totalItems = response.meta ? response.meta.total : 0;
    });
  }

  
  loadProfils() {
    this.profilService.getProfils(this.page, 100, {}).subscribe(
      (response: any) => {
        if (response.status) {
          this.profils = response.data.data;
        } else {
          this.errorMessage = response.message || 'Une erreur est survenu';
        }
      },
    );
  }


  itemPagination(event: any) {
    this.pageSize = event.target.value;
    this.loadUsers()
  }

  openModal(modalname: any, item: any, action: any) {
    if (item !== null) {
      this.user = item
      this.editForm.patchValue(this.user);
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

  activation(etat: any) {
    this.userService.changeStatutUser(this.user.id, etat).subscribe(
      (response: any) => {
        if (response['status'] == "success") {
          this.closeModal('ok');
          this.loadUsers();
        } else {
          this.errorMessage = response['message'];
        }
      }
    )
  }

  deleteUser() {
    this.userService.deleteUser(this.user.id).subscribe(
      (response: any) => {
        if (response['status'] == "success") {
          this.closeModal('ok');
          this.loadUsers();
        } else {
          this.errorMessage = response['message'];
        }
      }
    )
  }

  saveUser() {
    this.isSubmitted = true;

    if (this.editForm.invalid) {
      this.errorMessage = "Veuillez remplir correctement le formulaire.";
      return;
    }

    const formData = this.editForm.value;

    if (this.actionModal === 'add') {
      // ➕ Création
      this.userService.addUser(formData).subscribe({
        next: (res: any) => {
          Swal.fire('Ajout réussi', 'Utilisateur ajouté avec succès.', 'success');
          this.closeModal("ok");
          this.editForm.reset();
          this.loadUsers();
          this.isSubmitted = false;
        },
        error: (err) => {
          this.isSubmitted = false;
          this.errorMessage = err.error?.message || "Erreur lors de l'ajout.";
          Swal.fire('Erreur', this.errorMessage, 'error');
        }
      });
    } else if (this.actionModal === 'edit' && this.user?.id) {
      // ✏️ Mise à jour
      this.userService.editUser(this.user.id, formData).subscribe({
        next: (res: any) => {
          Swal.fire('Modification réussie', 'Utilisateur mis à jour.', 'success');
          this.closeModal("ok");
          this.editForm.reset();
          this.loadUsers();
          this.isSubmitted = false;
        },
        error: (err) => {
          this.isSubmitted = false;
          this.errorMessage = err.error?.message || "Erreur lors de la mise à jour.";
          Swal.fire('Erreur', this.errorMessage, 'error');
        }
      });
    }
  }


  // saveUser() {
  //   if (this.actionModal == "add") {
  //     if (this.editForm.valid) {
  //       this.isSubmitted = true;
  //       this.editForm.patchValue({ enabled: true, role: 'USER', name: 'user' });
  //       const formData = this.editForm.value;
  //       this.userService.addUser(formData)
  //         .subscribe(
  //           (res: any) => {
  //             if (res['status'] !== "success") {
  //               this.isSubmitted = false;
  //               this.errorMessage = res['message'];
  //             }
  //             else {
  //               this.closeModal("add");
  //               this.editForm.reset()
  //               this.loadUsers()
  //               this.isSubmitted = false;
  //             }
  //           }, _error => {
  //             this.isSubmitted = false;
  //             this.errorMessage = _error['message'];
  //           }
  //         );
  //     }
  //     else {
  //       this.errorMessage = "Veuillez remplir le formulaire"
  //     }
  //   } else {
  //     this.form["email"].enable();
  //     this.isSubmitted = true;
  //     this.userService.editUser(this.user.id, this.editForm.value)
  //       .subscribe(
  //         (res: any) => {
  //           if (res['status'] !== "success") {
  //             this.errorMessage = res['message'];
  //             this.isSubmitted = false;
  //           } else {
  //             this.closeModal("ok");
  //             this.editForm.reset();
  //             this.loadUsers();
  //             this.isSubmitted = false;
  //           }
  //         }, _error => {
  //           this.isSubmitted = false;
  //           this.errorMessage = _error['message'];
  //         }
  //       );
  //   }
  // }

  get form() {
    return this.editForm.controls
  }

  action() {
    if (this.actionModal == 'delete') {
      this.deleteUser();
    } else {
      this.activation(this.actionModal == 'activer' ? 1 : 0);
    }
  }
}
