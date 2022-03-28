import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @ViewChild('fileUploader') fileUploader: ElementRef;
  [x: string]: any;
  searchForm: FormGroup;
  formvalidation: any = { submitted: false }
  recordArray: any = [];
  pageNumber = 1;
  limit: any;
  total: any;
  srNumber: any;
  dateValue: any;
  userId: any;
  id: any;
  nowDate2: any;
  editPriceForm: any;
  spinnerService: any;
  fileLength: any;
  todayDate: Date;
  editMenuForm: FormGroup;
  addOfferForm: FormGroup;
  profileUrl: any = []
  cuisines: any = []
  categoryData = ['Veg', 'Non-Veg']
  statusData = ['Active', 'Inactive']
  eatData = ['Baby Food', 'Cookie diet']
  tasteData = ['Sweet', 'Spicy']
  activeImage: any = ''
  productId: any
  storeList:any=[]
  categoryList:any=[]
  storeId:any
  isEdit:any=false



  constructor(public service: AppService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private _location: Location) { }

  ngOnInit() {
    this.cuisineList()
    this.searchFormVAlue()
    this.getViewData()
    this.getStoreData()
    this.editMenuForm = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      productType: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required, Validators.pattern(/^(\d*\.)?\d+$/)]),
      measurement: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.pattern(/^(\d*\.)?\d+$/)]),
      cuisine: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      tasteType: new FormControl('', [Validators.required]),
      eatType: new FormControl('', [Validators.required]),
    })
    this.addOfferForm = new FormGroup({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      offerStatus: new FormControl('', [Validators.required]),
      offerQuantity: new FormControl('', [Validators.required]),
      storeId: new FormControl('', [Validators.required]),
      storeCategoryId: new FormControl('', [Validators.required]),
      offerPrice: new FormControl('', [Validators.required, Validators.pattern(/^(\d*\.)?\d+$/)]),

    })

  }


  searchFormVAlue() {
    this.searchForm = new FormGroup({
      search: new FormControl(''),

    })
  }

  selectImages(event) {
    var urls = [];
    var file = event.target.files;
    if (file) {
      for (let files of file) {
        this.profileUrl.push(files)
        let reader = new FileReader();
        reader.onload = (e: any) => {
          urls.push(e.target.result);
          var urlsLength = urls.length
          if (urlsLength == file.length) {
            this.activeImage = urls[0]
            this.flag = 2
          }
        }
        reader.readAsDataURL(files);
      }

    }
  }

  pagination(event) {
    this.pageNumber = event
    this.getViewData()
  }

  getViewData() {

    let apireq = {
      "limit": 100,
      "pageNumber": this.pageNumber,
      "search": "",
      sellerId: localStorage.getItem("_id")
    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/getMenuListForSeller', apireq, 0).subscribe((success: any) => {
      if (success.response_code == 200) {
        this.searchForm.reset()
        this.spinner.hide();
        this.recordArray = success.Data.docs;
        this.limit = success.Data.limit;
        this.total = success.Data.total;
        this.srNumber = (this.pageNumber - 1) * 10;
      }
      else {
        this.spinner.hide();
        this.service.err("Something went wrong")
      }
    }, error => {
      console.log(error)
      this.spinner.hide();
      this.service.err("Something went wrong")
    })
  }

  getStoreData() {

    this.service.getApi('/api/v1/user/getStoreType').subscribe((success) => {
      if (success.response_code == 200) {
        this.storeList = success.Data
      }
      
    }, error => {
      this.service.hideSpinner()
    })
  }

  changeCategory(type) {
    
    
    this.storeId = type.target.value
    let apiReq = {
      storeId: this.storeId
    }

    this.service.postApi('/api/v1/user/getStoreCategory', apiReq, 0).subscribe((categoryResult: any) => {
     
      if (categoryResult.response_code == 200) {
        this.categoryList = categoryResult.Data
      }
      else {
        console.log("hiii")
        this.service.err("Something went wrong")
      }
    }, error => {
      console.log("hiii",error)
      this.service.err("Something went wrong")
    })

  }

  toggless(x) {
    this.productId = x._id,
      this.activeImage = x.productImage
    this.editMenuForm.patchValue(x)
  }

  editItem() {
    this.spinner.show();
    this.formvalidation.submitted = true
    if (this.editMenuForm.invalid) {
      this.spinner.hide();
      return
    }
    let formData = new FormData()
    this.service.showSpinner()
    formData.append("productName", this.editMenuForm.value.productName)
    formData.append("productType", this.editMenuForm.value.productType)
    formData.append("quantity", this.editMenuForm.value.quantity)
    formData.append("cuisine", this.editMenuForm.value.cuisine)
    formData.append("price", this.editMenuForm.value.price)
    formData.append("measurement", this.editMenuForm.value.measurement)
    formData.append("description", this.editMenuForm.value.description)
    formData.append("tasteType", this.editMenuForm.value.tasteType)
    formData.append("eatType", this.editMenuForm.value.eatType)
    if (this.profileUrl.length > 0) {
      formData.append(`productImage`, this.profileUrl[0])
    }

    formData.append(`type`, "Menu")
    formData.append(`productId`, this.productId)

    this.service.formdataApi("/api/v1/user/editProduct", formData).subscribe((data: any) => {
      if (data.body.response_code == 200) {
        this.router.navigate(['/menu'])
        this.getViewData()
        $("#toggless").modal('hide')
        this.service.succ(data.body.response_message)
        this.service.hideSpinner()
      } else {
        this.service.hideSpinner()
        this.service.succ(data.body.response_message)
      }
    }, error => {
      console.log(error)
      this.service.hideSpinner()
      this.service.err("Something went wrong")
    })

  }

  toggles(x) {
   
    this.productId = x._id
    this.storeId=x.storeId
    this.isEdit=true
    this.addOfferForm.patchValue({
      offerStatus: x.oStatus,
      offerQuantity: x.offerQuantity,
      offerPrice: x.offerPrice,
      startDate:new Date(x.startDate).toISOString().split('T')[0],
      endDate:new Date(x.endDate).toISOString().split('T')[0]
    })
    this.addOfferForm.get('storeId').setValue(x.storeId);
    this.changeCategory(this.storeId)
    this.addOfferForm.get('storeCategoryId').setValue(x.storeCategoryId);
  }

  addOffer(data) {

    this.formvalidation.submitted = true
    if (this.addOfferForm.invalid) {
      this.spinner.hide();
      return
    }
    let apireq = {
      "productId": this.productId,
      endDate: data.endDate,
      startDate: data.startDate,
      offerPrice: data.offerPrice,
      status: data.offerStatus,
      offerQuantity: data.offerQuantity,
      storeId:this.storeId,
      storeCategoryId:data.storeCategoryId

    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/updateOfferSeller', apireq, 0).subscribe(success => {

      if (success.response_code == 200) {
        this.spinner.hide()
        this.service.succ(success.response_message)
        $('#toggles').modal('hide')
        this.getViewData();

      }
      else {
        this.spinner.hide()
        this.service.err("Something went wrong")
      }
    }, error => {
      this.spinner.hide()
      this.service.err("Something went wrong")
    })
  }


  search(data) {

    let apireq = {
      "limit": 100,
      "pageNumber": this.pageNumber,
      "search": data.search,
      sellerId: localStorage.getItem("_id")

    }

    this.service.postApi('/api/v1/user/getMenuListForSeller', apireq, 0).subscribe((success: any) => {
      if (success.response_code == 200) {
        this.spinner.hide();
        this.recordArray = success.Data.docs;
        this.limit = success.Data.limit;
        this.total = success.Data.total;
        this.srNumber = (this.pageNumber - 1) * 10;
      }
      else {
        this.service.err("Something went wrong")
      }
    }, error => {
      this.service.err("Something went wrong")
    })
  }



  blockApi(status, id) {

    let apireq = {
      "productId": id,
      "status": status,
    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/updateProductStatus', apireq, 0).subscribe((success: any) => {
      if (success.response_code == 200) {
        this.spinner.hide()
        this.getViewData()
        this.service.succ(success.response_message)
      }
      else {
        this.spinner.hide()
        this.service.err("Something went wrong")
      }
    }, error => {
      this.spinner.hide()
      this.service.err("Something went wrong")
    })
  }

  updateOfferStatus(status, id) {

    let apireq = {
      "productId": id,
      "status": status,
    }

    this.spinner.show();
    this.service.postApi('/api/v1/user/updateOfferSeller', apireq, 0).subscribe((success: any) => {
      if (success.response_code == 200) {
        this.spinner.hide()
        this.getViewData()
        this.service.succ(success.response_message)
      }
      else {
        this.spinner.hide()
        this.service.err("Something went wrong")
      }
    }, error => {
      this.spinner.hide()
      this.service.err("Something went wrong")
    })
  }

  cuisineList() {

    let request = {
      sellerId: localStorage.getItem("_id")
    }

    this.service.postApi('/api/v1/user/getCuisineList', request, 0).subscribe((res: any) => {
      if (res.response_code == 200) {
        this.cuisines = res.Data
      }
    }, error => {
      console.log("hiii",error)
      this.service.err("Something went wrong")
    })
  }


  DeleteModal(id) {
    this.id = id;
  }

  deleteApi() {

    let apireq = {
      "productId": this.id,
    }


    this.spinner.show();
    this.service.postApi('/api/v1/user/deleteProduct', apireq, 0).subscribe(success => {

      if (success.response_code == 200) {
        this.spinner.hide()
        this.service.succ(success.response_message)
        $('#DeleteModal').modal('hide')
        this.getViewData();

      }
      else {
        this.spinner.hide()
        this.service.err("Something went wrong")
      }
    }, error => {
      this.spinner.hide()
      this.service.err("Something went wrong")
    })
  }


  changeDate() {
    this.dateValue = new Date(this.searchForm.value.formDate)
  }

  backClicked() {
    this._location.back();
  }


  cancelModal() {
    this.formvalidation.submitted = false
    this.addOfferForm.reset()
    this.editMenuForm.reset()
    this.activeImage = ''
    this.fileUploader.nativeElement.value = null;
    this.flag = 0

  }


}
