import { ComponentFixture, TestBed } from "@angular/core/testing";

import { VehiculeComponent } from "./list-vehicule.component";
import { NgbNav } from "@ng-bootstrap/ng-bootstrap";

describe('VehiculeComponent', () => {
  let component: VehiculeComponent;
  let fixture: ComponentFixture<VehiculeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NgbNav, VehiculeComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiculeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
