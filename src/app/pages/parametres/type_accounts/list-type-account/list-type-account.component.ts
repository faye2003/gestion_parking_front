import { Component, OnInit } from "@angular/core";
import { TypeAccount } from '../type-account.model';
import { TypeAccountService } from "../type-account.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-type-account',
    templateUrl: './list-type-account.component.html',
    styleUrls: ['./list-type-account.component.scss']
})


/**
 *  Dashboard Component
 */
export class TypeAccountComponent implements OnInit {
    searchTerm: any;
    totalItems: number = 0;
    page: number = 1;
    pageSize: number = 5;
    searchForm: FormGroup;
    type_account!: TypeAccount;
    editForm: FormGroup;
    errorMessage = "";
    errorMessage500 = "";
    actionModal = "";
    isSubmitted = false;
    submitted = false;

  // bread crumb items
  breadCrumbItems!: Array<{}>;


  type_accounts: TypeAccount[] = [];

  constructor(private typeAccountService: TypeAccountService, private readonly fb: FormBuilder, private readonly modalService: NgbModal) 
  {
    this.searchForm = this.fb.group({
      libelle: [''],
      search: ['']
    });
    this.editForm = this.fb.group({
      id: [''],
      libelle: [''],
    })
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Type Accounts', active: true }
    ];
    this.loadTypeAccounts();
  }

  loadTypeAccounts() {
    // console.log(this.searchForm.value);
    this.typeAccountService.getTypeAccounts(this.page, this.pageSize, this.searchForm.value).subscribe(
      // users => this.users = users
        (response: any) => {
          if (response.status) {
            this.type_accounts = response.data;
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
      this.type_account = item
      this.editForm.patchValue(this.type_account);
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

  deleteTypeAccount() {
    this.typeAccountService.deleteTypeAccount(this.type_account.id).subscribe(
      (response: any) => {
        if (response['status'] == "success") {
          this.closeModal('ok');
          Swal.fire('Supprimé!', 'Le type account a été supprimé.', 'success');
          this.loadTypeAccounts();
        } else {
          this.errorMessage = response['message'];
          Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
        }
      }
    );
  }

  saveTypeAccount() {
    if (this.actionModal == "add") {
      // console.log(this.editForm.valid);
      if (this.editForm.valid) {
        this.isSubmitted = true;
        const formData = this.editForm.value;
        // console.log(formData.parent_id);
        this.typeAccountService.createTypeAccount(formData)
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
      this.typeAccountService.updateTypeAccount(this.type_account.id, this.editForm.value)
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
      this.deleteTypeAccount();
    } 
  }
  
  delTypeAccount(id: number):void {
    this.typeAccountService.deleteTypeAccount(id).subscribe(
        (response) => {
          if (response.status) {
            Swal.fire('Supprimé!', 'Le type account a été supprimé.', 'success');
            this.ngOnInit();
          } else {
            Swal.fire('Erreur!', response.message || 'Une erreur est survenue.', 'error');
          }
        },
        (error) => {
          Swal.fire('Erreur!', 'Une erreur est survenue lors de la suppression.', 'error');
        }
      );
  }


}