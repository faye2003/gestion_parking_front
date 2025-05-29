import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AccountComponent } from "./list-account.component";
import { NgbNav } from "@ng-bootstrap/ng-bootstrap";

describe('UtilisateurComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NgbNav, AccountComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
