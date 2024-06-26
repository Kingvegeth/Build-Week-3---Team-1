import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './main-components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';

import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { FormsModule } from '@angular/forms';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { ProductDetailComponent } from './components/modals/product-detail/product-detail.component';
import { FooterComponent } from './main-components/footer/footer.component';





@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    CartComponent,
    WishlistComponent,

    EditProductComponent,
    AddProductComponent,
    ProductDetailComponent,
    FooterComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
