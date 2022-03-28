import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  profilePic=localStorage.getItem("profilePic")
  name=localStorage.getItem("name")
  constructor(
    private route: Router,
    private spinner: NgxSpinnerService,
    private service: AppService,
  ) { }

  ngOnInit(): void {
  }


  logout() {
    let apiReq =
    {
      "sellerId": localStorage.getItem('_id'),
    }
    this.service.postApi('/api/v1/user/sellerLogout', apiReq, 0).subscribe((res: any) => {
        if (res.response_code == 200) {
          localStorage.clear()
          this.route.navigate(['/'])
         this.service.succ(res.response_message)
        } 
      }, error => {
        this.service.err("Something went wrong")
      })
  }

}
