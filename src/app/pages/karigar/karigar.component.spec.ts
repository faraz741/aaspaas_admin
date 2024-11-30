import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KarigarComponent } from './karigar.component';

describe('KarigarComponent', () => {
  let component: KarigarComponent;
  let fixture: ComponentFixture<KarigarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KarigarComponent]
    });
    fixture = TestBed.createComponent(KarigarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
