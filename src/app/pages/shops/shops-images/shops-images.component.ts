import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { finalize, forkJoin, switchMap } from 'rxjs';
import { CacheService } from 'src/app/services/cache.service';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-shops-images',
  templateUrl: './shops-images.component.html',
  styleUrls: ['./shops-images.component.css'],
  providers: [MessageService]
})
export class ShopsImagesComponent {
  uploadedFiles: any[] = [];
  shopId: any;
  shopImages: any[] = [];

  constructor(private messageService: MessageService, private firestorage: AngularFireStorage, private route: Router, private service: MainService, private fb: FormBuilder, private cacheService: CacheService, private toastr: ToastrService, private _activatedRoute: ActivatedRoute) {
    this._activatedRoute.queryParams
      .subscribe(params => {
        this.shopId = params['id'] || 0;
        this.getData()
        // const images = params['images'];
        // this.shopImages = JSON.parse(images)
        // console.log(this.shopImages)
        // if (this.shopImages.length > 0) {

        // }


      });
  };

  getData() {

    this.service.postAPI('getShopImages', { id: this.shopId }).subscribe({
      next: resp => {
        console.log(resp.data[0])
        if (resp.data[0].shopImages) {
          if (resp.data[0].shopImages.length > 0) {
            this.shopImages = resp.data[0].shopImages;
          } else {
            this.toastr.warning("No images found");
          }

        } else {
          this.toastr.warning("No images found");
        }

      },
      error: error => {
        console.log(error.message)
      }
    });


  };

  onUpload(event: any) {
    const promises: any[] = [];
    const fileNames: string[] = [];

    event.files.forEach((file: any) => {
      const filePath = `shops/${Date.now()}_${file.name}`;
      fileNames.push(filePath);
      const uploadTask = this.firestorage.upload(filePath, file).snapshotChanges();
      promises.push(uploadTask);
    });

    forkJoin(promises).pipe(
      switchMap(() => {
        // Get download URLs with tokens for each uploaded file
        const urlPromises = fileNames.map(filePath =>
          this.firestorage.ref(filePath).getDownloadURL().toPromise()
        );
        return forkJoin(urlPromises);
      }),
      finalize(() => {
        this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
      })
    ).subscribe({
      next: (downloadUrls: string[]) => {
        const imageInfo = fileNames.map((filePath, index) => ({
          fileName: filePath,
          downloadUrl: downloadUrls[index]
        }));

        // Prepare the form data
        const formData = {
          id: this.shopId,
          shopImages: imageInfo
        };

        // Make a single API call to addShopImages
        this.service.postAPI('addShopImages', formData).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.shopImages.push(...imageInfo);
              // this.toastr.success(res.msg);
            } else {
              this.toastr.warning(res.msg);
            }
          },
          error: err => {
            console.error(err);
          }
        });
      },
      error: (err) => console.error('Failed to upload files:', err),
      complete: () => console.log("All Done")
    });
  }
  removeImage(fileName: string) {
    // Prepare the form data
    const formData = {
      id: this.shopId,
      fileName: fileName
    };

    this.service.postAPI('deleteImages', formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.msg);
          this.shopImages = this.shopImages.filter(image => image.fileName !== fileName);
        } else {
          this.toastr.warning(res.msg);
        }
      },
      error: err => {
        console.error('Failed to remove image:', err);
        this.toastr.error('Failed to remove image');
      }
    });
  }
} 
