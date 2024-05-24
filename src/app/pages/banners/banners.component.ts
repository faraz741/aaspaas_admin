import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent {
  // image:'https://tiptwo.com.au:3001/image',
  // imageURl = 'http://localhost:4000/profile';
  imageURl = 'http://52.204.188.107:4000/profile';
  imageData: any[] = [];

  ngOnInit(): void {
    console.log("FS");
    this.getData();
  }

  constructor(private route: Router, private service: MainService) { }

  getData() {
    this.service.getApi('getbanners').subscribe({
      next: resp => {
        this.imageData = resp.data;
      },
      error: error => {
        console.log(error.message)
      }
    });
  };



  onUpdate() {
    console.log("cliekd");

    const fileInput = document.getElementById("exampleInputFile1") as HTMLInputElement;
    const fileInput2 = document.getElementById("exampleInputFile2") as HTMLInputElement;
    const fileInput3 = document.getElementById("exampleInputFile3") as HTMLInputElement;
    let formData = new FormData();


    if (fileInput.files && fileInput.files[0]) {
      const uploadedFile = fileInput.files[0];
      formData.append('sidebar_image', uploadedFile, uploadedFile.name); // Append the image file to the FormData object
    }
    if (fileInput2.files && fileInput2.files[0]) {
      const uploadedFile = fileInput2.files[0];
      formData.append('small_image', uploadedFile, uploadedFile.name); // Append the image file to the FormData object
    }
    if (fileInput3.files && fileInput3.files[0]) {
      const uploadedFile = fileInput3.files[0];
      formData.append('big_image', uploadedFile, uploadedFile.name); // Append the image file to the FormData object
    }



    this.service.postAPI('updateBanners', formData).subscribe({
      next: (res: any) => {
        console.log(res)

        if (res.success == true) {
          // formData.reset();
          this.getData()
          fileInput.value = ''
        } else {

        }
      },
      error: err => {

      }
    })
  };

  PreviewImage(items:string) {
    if(items == 'sidebar'){
      var fileReader = new FileReader();
      var fileInput = document.getElementById("uploadPreview1") as HTMLImageElement; 
      fileReader.onload = function (fileEvent) {
        if (fileEvent.target && fileEvent.target.result) {
          fileInput.src = fileEvent.target.result as string;
        }
      };
      var fileInputElement = document.getElementById("exampleInputFile1") as HTMLInputElement;
      if (fileInputElement.files && fileInputElement.files[0]) {
        fileReader.readAsDataURL(fileInputElement.files[0]);
      }
    }else if(items == 'small'){
      var fileReader = new FileReader();
      var fileInput = document.getElementById("uploadPreview2") as HTMLImageElement; 
      fileReader.onload = function (fileEvent) {
        if (fileEvent.target && fileEvent.target.result) {
          fileInput.src = fileEvent.target.result as string;
        }
      };
      var fileInputElement = document.getElementById("exampleInputFile2") as HTMLInputElement;
      if (fileInputElement.files && fileInputElement.files[0]) {
        fileReader.readAsDataURL(fileInputElement.files[0]);
      }
    }else if(items == 'big'){
      var fileReader = new FileReader();
      var fileInput = document.getElementById("uploadPreview3") as HTMLImageElement; 
      fileReader.onload = function (fileEvent) {
        if (fileEvent.target && fileEvent.target.result) {
          fileInput.src = fileEvent.target.result as string;
        }
      };
      var fileInputElement = document.getElementById("exampleInputFile3") as HTMLInputElement;
      if (fileInputElement.files && fileInputElement.files[0]) {
        fileReader.readAsDataURL(fileInputElement.files[0]);
      }
    }
    
  }
}
