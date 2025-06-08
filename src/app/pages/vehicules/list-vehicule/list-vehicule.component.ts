import { Component, OnInit } from "@angular/core";
import { Vehicule } from "../vehicule.model";
import { VehiculeService } from "../vehicule.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from 'sweetalert2';
import { Localite } from "../../parametres/localites/localite.model";
import { LocaliteService } from "../../parametres/localites/localite.service";

@Component({
  selector: 'app-list-vehicule',
  templateUrl: './list-vehicule.component.html',
  styleUrls: ['./list-vehicule.component.scss']
})


/**
 *  Dashboard Component
 */
export class VehiculeComponent implements OnInit {
  searchTerm: any;
  totalItems: number = 0;
  page: number = 1;
  pageSize: number = 5;
  searchForm: FormGroup;
  vehicule!: Vehicule;
  errorMessage = "";
  errorMessage500 = "";
  actionModal = "";
  isSubmitted = false;
  submitted = false;
  today: string = new Date().toISOString().split('T')[0];

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  vehicules: Vehicule[] = [];
  localites: Localite[] = [];

  constructor(
    private readonly vehiculeService: VehiculeService,
    private readonly localiteService: LocaliteService,
    private readonly fb: FormBuilder,
    private readonly modalService: NgbModal,
  ) {
    this.searchForm = this.fb.group({
      id: [''],
      description: [''],
      type: [''],
      statut: [''],
      date_debut: [''],
      date_fin: [''],
      uo_vehicule: [''],
      localite: [''],
      search: ['']
    });
  }

  ngOnInit() {
    this.breadCrumbItems = [
      { label: 'Gestion' },
      { label: 'Vehicules', active: true }
    ];
    this.loadVehicules();
    this.loadLocalites();
 //   this.loadDonneurs();
  //  this.loadPocheSangs();
  }


  loadLocalites() {
    this.localiteService.getLocalites(this.page, 100, {}).subscribe(
      (response: any) => {
        if (response.status) {
          this.localites = response.data;
        } else {
          this.errorMessage = response.message || 'Une erreur est survenu';
        }
      },
    );
  }


  loadVehicules() {
    this.vehiculeService.getVehicules(this.page, this.pageSize, this.searchForm.value).subscribe(
      (response: any) => {
        if (response.status) {
          this.vehicules = response.data;
          console.log(this.vehicules);
          this.totalItems = response.meta ? response.meta.total : 0;
        } else {
          this.errorMessage = response.message || 'Une erreur est survenue';
        }
      },
    );
  }

  showTable: boolean = true;
  public selectedProduct: any = null;

  showListBanque():void {
    this.showTable = true;
    this.selectedProduct = null;
  }

  itemPagination(event: any) {
    this.pageSize = event.target.value;
    this.loadVehicules();
  }

  closeModal(_modalname: any) {
    this.modalService.dismissAll();
    this.errorMessage = "";
    this.errorMessage500 = ""
  }

  deleteVehicule() {
    this.vehiculeService.deleteVehicule(this.vehicule.id).subscribe(
      (response: any) => {
        if (response['status'] == "success") {
          this.closeModal('ok');
          Swal.fire('Supprimé!', 'cette banque de sanque a été supprimé.', 'success');
          this.loadVehicules();
        } else {
          this.errorMessage = response['message'];
          Swal.fire('Erreur!', this.errorMessage || 'Une erreur est survenue.', 'error');
        }
      }
    )
  }
  action() {
    if (this.actionModal == 'delete') {
      this.deleteVehicule();
    }
  }

}
