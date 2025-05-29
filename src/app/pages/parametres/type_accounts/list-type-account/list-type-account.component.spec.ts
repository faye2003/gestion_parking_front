import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TypeAccountComponent } from "./list-type-account.component";
import { NgbNav } from "@ng-bootstrap/ng-bootstrap";

describe('TypeAccountComponent', () => {
  let component: TypeAccountComponent;
  let fixture: ComponentFixture<TypeAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NgbNav, TypeAccountComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
