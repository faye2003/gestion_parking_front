import { Component, OnInit } from "@angular/core";
import { Contact } from '../contact.model';
import { ContactService } from "../contact.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';

@Component({
    selector: 'app-contact',
    templateUrl: './list-contact.component.html',
    styleUrls: ['./list-contact.component.scss']
})


/**
 *  Dashboard Component
 */
export class ContactComponent implements OnInit {
    searchTerm: any;
    totalItems: number = 0;
    page: number = 1;
    pageSize: number = 5;
    searchForm: FormGroup;
    contact!: Contact;
    editForm: FormGroup;
    errorMessage = "";
    errorMessage500 = "";
    actionModal = "";
    isSubmitted = false;
    submitted = false;

  // bread crumb items
  breadCrumbItems!: Array<{}>;


  contacts: Contact[] = [];

  constructor(private contactService: ContactService, private readonly fb: FormBuilder, private readonly modalService: NgbModal) 
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
      { label: 'Contacts', active: true }
    ];
    this.loadContacts();
  }

  loadContacts() {
    this.contactService.getContacts(this.page, this.pageSize, this.searchForm.value).subscribe(
        (response: any) => {
          // console.log("this.searchForm.value");
          if (response) {
            this.contacts = response.data.data || [];
            this.totalItems = response.meta?.count || 0;
          } else {
            this.errorMessage = response.message || 'Une erreur est survenue';
          }
        },
    );
  }

  // itemPagination(event: any) {
  //   this.pageSize = event.target.value;
  //   this.ngOnInit();
  // }

  itemPagination(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.page = 1;  // ✅ remettre la pagination à la première page
    this.ngOnInit();
  }

  openModal(modalname: any, item: any, action: any) {
    if (item !== null) {
      this.contact = item
      this.editForm.patchValue(this.contact);
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


  deleteContact() {
    this.contactService.deleteContact(this.contact.id).subscribe(
      (response: any) => {
        if (this.isSuccessResponse(response)) {
          this.closeModal('ok');
          Swal.fire('Supprimé!', 'Le type account a été supprimé.', 'success');
          this.loadContacts();
        } else {
          this.errorMessage = response?.message;
          Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
        }
      }
    );
  }

  saveContact() {
  if (this.actionModal == "add") {
    if (this.editForm.valid) {
      this.isSubmitted = true;
      const formData = this.editForm.value;
      this.contactService.createContact(formData)
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
            this.loadContacts();
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
    this.contactService.updateContact(this.contact.id, this.editForm.value)
      .subscribe(
        (response: any) => {
          if (!response?.status) {
            this.errorMessage = response?.message;
            this.isSubmitted = false;
          } else {
            this.closeModal("ok");
            this.editForm.reset();
            this.loadContacts();
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
    if (this.actionModal == 'delete') {
      this.deleteContact();
    } 
  }
  
  delContact(id: number):void {
    this.contactService.deleteContact(id).subscribe(
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