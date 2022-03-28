import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessOwnerProfileComponent } from './business-owner-profile/business-owner-profile.component';
import { CommissionManagementComponent } from './commission-management/commission-management.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditTermsComponent } from './edit-terms/edit-terms.component';
import { ForgetComponent } from './forget/forget.component';
import { HelpNSupportComponent } from './help-nsupport/help-nsupport.component';
import { LoginComponent } from './login/login.component';
import { MenuAddItemComponent } from './menu-add-item/menu-add-item.component';
import { MenuComponent } from './menu/menu.component';
import { NotificationComponent } from './notification/notification.component';
import { OfferDetailComponent } from './offer-detail/offer-detail.component';
import { OfferManagementComponent } from './offer-management/offer-management.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderComponent } from './order/order.component';
import { PastOrderDetailComponent } from './past-order-detail/past-order-detail.component';
import { ProductAddItemComponent } from './product-add-item/product-add-item.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { SettingComponent } from './setting/setting.component';
import { SignupComponent } from './signup/signup.component';
import { SupportEditComponent } from './support-edit/support-edit.component';
import { TncComponent } from './tnc/tnc.component';
import { AppGuard } from './app.guard';
import { DeliverySlotComponent } from './delivery-slot/delivery-slot.component';
import { CuisineManagementComponent } from './cuisine-management/cuisine-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { SubCategoryManagementComponent } from './sub-category-management/sub-category-management.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'forgot-password', component: ForgetComponent},
  {path: 'order', component: OrderComponent,canActivate: [AppGuard]},
  {path: 'menu', component: MenuComponent,canActivate: [AppGuard]},
  {path: 'sign-up', component: SignupComponent},
  {path: 'current-order-detail', component: OrderDetailComponent,canActivate: [AppGuard]},
  {path: 'menu-add-item', component: MenuAddItemComponent,canActivate: [AppGuard]},
  {path: 'product-management', component: ProductManagementComponent,canActivate: [AppGuard]},
  {path: 'product-add-item', component: ProductAddItemComponent,canActivate: [AppGuard]},
  {path: 'offer-management', component: OfferManagementComponent,canActivate: [AppGuard]},
  {path: 'add-offer', component: OfferDetailComponent,canActivate: [AppGuard]},
  {path: 'notification', component: NotificationComponent,canActivate: [AppGuard]},
  {path: 'setting', component: SettingComponent,canActivate: [AppGuard]},
  {path: 'terms-&-condition', component: TncComponent,canActivate: [AppGuard]},
  {path: 'help-&-support', component: HelpNSupportComponent,canActivate: [AppGuard]},
  {path: 'support-revert', component: SupportEditComponent,canActivate: [AppGuard]},
  {path: 'business-owner-profile', component: BusinessOwnerProfileComponent,canActivate: [AppGuard]},
  {path: 'commision-management', component: CommissionManagementComponent,canActivate: [AppGuard]},
  {path: 'past-order-detail/:id', component: PastOrderDetailComponent,canActivate: [AppGuard]},
  {path: 'edit-profile', component: EditProfileComponent,canActivate: [AppGuard]},
  {path: 'edit-terms', component: EditTermsComponent,canActivate: [AppGuard]},
  {path: 'slot', component: DeliverySlotComponent,canActivate: [AppGuard]},
  {path: 'cuisine', component: CuisineManagementComponent,canActivate: [AppGuard]},
  {path: 'category', component: CategoryManagementComponent,canActivate: [AppGuard]},
  {path: 'subcategory/:id', component: SubCategoryManagementComponent,canActivate: [AppGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
