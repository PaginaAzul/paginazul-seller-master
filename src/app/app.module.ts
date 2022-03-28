import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ForgetComponent } from './forget/forget.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { OrderComponent } from './order/order.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { SignupComponent } from './signup/signup.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { MenuAddItemComponent } from './menu-add-item/menu-add-item.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { ProductAddItemComponent } from './product-add-item/product-add-item.component';
import { OfferManagementComponent } from './offer-management/offer-management.component';
import { OfferDetailComponent } from './offer-detail/offer-detail.component';
import { NotificationComponent } from './notification/notification.component';
import { SettingComponent } from './setting/setting.component';
import { TncComponent } from './tnc/tnc.component';
import { HelpNSupportComponent } from './help-nsupport/help-nsupport.component';
import { SupportEditComponent } from './support-edit/support-edit.component';
import { BusinessOwnerProfileComponent } from './business-owner-profile/business-owner-profile.component';
import { CommissionManagementComponent } from './commission-management/commission-management.component';
import { PastOrderDetailComponent } from './past-order-detail/past-order-detail.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditTermsComponent } from './edit-terms/edit-terms.component';
// import { CKEditorModule } from 'ng2-ckeditor';

import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthGuard } from './auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DeliverySlotComponent } from './delivery-slot/delivery-slot.component';
import { CuisineManagementComponent } from './cuisine-management/cuisine-management.component';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { SubCategoryManagementComponent } from './sub-category-management/sub-category-management.component';



import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { MessagingService } from './service/messaging.service';
import { environment } from '../environments/environment';
import { AsyncPipe } from '../../node_modules/@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgetComponent,
    DashboardComponent,
    SidebarComponent,
    OrderComponent,
    HeaderComponent,
    MenuComponent,
    SignupComponent,
    OrderDetailComponent,
    MenuAddItemComponent,
    ProductManagementComponent,
    ProductAddItemComponent,
    OfferManagementComponent,
    OfferDetailComponent,
    NotificationComponent,
    SettingComponent,
    TncComponent,
    HelpNSupportComponent,
    SupportEditComponent,
    BusinessOwnerProfileComponent,
    CommissionManagementComponent,
    PastOrderDetailComponent,
    EditProfileComponent,
    EditTermsComponent,
    DeliverySlotComponent,
    CuisineManagementComponent,
    CategoryManagementComponent,
    SubCategoryManagementComponent,
  ],
  imports: [
    AngularMultiSelectModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressAnimation: "decreasing",
      newestOnTop:true,
      maxOpened:3,
      preventDuplicates: true,
      progressBar:true,

    }),
    NgMultiSelectDropDownModule.forRoot(),
    NgxSpinnerModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [MessagingService,AuthGuard,AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
