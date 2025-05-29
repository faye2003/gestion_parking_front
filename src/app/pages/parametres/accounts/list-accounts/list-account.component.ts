import { Component, OnInit } from "@angular/core";
import { Account } from '../account.model';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from "../account.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';
import { TypeAccountService } from "../../type_accounts/type-account.service";
import { TypeAccount } from "../../type_accounts/type-account.model";

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.scss']
})


/**
 *  Dashboard Component
 */
export class AccountComponent implements OnInit {
  searchTerm: any;
  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 5;
  searchForm: FormGroup;
  account!: Account;
  uo!: number;
  editForm: FormGroup;
  snapshot: any;
  errorMessage = "";
  errorMessage500 = "";
  actionModal = "";
  isSubmitted = false;
  submitted = false;

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  accounts: Account[] = [];
  type_accounts: TypeAccount[] = [];

  constructor(private readonly accountService: AccountService, private route: ActivatedRoute, private readonly fb: FormBuilder,
    private readonly modalService: NgbModal, private readonly typeAccountService: TypeAccountService) {
    this.searchForm = this.fb.group({
      libelle: [''],
      solde: [''],
      solde_avant: [''],
      date_last_modification: [''],
      type_account: [''],
      uo: [''],
      search: ['']
    });
    this.editForm = this.fb.group({
      id: [''],
      libelle: [''],
      solde: [''],
      solde_avant: [''],
      type_account_id: [''],
      uo_id: [''],
    });
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Accounts', active: true }
    ];
    this.loadAccounts();
    this.loadTypeAccounts();
  }

  loadTypeAccounts() {
    this.typeAccountService.getTypeAccounts(this.page, 100, {}).subscribe(
      (response: any) => {
        if (response.status) {
          this.type_accounts = response.data;
        } else {
          this.errorMessage = response.message || 'Une erreur est survenu';
        }
      },
    );
  }



  loadAccounts() {
    // console.log(this.searchForm.value);
    this.accountService.getAccounts(this.page, this.pageSize, this.searchForm.value).subscribe(
      // users => this.users = users
        (response: any) => {
          if (response.status) {
            this.accounts = response.data;
            this.totalItems = response.meta ? response.meta.total : 0;
          } else {
            this.errorMessage = response.message || 'Une erreur est survenue';
          }
        },
    );
  }

  itemPagination(event: any) {
    this.pageSize = event.target.value;
    this.loadAccounts();
  }

  openModal(modalname: any, item: any, action: any) {
    if (item !== null) {
      this.account = item
      this.editForm.patchValue({
        id: this.account.id,
        libelle: this.account.libelle,
        solde: this.account.solde,
        solde_avant: this.account.solde_avant,
        type_account_id: this.account.type_account?.id,
        uo_id: this.account.uo?.id,
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

  deleteAccount() {
    this.accountService.deleteAccount(this.account.id).subscribe(
      (response: any) => {
        if (response['status'] == "success") {
          this.closeModal('ok');
          Swal.fire('Supprimé!', 'Le compte a été supprimé.', 'success');
          this.loadAccounts();
        } else {
          this.errorMessage = response['message'];
          Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
        }
      }
    )
  }

  saveAccount() {
    if (this.actionModal == "add") {
      // console.log(this.editForm.valid);
      if (this.editForm.valid) {
        this.isSubmitted = true;
        const formData = this.editForm.value;
        // console.log(formData.parent_id);
        this.accountService.createAccount(formData)
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
                this.loadAccounts()
                this.isSubmitted = false;
                Swal.fire('Ajout réussi !', 'Le compte a été ajouté.', 'success');
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
      this.accountService.updateAccount(this.account.id, this.editForm.value)
        .subscribe(
          (res: any) => {
            if (res['status'] !== "success") {
              this.errorMessage = res['message'];
              this.isSubmitted = false;
            } else {
              this.closeModal("ok");
              this.editForm.reset();
              this.loadAccounts();
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
      this.deleteAccount();
    }
  }

}
