import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProfilComponent } from "./list-profil.component";
import { NgbNav } from "@ng-bootstrap/ng-bootstrap";

describe('ProfilComponent', () => {
  let component: ProfilComponent;
  let fixture: ComponentFixture<ProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NgbNav, ProfilComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
