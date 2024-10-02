import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent {
  @ViewChild('dt') table!: Table;
  //newForm!: FormGroup;
  UploadedFile!: File;
  @ViewChild('closeModal2') closeModal2!: ElementRef;
  @ViewChild('closeModal') closeModal!: ElementRef;
  data: any[] = [];
  loading: boolean = true;
  categoryName: any;
  clicks: any;
  categoryId: any;
  add_category_image: any;
  category_name: any;
  category_image: any;
  uploadedFiles: any[] = [];
  downloadUrl: string = '';
  formSubmitted: boolean = false;
  uploadedFile: any;
  NOimage = false;
  file: any;
  file2: any;

  ngOnInit(): void {
    this.router.queryParams.subscribe((params: any) => {
      const page = params['page'] || 1;
      setTimeout(() => {
        if (this.table) {
          this.table.first = (page - 1) * (this.table.rows || 20);
          console.log('Page:', page, 'First:', this.table.first, 'Rows:', this.table.rows);
        }
      }, 0);
    });
    this.getData();
  };



  constructor(private route: Router, private service: MainService, private toastr: ToastrService, private router: ActivatedRoute, private messageService: MessageService, private firestorage: AngularFireStorage,) { }


  // Handle file selection
  onUpload(event: any) {

    console.log("workinthis", this.uploadedFile)
    this.uploadedFile = event.files[0];
  }
  getData() {
    this.service.getApi('getAllCategories').subscribe({
      next: resp => {
        this.data = resp.searchCategory;
      },
      error: error => {
        console.log(error.message)
      }
    });
  };

  onItemsClick(customer: any) {
    const currentPage = (this.table?.first ?? 0) / (this.table?.rows ?? 20) + 1;
    this.route.navigate(['/main/items', customer._id, customer.category_name], {
      queryParams: { page: currentPage },
    });
  };



  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value.trim().toLowerCase();
    this.table.filterGlobal(filterValue, 'contains');
  };

  // Form submission
  submitForm() {
    this.formSubmitted = true;

    if (!this.category_name || !this.file2) {
      this.toastr.warning("fill both the fields");
      // If the form is invalid, return early and don't submit
      return;
    }

    if (this.file2) {
      const filePath = `categoryImages/${Date.now()}_${this.file2.name}`;
      const fileRef = this.firestorage.ref(filePath);
      const uploadTask = this.firestorage.upload(filePath, this.file2);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.downloadUrl = url;
            this.saveCategory();
          });
        })
      ).subscribe();
    }
  }


  saveCategory() {

    const categoryData = {
      category_name: this.category_name,
      category_image: this.downloadUrl || '',
      click: 1
    };

    // Make a single API call to addShopImages
    this.service.postAPI('addCategory', categoryData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.closeModal.nativeElement.click()
          this.onCloseModel()
          this.toastr.success(res.msg);
          this.getData()
        } else {
          this.toastr.warning(res.msg);
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }


  onEditClick(items: any) {
    console.log(items)
    this.categoryId = items._id;
    this.categoryName = items.category_name;
    this.clicks = items.click;
    this.category_image = items.category_image;
    console.log(this.category_image)
    if (this.category_image.includes("firebasestorage.googleapis.com")) {
      this.NOimage = false
    } else {
      this.NOimage = true


    }
  }





  onEditSubmit() {
    if (!this.categoryName || !this.clicks) {
      // Handle validation errors
      return;
    }

    if (this.file) {
      // If the user selected a new image, upload it to Firebase
      const filePath = `categoryImages/${Date.now()}_${this.file.name}`;
      const fileRef = this.firestorage.ref(filePath);
      const uploadTask = this.firestorage.upload(filePath, this.file);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.category_image = url;
            this.updateCategory(); // After getting the download URL, update the category
          });
        })
      ).subscribe();
    } else {
      // If no new image was selected, just update the category
      this.updateCategory();
    }
  };

  // Method to update the category in MongoDB
  updateCategory() {
    const categoryData = {
      id: this.categoryId,
      categoryName: this.categoryName,
      category_image: this.category_image,
      click: this.clicks,

    };

    // Make a single API call to addShopImages
    this.service.postAPI('editCategory', categoryData).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res.success) {
          this.closeModal2.nativeElement.click();
          this.data = res.items;
          this.toastr.success(res.msg);
        } else {
          this.toastr.warning(res.msg);
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  // Handle file selection and preview
  PreviewImage(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.category_image = e.target.result; // Show the selected image as a preview
      this.NOimage = false;
    };
    reader.readAsDataURL(this.file);
  }
  // Handle file selection and preview
  PreviewImage2(event: any) {
    this.file2 = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.add_category_image = e.target.result; // Show the selected image as a preview
    };
    reader.readAsDataURL(this.file2);
  };

  onCloseModel() {
    this.add_category_image = '';
    this.category_name = '';
    this.file2 = ''
  }

}
