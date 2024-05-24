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
      const fileInput = document.getElementById("exampleInputFile") as HTMLInputElement;

      if (fileInput.files && fileInput.files[0]) {
        const uploadedFile = fileInput.files[0];
        formURlData.append('file', uploadedFile, uploadedFile.name); // Append the image file to the FormData object
      }
      formURlData.set('links', this.newForm.value.links)
      this.service.postAPI('uploadsuggested_links', formURlData).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal.nativeElement.click();
          }
          this.newForm.reset();
          //this.toastr.success(resp.message);
          this.getData()
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

  };


  PreviewImage() {
    var fileReader = new FileReader();
    var fileInput = document.getElementById("uploadPreview") as HTMLImageElement; // Assuming uploadPreview is an img element

    fileReader.onload = function (fileEvent) {
      if (fileEvent.target && fileEvent.target.result) {
        fileInput.src = fileEvent.target.result as string;
      }
    };

    // Assuming you have an input element with the type 'file' where users can select an image
    var fileInputElement = document.getElementById("exampleInputFile") as HTMLInputElement;

    if (fileInputElement.files && fileInputElement.files[0]) {
      fileReader.readAsDataURL(fileInputElement.files[0]);
    }
  }

}
