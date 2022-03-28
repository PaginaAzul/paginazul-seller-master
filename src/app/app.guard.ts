import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {
  constructor(private router: Router) { }
  status:true
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (localStorage.getItem('token') != null && localStorage.getItem('_id').length==24) {
      return true;          
    }
    else{
      window.alert("You don't have permission to view this page");
      this.router.navigate(['/login']);
      return false;

    }
    
  }  
}
