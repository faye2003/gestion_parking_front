import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LocaliteComponent } from "./list-localite.component";
import { NgbNav } from "@ng-bootstrap/ng-bootstrap";

describe('UtilisateurComponent', () => {
  let component: LocaliteComponent;
  let fixture: ComponentFixture<LocaliteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NgbNav, LocaliteComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocaliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
