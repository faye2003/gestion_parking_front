import { Component, OnInit, inject } from "@angular/core";
import { Utilisateur } from '../utilisateur.model';
import { UserService } from "../utilisateur.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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

  constructor(private readonly userService: UserService, private readonly fb: FormBuilder,
    private readonly modalService: NgbModal
  ) {
    this.searchForm = this.fb.group({
      firstName: [''],
      email: [''],
      lastName: [''],
      search: ['']
    });
    this.editForm = this.fb.group({
      id: [''],
      firstName: [''],
      lastName: [''],
      username: [''],
      email: [''],
      profil: [''],
      enabled: [true],
      name: ['user'],
      role: ['USER'],
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
  }

  loadUsers() {
    this.userService.getUsers(this.page, this.pageSize, this.searchForm.value).subscribe((response: any) => {
      this.users = response.data;
      this.totalItems = response.meta ? response.meta.total : 0;
    });
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
    if (this.actionModal == "add") {
      if (this.editForm.valid) {
        this.isSubmitted = true;
        this.editForm.patchValue({ enabled: true, role: 'USER', name: 'user' });
        const formData = this.editForm.value;
        this.userService.addUser(formData)
          .subscribe(
            (res: any) => {
              if (res['status'] !== "success") {
                this.isSubmitted = false;
                this.errorMessage = res['message'];
              }
              else {
                this.closeModal("add");
                this.editForm.reset()
                this.loadUsers()
                this.isSubmitted = false;
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
      this.form["email"].enable();
      this.isSubmitted = true;
      this.userService.editUser(this.user.id, this.editForm.value)
        .subscribe(
          (res: any) => {
            if (res['status'] !== "success") {
              this.errorMessage = res['message'];
              this.isSubmitted = false;
            } else {
              this.closeModal("ok");
              this.editForm.reset();
              this.loadUsers();
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
      this.deleteUser();
    } else {
      this.activation(this.actionModal == 'activer' ? 1 : 0);
    }
  }
}
