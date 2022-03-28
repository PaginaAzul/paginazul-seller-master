import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
declare var $;
declare var google;
import { IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  profilePic=localStorage.getItem("profilePic")
  name=localStorage.getItem("name")
  storeType=localStorage.getItem("type")
  sellerId=localStorage.getItem("_id")
  sellerRecord: any
  @ViewChild('fileUploader') fileUploader: ElementRef;
  @ViewChild('fileUploader1') fileUploader1: ElementRef;
  searchForm: FormGroup;
  formvalidation: any = { submitted: false }
  dropdownSettings = {};

  editForm: any;
  activeImage: any = ''
  imageToEdit: any = ''
  flag: number;
  buttonDisable: number;
  formdata = new FormData
  editformdata = new FormData
  fileLength: any;
  bannerId: any;
  schoolEditingId: any;
  index: any;
  advertisementData: any;
  appScreenName: any;
  region: any;
  time: any;
  todayDate: Date;
  pageData: any;
  commentData: any;
  categoryData = ['Grocery Store', 'Restaurant']
  activeImage1: any;
  map: any
  currentLat
  currentLong
  latitude: any
  longitude: any
  documentUrl: any = []
  profileUrl: any = []
  dropdownList: any = [];

  selectedItems: any = [];

  newArrya:any=[]
  constructor(public service: AppService,
    private spinner: NgxSpinnerService,

    public router: Router,
    private _location: Location) {
  }

  ngOnInit(): void {
    this.sellerData()

    this.editForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      minimumValue: new FormControl('', [Validators.required,Validators.pattern(/^(\d*\.)?\d+$/)]),
      openingTime: new FormControl('', [Validators.required]),
      closingTime: new FormControl('', [Validators.required]),
      deliveryTime: new FormControl('', [Validators.required,Validators.pattern(/^(\d*\.)?\d+$/)]),
      address: new FormControl('', [Validators.required]),
      cuisine: new FormControl('', []),
    })

    this.dropdownSettings = {
      singleSelection: false,
      // selectAllText: 'Select All',
      // unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      // allowSearchFilter: true
    };


  }

  onItemSelect(item: any) {

   
    let a=this.newArrya.includes(item)
    if (a == true) {
      let index = this.newArrya.indexOf(item);
      if (index > -1) {
        this.newArrya.splice(index, 1);
      }
    }
    else{
      this.newArrya.push(item)
    }
  }
  onSelectAll(items: any) {
    console.log(items);
  }



  focusFunction(varids) {
    var sourcePlace = document.getElementById(varids);
    var autocomplete = new google.maps.places.Autocomplete(sourcePlace);
    autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name', 'formatted_address']);
    var infowindow = new google.maps.InfoWindow();
    autocomplete.addListener('place_changed', () => {
      var placeOne = autocomplete.getPlace();
      if (!placeOne.geometry) {
        window.alert("No details available for input: '" + placeOne.name + "'");
        return;
      }
      var address = '';
      if (placeOne.address_components) {
        address = [
          (placeOne.address_components[0] && placeOne.address_components[0].short_name || ''),
          (placeOne.address_components[1] && placeOne.address_components[1].short_name || ''),
          (placeOne.address_components[2] && placeOne.address_components[2].short_name || '')
        ].join(' ');
      }
      this.latitude = placeOne.geometry.location.lat();
      this.longitude = placeOne.geometry.location.lng();
      this.editForm.patchValue({
        address: placeOne.formatted_address
      })

    });
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

  open(a){
    window.open(a)
  }

  sellerData() {
    let apiReq =
    {
      "sellerId": localStorage.getItem('_id'),
    }
    this.service.postApi('/api/v1/user/getSellerDetail', apiReq, 0).subscribe((res: any) => {
      if (res.response_code == 200) {
        this.sellerRecord = res.Data;
        this.editForm.patchValue(this.sellerRecord)
        this.activeImage = this.sellerRecord.image
        this.latitude = this.sellerRecord.latitude
        this.longitude = this.sellerRecord.longitude
        this.selectedItems=this.sellerRecord.cuisinesName
        this.newArrya=this.sellerRecord.cuisinesName
       
      }
    }, error => {
      this.service.err("Something went wrong")
    })
  }

  editApi() {

    console.log("xxxx",this.newArrya)
    this.spinner.show();
    this.formvalidation.submitted = true
    if (this.activeImage == '') {
      this.flag = 1
      this.spinner.hide();
      return
    }
    if (this.activeImage1 == '') {
      this.flag = 1
      this.spinner.hide();
      return
    }
    else {
      this.flag = 2
    }
    if (this.editForm.invalid) {
      this.spinner.hide();
      return
    }
    let formData = new FormData()
    this.service.showSpinner()
    formData.append("name", this.editForm.value.name)
    formData.append("description", this.editForm.value.description)
    formData.append("minimumValue", this.editForm.value.minimumValue)
    formData.append("address", this.editForm.value.address)
    formData.append("openingTime", this.editForm.value.openingTime)
    formData.append("closingTime", this.editForm.value.closingTime)
    formData.append("deliveryTime", this.editForm.value.deliveryTime)
    formData.append("cuisine", this.editForm.value.cuisine)
    formData.append("latitude", this.latitude)
    formData.append("sellerId", this.sellerId)
    formData.append("longitude", this.longitude)
    if(this.profileUrl.length>0){
      formData.append(`image`, this.profileUrl[0])
    }
    
    this.service.formdataApi("/api/v1/user/sellerProfileUpdate", formData).subscribe((result: any) => {
      if (result.body.status == "SUCCESS") {
        this.service.succ(result.body.response_message)
        this.service.hideSpinner()
        this.sellerData()
      } else {
        this.service.hideSpinner()
        this.service.err(result.body.response_message)
      }
    }, error => {
      this.service.hideSpinner()
      this.service.err("Something went wrong")
    })

  }
  backClicked() {
    this._location.back();
  }

  cancel() {
    this.editForm.reset()
    this.activeImage = ''
    this.fileUploader.nativeElement.value = null;
  }



}
