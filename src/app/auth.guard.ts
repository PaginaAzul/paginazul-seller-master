import { Injectable } from '@angular/core';
import { Router, NavigationEnd, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  permissionData: any;
  data: { "userId": string; };
  sidemenu: string;
  constructor(private router: Router, private service: AppService) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.sidemenu = event.url.split('/')[2];
        console.log('authauth====>', this.sidemenu);
      }
    })
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    this.data =
      {
        "userId": localStorage.getItem('_id'),
      }
    this.service.postApi('/api/v1/admin/getAdminDetail', this.data, 1)
      .subscribe((response: any) => {
        console.log('gfdgdfgdfgdfgdfgdf', response)
        if (response.response_code == 200) {
          this.permissionData = response.Data.permission[0];
        } else {
          console.log("Err")
        }
      }, error => {
        console.log("Err")
      })
    console.log('permission====>', this.permissionData)
    if (this.permissionData) {
      if (this.sidemenu == 'userManagement') {
        if (this.permissionData.userManagement)
          return true;
        else
          this.router.navigate(["/dashboard"]);
      }
      if (this.sidemenu == 'postManagement') {
        if (this.permissionData.orderManagement)
          return true;
        else
          this.router.navigate(["/dashboard"]);
      }


    }
    this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
