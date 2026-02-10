import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { PasskeysComponent } from './passkeys.component';


describe('PasskeysComponent', () => {
  let component: PasskeysComponent;
  let fixture: ComponentFixture<PasskeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasskeysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasskeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
