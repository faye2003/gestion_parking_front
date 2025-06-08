import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ParkingComponent } from "./list-parking.component";
import { NgbNav } from "@ng-bootstrap/ng-bootstrap";

describe('ParkingComponent', () => {
  let component: ParkingComponent;
  let fixture: ComponentFixture<ParkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NgbNav, ParkingComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
