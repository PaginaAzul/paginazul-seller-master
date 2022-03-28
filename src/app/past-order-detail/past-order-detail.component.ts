import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-past-order-detail',
  templateUrl: './past-order-detail.component.html',
  styleUrls: ['./past-order-detail.component.scss']
})
export class PastOrderDetailComponent implements OnInit {

  profilePic=localStorage.getItem("profilePic")
  name=localStorage.getItem("name")
  storeType=localStorage.getItem("type")
  sellerId=localStorage.getItem("_id")
  orderId: any;
  detail: any;
  image:any;
  productList:any=[]
  userData:any
  driverDetail:any
  productData:any

  constructor(
    public router : Router,
    private activatedRoute: ActivatedRoute,
    public service :AppService) { }

  ngOnInit() {
    this.getId()
    this.getUserData()
  }

  getId(){
    this.activatedRoute.params.subscribe(paramsId => {
      this.orderId = paramsId.id;
    });
  }

  open(a){
    window.open(a)
  }

  getUserData(){
    let apireq={
      orderId : this.orderId
    }
    this.service.postApi('/api/v1/user/orderDetail',apireq,0).subscribe((success)=>{
      if(success.response_code==200){
        this.detail = success.Data.orderDetail
        this.productList = success.Data.productList
        this.userData=success.Data.checkUser
        this.driverDetail=success.Data.driverDetail
       
      }
      else{
        console.log(success.response_message)
      }
    },error=>{
      console.log("Something went wrong")
    })
  }


}
