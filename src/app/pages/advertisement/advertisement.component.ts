import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.css']
})
export class AdvertisementComponent {

  UploadedFile!: File;
  newForm!: FormGroup;
  @ViewChild('closeModal') closeModal!: ElementRef;
  data: any[] = [];

  constructor(private route: Router, private service: MainService) { }

  ngOnInit(): void {
    this.initForm();
    this.getData();
  }

  initForm() {
    this.newForm = new FormGroup({
      links: new FormControl('', Validators.required),
      file: new FormControl(null),
    })
  }

  getData() {
    this.service.getApi('getSuggestedLinks').subscribe({
      next: resp => {
        this.data = resp.data.reverse();
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  addEvent() {
    this.newForm.markAllAsTouched();
    if (this.newForm.valid) {
      const formURlData = new FormData();
      formURlData.set('file', this.UploadedFile);
      formURlData.set('links', this.newForm.value.links)
      this.service.postAPI('uploadsuggested_links', formURlData).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal.nativeElement.click();
          }
          this.newForm.reset();
          //this.toastr.success(resp.message);
          //this.getEventData()
        },
        error: error => {
          //this.toastr.warning('Something went wrong.');
          console.log(error.message)
        }
      })
    }
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    const img = document.getElementById('blah') as HTMLImageElement;

    if (img && file) {
      img.style.display = 'block';
      const reader = new FileReader();
      reader.onload = (e: any) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.UploadedFile = inputElement.files[0];
    }

  }

}
