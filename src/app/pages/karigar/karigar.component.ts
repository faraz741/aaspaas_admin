import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-karigar',
  templateUrl: './karigar.component.html',
  styleUrls: ['./karigar.component.css']
})
export class KarigarComponent {
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

  karigarForm: FormGroup;
  karigarImage: string | null = null; // To hold the image URL for preview
  photoError = false;
  areaList: any[] = [];
  selectedShopType!: string;
  ID: any;
  selectedPrimaryCategory: any;
  selectedArea: any;
  selectedFilterCategory: any;
  selectLatitudeType = false;
  invalidUrl = false;
  invalidLatitude = false;
  selectedpINCODE: any;
  days = [
    { name: 'monday', label: 'Monday' },
    { name: 'tuesday', label: 'Tuesday' },
    { name: 'wednesday', label: 'Wednesday' },
    { name: 'thursday', label: 'Thursday' },
    { name: 'friday', label: 'Friday' },
    { name: 'saturday', label: 'Saturday' },
    { name: 'sunday', label: 'Sunday' }
  ];
  shopType = [
    { name: 'Retail', label: 'Retail' },
    { name: 'Wholesale', label: 'Tuesday' },
    { name: 'Service', label: 'Wednesday' }
  ];
  staticPincodes: string[] = ['452016', '452001', '452002', '452003', '452004'];
  filteredSuggestions: string[] = [];
  constructor( private route: Router, private service: MainService, private toastr: ToastrService, private fb: FormBuilder,private router: ActivatedRoute, private messageService: MessageService, private firestorage: AngularFireStorage) {
    this.karigarForm = this.fb.group({
      karigarName: ['', Validators.required],
      description: ['', Validators.required],
      pincode: ['', Validators.required],
      area: ['', Validators.required],
      charges: ['', [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  

  // Handle File Browse
  browsePhoto() {
    const fileInput = document.getElementById('karigarPhoto') as HTMLInputElement;
    fileInput.click();
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.photoError = false;
        this.previewImage(file);
      }
    };
  }

  // Capture Photo from Camera
  capturePhoto() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play();

        const canvasElement = document.createElement('canvas');
        document.body.appendChild(videoElement); // Temporarily add video to capture frame

        // Wait for video to load metadata
        videoElement.onloadedmetadata = () => {
          canvasElement.width = videoElement.videoWidth;
          canvasElement.height = videoElement.videoHeight;

          const ctx = canvasElement.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoElement, 0, 0);
            this.karigarImage = canvasElement.toDataURL('image/png');
          }

          stream.getTracks().forEach((track) => track.stop()); // Stop video stream
          document.body.removeChild(videoElement); // Remove temporary video element
        };
      })
      .catch((error) => {
        console.error('Camera error:', error);
      });
  }

  // Preview Image
  previewImage(file: File) {
    this.file2 = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.karigarImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // submitForm() {
  //   if (!this.karigarForm.valid || !this.karigarImage) {
  //     this.photoError = true;
  //     return;
  //   }
  //   console.log('Form submitted:', this.karigarForm.value);
  //   console.log('Image:', this.karigarImage);
  // }

  submitForm() {
    this.formSubmitted = true;

    if (!this.file2) {
      // this.toastr.warning("fill both the fields");
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
            this.karigarImage = url;
            this.saveForm2();
          });
        })
      ).subscribe();
    }
  }


  saveForm2() {
    console.log('Form submitted:', this.karigarForm.value);
    console.log('Image:', this.karigarImage);
    return
    const categoryData = {
      karigar_name:this.karigarForm.value.karigarName,
      image:this.karigarImage,
      description:this.karigarForm.value.description,
      area:this.karigarForm.value.area,
      address:this.karigarForm.value.address,
      charges:this.karigarForm.value.charges,
      phoneNo:this.karigarForm.value.phoneNo,
      categoryId:this.karigarForm.value.categoryId
    };

    // Make a single API call to addShopImages
    this.service.postAPI('adminKarigarAdd', categoryData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.closeModal.nativeElement.click()
          this.onCloseModel()
          this.toastr.success(res.msg);
          // this.getNoCacheData()
        } else {
          this.toastr.warning(res.msg);
        }
      },
      error: err => {
        console.error(err);
      }
    });
  };

  getAreaList(event: any, num: any) {
    if (num == '0') {
       // Filter static pin codes for suggestions
       console.log(this.filteredSuggestions)
       var pincode = event.target.value;
       if(pincode.length >= 1){
         this.filteredSuggestions = this.staticPincodes;
      }
      if (pincode.length == 6) {
        this.service.getApi(`getAreas?pinCode=${pincode}`).subscribe({
          next: resp => {
            if (resp.success == true) {
              this.areaList = resp.items[0].areaList;
              this.selectedArea = this.areaList[0].areaname;

            } else {
              this.areaList = [];
              this.selectedArea = '';
              this.toastr.warning(resp.msg);
            }
          },
          error: error => {
            console.log(error.message)
          }
        });
      }
    } else {
      var pincode = this.selectedpINCODE
      this.service.getApi(`getAreas?pinCode=${pincode}`).subscribe({
        next: resp => {
          if (resp.success == true) {
            this.areaList = resp.items[0].areaList;


          } else {
            this.areaList = [];
            this.selectedArea = '';
            this.toastr.warning(resp.msg);
          }
        },
        error: error => {
          console.log(error.message)
        }
      });
    }

  };

  selectSuggestion(suggestion: string) {
    this.karigarForm.controls['pincode'].setValue(suggestion);
    this.filteredSuggestions = [];
    this.service.getApi(`getAreas?pinCode=${suggestion}`).subscribe({
      next: resp => {
        if (resp.success == true) {
          this.areaList = resp.items[0].areaList;
          this.selectedArea = this.areaList[0].areaname;

        } else {
          this.areaList = [];
          this.selectedArea = '';
          this.toastr.warning(resp.msg);
        }
      },
      error: error => {
        console.log(error.message)
      }
    });
  }
  onCloseModel() {
    this.karigarForm.reset();
    this.karigarImage = null;
  }
}
