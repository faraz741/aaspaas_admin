import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopsImagesComponent } from './shops-images.component';

describe('ShopsImagesComponent', () => {
  let component: ShopsImagesComponent;
  let fixture: ComponentFixture<ShopsImagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShopsImagesComponent]
    });
    fixture = TestBed.createComponent(ShopsImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
