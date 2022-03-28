import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $;

@Component({
  selector: 'app-product-add-item',
  templateUrl: './product-add-item.component.html',
  styleUrls: ['./product-add-item.component.scss']
})
export class ProductAddItemComponent implements OnInit {

  @ViewChild('fileUploader') fileUploader: ElementRef;
  searchForm: FormGroup;
  formvalidation: any = { submitted: false }
  
  addMenuForm: any;
  activeImage: any = ''
  imageToEdit: any = ''
  flag: number;
  buttonDisable: number;
  formdata = new FormData
  fileLength: any;
  bannerId: any;
  schoolEditingId: any;
  index: any;
  advertisementData: any;
  appScreenproductName: any;
  region: any;
  time: any;
  todayDate: Date;
  pageData: any;
  commentData: any;
  categoryData = ['Veg', 'Non-Veg']
  activeImage1: any;
  documentUrl: any=[]
  profileUrl: any=[]
  cuisines:any=[]
  categoryList:any=[]
  categoryName: any;
  categoryId: any;
  subcategoryList: any;

  constructor(public service: AppService,
    private spinner: NgxSpinnerService,
    public router: Router,
    private _location: Location) {
  }

  ngOnInit() {
    this.getCategoryData()

    this.addMenuForm = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required,Validators.pattern(/^(\d*\.)?\d+$/)]),
      measurement: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required,Validators.pattern(/^(\d*\.)?\d+$/)]),
      subCategoryName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      productCategoryId: new FormControl('', [Validators.required]),
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

  getCategoryData() {

    let obj={
      resAndStoreId:localStorage.getItem("_id")
    }
    this.service.postApi('/api/v1/user/getCategoryList',obj,0).subscribe((success) => {
      if (success.response_code == 200) {
        this.categoryList = success.Data
      }
      
    }, error => {
      this.service.hideSpinner()
    })
  }

  changeSubCategory(type) {



    let myData = this.categoryList.filter(data => data._id == type.target.value);
    console.log(myData)
    this.categoryName = myData[0].name
    this.categoryId = type.target.value
    let apiReq = {
      categoryId: type.target.value
    }

    this.service.postApi('/api/v1/user/getSubCategoryList', apiReq, 0).subscribe((categoryResult: any) => {
      if (categoryResult.response_code == 200) {
        this.subcategoryList = categoryResult.Data
      }
      else {
        this.service.err("Something went wrong")
      }
    }, error => {
      this.service.err("Something went wrong")
    })

  }

  addItem() {
    this.spinner.show();
    this.formvalidation.submitted = true
    if(this.profileUrl.length==0){
      this.service.err("Image is mandatory")
      this.spinner.hide();
      return
    }
    if (this.activeImage == '') {
      this.flag = 1
      this.spinner.hide();
      return
    }
    else {
      this.flag = 2
    }
   
    if (this.addMenuForm.invalid) {
      this.spinner.hide();
      return
    }
    let formData = new FormData()
    this.service.showSpinner()
    formData.append("productName", this.addMenuForm.value.productName)
    formData.append("quantity", this.addMenuForm.value.quantity)
    formData.append("price", this.addMenuForm.value.price)
    formData.append("measurement", this.addMenuForm.value.measurement)
    formData.append("description", this.addMenuForm.value.description)
    formData.append(`productImage`, this.profileUrl[0])
    formData.append("subCategoryName", this.addMenuForm.value.subCategoryName)
    formData.append("productCategoryId", this.categoryId)
    formData.append("categoryName", this.categoryName)
    formData.append(`type`, "Product")
    formData.append(`sellerId`, localStorage.getItem("_id"))

    this.service.formdataApi("/api/v1/user/addProduct", formData).subscribe((data: any) => {
      if (data.body.response_code == 200) {
        this.router.navigate(['/product-management'])
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
  backClicked() {
    this.addMenuForm.reset()
    this._location.back();
  }


  cuisineList() {


    this.service.getApi('/api/v1/user/getCuisineList').subscribe((res: any) => {
      if (res.response_code == 200) {
        this.cuisines = res.Data
       
      }
    }, error => {
      this.service.err("Something went wrong")
    })
  }


}
