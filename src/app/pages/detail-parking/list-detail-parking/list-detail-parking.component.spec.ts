import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DetailCampagneComponent } from "./list-detail-campagne.component";
import { NgbNav } from "@ng-bootstrap/ng-bootstrap";

describe('DetailCampagneComponent', () => {
  let component: DetailCampagneComponent;
  let fixture: ComponentFixture<DetailCampagneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NgbNav, DetailCampagneComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCampagneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
