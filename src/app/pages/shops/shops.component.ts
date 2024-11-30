import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { CacheService } from 'src/app/services/cache.service';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent {
  myForm!: FormGroup;
  myEditForm!: FormGroup;
  @ViewChild('dt') table!: Table;
  //newForm!: FormGroup;
  UploadedFile!: File;
  @ViewChild('closeModal2') closeModal2!: ElementRef;
  @ViewChild('closeModal3') closeModal3!: ElementRef;
  data: any[] = [];
  categorydata: any[] = [];
  areaData: any[] = [];
  loading: boolean = true;
  selectedAreas: any[] = [];
  selectedFilcategory: any[] = [];
  filteredData: any[] = [];
  selectedCategory: any[] = [];
  selectedDate: any[] = [];
  filteredCategory: any[] = [];
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
  apiUrl = 'https://ap-south-1.aws.data.mongodb-api.com/app/application-0-dgcxhrt/endpoint/';

  constructor(private route: Router, private service: MainService, private fb: FormBuilder, private cacheService: CacheService, private toastr: ToastrService) {


  };
  ngOnInit(): void {
    this.selectedShopType = 'Retail'
    this.myForm = this.fb.group({
      shopName: ['', Validators.required],
      shopType: [''],
      address: [''],
      area: [''],
      url: [''],
      urlValue: [''],
      inputType: ['coordinate'],
      ownerName: ['',],
      phoneNo: ['', ],
      openTime: '10:00',
      closeTime: ['21:00',],
      pincode: ['', ]
    }),
      this.myEditForm = this.fb.group({
        shopName: ['', Validators.required],
        shopType: [''],
        address: ['', ],
        areaname: [''],
        url: [''],
        urlValue: [''],
        inputType: [''],
        ownerName: ['',],
        phoneNo: ['', ],
        openTime: [''],
        closeTime: [''],
        pincode: ['']
      });
    // Watch for changes in the shopType field
 

    console.log('Form initialized:', this.myForm.value); 
    this.getData();
    this.getcatData();

  }

 



  selectAllDays(event: any): void {
    const isChecked = event.target.checked;
    this.days.forEach(day => {
      this.myForm.controls[day.name].setValue(isChecked);
    });
  };

  onTypeChange(event: any): void {
    const typeShop = event.target;
    console.log(this.selectedShopType)
     if (typeShop === 'Service') {
        this.invalidLatitude = false;
        this.invalidUrl = false;
        this.selectLatitudeType = false
      } else {

      }
  }



  getData() {

    this.service.getApi('getShops').subscribe({
      next: resp => {
        console.log(resp)
        this.data = resp.items;
        this.filteredData = this.data;

        this.areaData = [...new Set(this.data.map(item => item.area))]
          .map(area => ({ area }));

        this.filteredCategory = [...new Set(
          this.data.flatMap(shop => shop.categoryDetails.map((category: any) => category.category_name))
        )].map(category_name => ({ category_name }));

      },
      error: error => {
        console.log(error.message)
      }
    });


  };

  findCategoryName(primaryCategoryId: string): string {
    const category = this.categorydata.find(cat => cat._id === primaryCategoryId);
    return category ? category.category_name : 'N/A';
  }

  getcatData() {
    this.service.getApi('getAllCategories').subscribe({
      next: resp => {
        this.categorydata = resp.searchCategory;
      },
      error: error => {
        console.log(error.message)
      }
    });
  };

  selectSuggestion(suggestion: string) {
    this.myForm.controls['pincode'].setValue(suggestion);
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

  onSubmit(data: any, num: number) {
   
    this.myForm.markAllAsTouched()
    this.myEditForm.markAllAsTouched()
    if (this.myForm.invalid && num == 1) {

      return
    }
    if (this.myEditForm.invalid && num == 2) {
      return
    };
    // if (this.selectedPrimaryCategory == '' || this.selectedPrimaryCategory == undefined) {
    //   this.toastr.warning("Choose primary category to sell");
    //   return
    // };
    // Initialize location variable
    let location = {
      type: "Point",
      coordinates: [0, 0]
    };
    if (this.selectedShopType == 'Service') {
      this.selectLatitudeType = false;
      this.invalidLatitude = false;
      this.invalidLatitude = false;
    } else {
      if (data.inputType == 'url') {
        this.selectLatitudeType = false;
        this.invalidLatitude = false;
        const url = data.urlValue;

        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        if (!regex.test(url)) {
          this.invalidUrl = true;
          return;
        }

        const matches = url.match(regex);

        if (matches) {
          const latitude = Number(matches[1]);
          const longitude = Number(matches[2]);

          // Swap if necessary or pass directly
          var swapLats = this.swapElements([latitude, longitude], 0, 1);

          location = {
            type: "Point",
            coordinates: swapLats
          };

        } else {
          console.log("Latitude and Longitude not found in the URL.");
        }
      } else if (data.inputType == 'coordinate') {
        this.invalidUrl = false;
        const regex = /^-?\d+\.\d+,\s?-?\d+\.\d+$/;
        const url = data.urlValue;
        if (!regex.test(url)) {
          this.invalidLatitude = true;
          return;
        }
        this.selectLatitudeType = false;
        const coordinates = data.urlValue.split(',').map((num: any) => Number(num));

        var swapLats = this.swapElements(coordinates, 0, 1);

        location = {
          type: "Point",
          coordinates: swapLats
        };


      } else {
        this.selectLatitudeType = true;
        return
      }

    };


    const formData = {
      primaryCategoryId: this.selectedPrimaryCategory,
      categoryID: this.selectedCategory,
      shopName: data.shopName,
      shopType: this.selectedShopType,
      address: data.address,
      area: this.selectedArea,
      ownerName: data.ownerName,
      phoneNo: data.phoneNo,
      coordinates: location,
      days: this.selectedDate,
      openTime: data.openTime,
      closeTime: data.closeTime,
      pincode: data.pincode,
      id: this.ID
    };
  
    const url = num === 1 ? 'addShops' : 'updateShops';
  
    this.service.postAPI(url, formData).subscribe({
      next: (res: any) => {
        if (res.success === true) {
          this.data = res.items;
          this.filteredData = this.data;
          this.areaData = [...new Set(this.data.map(item => item.area))]
            .map(area => ({ area }));
          this.toastr.success(res.msg);
  
          if (num === 1) {
            this.myForm.reset();
          } else {
            this.closeModal3.nativeElement.click();
            this.myEditForm.reset();
          }
  
          this.selectedCategory = [];
          this.selectedPrimaryCategory = '';
  
          // Update cache with the new response
          const request = new HttpRequest('GET', this.service.getReqApi('getShops')); // Replace with the actual URL
          const response = new HttpResponse({ body: res });
          this.cacheService.set(request.url, response);
  
        } else {
          this.toastr.warning(res.msg);
        }
      },
      error: err => {
        // Handle errors
      }
    });


  };

  swapElements(array: any, index1: any, index2: any) {
    return [array[index1], array[index2]] = [array[index2], array[index1]];
  }

  filter(selectedValues: any[]) {

    if (selectedValues.length == 0) {
      this.filteredData = this.data;
    } else {
      const selectedAreaNames = selectedValues.map(value => value.area);
      this.selectedAreas = selectedValues;

      this.filteredData = this.data.filter(item => selectedAreaNames.includes(item.area));


    }
  };
  filter2(selectedValues: any[]) {
    console.log(selectedValues)
    if (selectedValues.length == 0) {
      this.filteredData = this.data;
    } else {
      const selectedCategory = selectedValues.map(value => value.category_name);
      console.log(selectedCategory)
      this.selectedFilcategory = selectedValues;

      this.filteredData = this.data.filter(item =>
        item.categoryDetails.some((items: any) =>
          selectedCategory.includes(items.category_name)
        )
      );
    }
  };

  clear(table: Table) {
    table.clear();
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value.trim().toLowerCase();
    this.table.filterGlobal(filterValue, 'contains');
  };


  getItems(id: any) {

  };

  onAddButon() {
    this.selectedCategory = [];
    this.myForm.reset();
  }

  Onupdatebutton(shopData: any) {
    this.selectedCategory = shopData.categoryDetails.map((items: any) => items._id);

    this.selectedDate = shopData.workingDays;
    this.ID = shopData._id;
    this.selectedPrimaryCategory = shopData.newPrimaryCategoryId;
    console.log(this.selectedArea)
    this.selectedpINCODE = shopData.pincode;
    this.getAreaList("event", '1')
    this.selectedArea = shopData.area;
    console.log(shopData)
    this.myEditForm.patchValue({
      shopType: shopData.shopType,
      shopName: shopData.shopName,
      address: shopData.address,
      inputType: 'coordinate',
      urlValue: `${shopData.location.coordinates[1]},${shopData.location.coordinates[0]}`,
      ownerName: shopData.ownerName,
      phoneNo: shopData.phoneNo,
      category: shopData.category,
      openTime: shopData.openTime,
      closeTime: shopData.closeTime,
      pincode: shopData.pincode
    });
  };

  navigateWithImages(customerId: any) {
    this.route.navigate(['/main/shopImages'], { queryParams: { id: customerId } });
  }










}
