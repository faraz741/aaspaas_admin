import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent {
  // image:'https://tiptwo.com.au:3001/image',
  // imageURl = 'http://localhost:4000/profile';
  imageURl = 'http://52.204.188.107:4000/profile';
  sidebar_link = '';
  small_link = '';
  big_link = '';
  imageData: any[] = [];

  ngOnInit(): void {
    console.log("FS");
    this.getData();
  }

  constructor(private route: Router, private service: MainService, private toastr: ToastrService) { }

  getData() {
    this.service.getApi('getbanners').subscribe({
      next: resp => {
        this.imageData = resp.data;
        this.sidebar_link = this.imageData[0].sidebar_link;
        this.small_link = this.imageData[0].small_link;
        this.big_link = this.imageData[0].big_link;
      },
      error: error => {
        console.log(error.message)
      }
    });
  };



  onUpdate() {
    console.log("cliekd");

    let formData = new FormData();


   

    formData.append('sidebar_link', this.sidebar_link); 
    formData.append('small_link',this.small_link);
     formData.append('big_link', this.big_link);

    this.service.postAPI('updateBanners', formData).subscribe({
      next: (res: any) => {
        console.log(res)

        if (res.success == true) {
          // formData.reset();
          this.toastr.success(res.message, ' ');
          this.getData()
        
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
