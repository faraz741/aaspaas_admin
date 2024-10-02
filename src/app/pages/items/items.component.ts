import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { CacheService } from 'src/app/services/cache.service';
import { MainService } from 'src/app/services/main.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent {
  @ViewChild('dt') table!: Table;
  //newForm!: FormGroup;
  UploadedFile!: File;
  @ViewChild('closeModal2') closeModal2!: ElementRef;
  data: any[] = [];
  suggestionData: any[] = [];
  loading: boolean = true;
  categoryID: any;
  categoryName: any;
  page!: any;
  searchSubject: Subject<string> = new Subject();
  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(800), // Wait 1 second after the last event
      distinctUntilChanged() // Only emit when the current value is different than the last
    ).subscribe(searchTerm => {
  
      this.fetchItemsSuggestions(searchTerm);
    });
    this.getData();
  }

  constructor(private route: Router, private service: MainService, private activatedRoute: ActivatedRoute, private cacheService: CacheService, private toastr: ToastrService) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.categoryID = params.get('id');
      this.categoryName = params.get('name');
  

    });
     // Capture the page number from the query parameters
  this.activatedRoute.queryParamMap.subscribe(queryParams => {
    this.page = queryParams.get('page') || 1;
  });
  }

  getData() {
    const data = {
      categoryID: this.categoryID
    };
    this.service.postAPI('getItemsByCategory', data).subscribe({
      next: resp => {
        if (resp.success == true) {
          this.data = resp.items;

        } else {
          this.toastr.warning(resp.msg);
        }

      },
      error: error => {
        console.log(error.message)
      }
    });
  };

  goBack() {
    console.log(this.page)
    this.route.navigate(['/main/category'], {
      queryParams: { page: this.page },
    });
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value.trim().toLowerCase();
    this.table.filterGlobal(filterValue, 'contains');
  };

  onSubmit(form: any) {
    const formData = {
      categoryID: this.categoryID,
      itemName: form.value.itemName,
      englishName: form.value.englishName
    };

    this.service.postAPI('AddItems', formData).subscribe({
      next: (res: any) => {
        console.log(res)

        if (res.success == true) {
          this.data = res.items;
          this.toastr.success(res.msg);
          form.reset();

          // this.getData()

        } else {
          this.toastr.warning(res.msg);
        }
      },
      error: err => {

      }
    })
  };

  deleteItems(id: any) {

    const formData = {
      categoryID: this.categoryID,
      itemsId: id,

    };
    this.service.postAPI(`deleteItems`, formData).subscribe({
      next: (res: any) => {
        console.log(res)

        if (res.success == true) {
          this.data = res.items;
          this.toastr.success(res.msg);
          // formData.reset();



        } else {
          this.toastr.warning(res.msg);
        }
      },
      error: err => {

      }
    })
  };

  searchItems(event: any) {
    const searchTerm = event.target.value;
    this.searchSubject.next(searchTerm);
  }

  fetchItemsSuggestions(searchTerm: string) {
    if (searchTerm === '') {
      this.suggestionData = [];
      return;
    }
  
    const formData = {
      itemKey: searchTerm,
    };
  
    this.service.postAPI(`getItemsSuggestions`, formData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.suggestionData = res.data;
        } else {
          this.suggestionData = [];
        }
      },
      error: err => {
        console.error(err);
      }
    });
  }


    }
