import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TypePaiementComponent } from "./list-type-paiement.component";
import { NgbNav } from "@ng-bootstrap/ng-bootstrap";

describe('TypePaiementComponent', () => {
  let component: TypePaiementComponent;
  let fixture: ComponentFixture<TypePaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NgbNav, TypePaiementComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
