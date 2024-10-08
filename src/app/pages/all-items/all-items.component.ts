import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-all-items',
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.css']
})
export class AllItemsComponent {
  @ViewChild('dt') table!: Table;
  //newForm!: FormGroup;
  UploadedFile!: File;
  @ViewChild('closeModal2') closeModal2!: ElementRef;
  data: any[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.getData();
  }

  constructor(private route: Router, private service: MainService) { }

  getData() {
    this.service.getApi('getAllItems').subscribe({
      next: resp => {
        this.data = resp.data;
      },
      error: error => {
        console.log(error.message)
      }
    });
  };

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value.trim().toLowerCase();
    this.table.filterGlobal(filterValue, 'contains');
  };


  getItems(id:any){

  }

  addFile() {
    //this.newForm.markAllAsTouched();
    const formURlData = new FormData();
    const fileInput = document.getElementById("exampleInputFile") as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const uploadedFile = fileInput.files[0];
      formURlData.append('file', uploadedFile, uploadedFile.name); // Append the image file to the FormData object
    }
    this.service.postAPI('uploadCardTemplate', formURlData).subscribe({
      next: (resp) => {
        if (resp.success === true) {
          this.closeModal2.nativeElement.click();
          // this.toastr.success(resp.message);
          //this.toastr.success('Update successful!');
          this.getData();
        
        }
        //this.newForm.reset();  
      },
      error: error => {
        //this.toastr.warning('Something went wrong.');
        console.log(error.message)
      }
    })
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

  deleteTempalte(id:any) {

  
    const formURlData = new URLSearchParams();

      formURlData.set('ids', id.toString());
    
    this.service.postAPI('deleteTempalte', formURlData.toString()).subscribe({
      next: (resp) => {

        if (resp.success == true) {
   this.getData()
      }
    },
      error: (error) => {
        //this.loading = false;
      
        console.error('Login error:', error.message);
      }
    });

  };
}
