import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $;

@Component({
  selector: 'app-menu-add-item',
  templateUrl: './menu-add-item.component.html',
  styleUrls: ['./menu-add-item.component.scss']
})
export class MenuAddItemComponent implements OnInit {

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
  eatData = ['Baby Food', 'Cookie diet']
  tasteData = ['Sweet', 'Spicy']
  activeImage1: any;
  documentUrl: any=[]
  profileUrl: any=[]
  cuisines:any=[]

  constructor(public service: AppService,
    private spinner: NgxSpinnerService,
    public router: Router,
    private _location: Location) {
  }

  ngOnInit() {
    this.cuisineList()

    this.addMenuForm = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      productType: new FormControl('', []),
      quantity: new FormControl('', [Validators.required,Validators.pattern(/^(\d*\.)?\d+$/)]),
      measurement: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required,Validators.pattern(/^(\d*\.)?\d+$/)]),
      cuisine: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      tasteType: new FormControl('', [Validators.required]),
      eatType: new FormControl('', [Validators.required]),
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
    formData.append("productType", this.addMenuForm.value.productType)
    formData.append("quantity", this.addMenuForm.value.quantity)
    formData.append("cuisine", this.addMenuForm.value.cuisine)
    formData.append("price", this.addMenuForm.value.price)
    formData.append("measurement", this.addMenuForm.value.measurement)
    formData.append("description", this.addMenuForm.value.description)
    formData.append("tasteType", this.addMenuForm.value.tasteType)
    formData.append("eatType", this.addMenuForm.value.eatType)
    formData.append(`productImage`, this.profileUrl[0])
    formData.append(`type`, "Menu")
    formData.append(`sellerId`, localStorage.getItem("_id"))

    console.log("fo",formData)
    this.service.formdataApi("/api/v1/user/addProduct", formData).subscribe((data: any) => {
      if (data.body.response_code == 200) {
        this.router.navigate(['/menu'])
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

    let request={
      sellerId:localStorage.getItem("_id")
    }

    this.service.postApi('/api/v1/user/getCuisineList',request,0).subscribe((res: any) => {
      if (res.response_code == 200) {
        this.cuisines = res.Data       
      }
    }, error => {
      this.service.err("Something went wrong")
    })
  }


}
