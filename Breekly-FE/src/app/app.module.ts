import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from "@auth0/angular-jwt";
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { ShippingInfoComponent } from './shipping-info/shipping-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { EditAddressDialogComponent } from './edit-address-dialog/edit-address-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { ManageSubscriptionsDialogComponent } from './manage-subscriptions-dialog/manage-subscriptions-dialog.component';
import { AdminComponent } from './admin/admin.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EditProductDialogComponent } from './edit-product-dialog/edit-product-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { environment } from '../environments/environment';

export function tokenGetter() {
  return localStorage.getItem("AUTH")
}

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    ProductComponent,
    CartComponent,
    ShippingInfoComponent,
    EditAddressDialogComponent,
    ManageSubscriptionsDialogComponent,
    AdminComponent,
    PageNotFoundComponent,
    EditProductDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      },
    }),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule
  ],
  providers: [
    { provide: BUCKET, useValue: environment.firebase.storageBucket }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
