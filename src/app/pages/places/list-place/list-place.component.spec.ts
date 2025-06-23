import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PocheSangComponent } from "./list-poche.component";
import { NgbNav } from "@ng-bootstrap/ng-bootstrap";

describe('PocheSangComponent', () => {
  let component: PocheSangComponent;
  let fixture: ComponentFixture<PocheSangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NgbNav, PocheSangComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PocheSangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
