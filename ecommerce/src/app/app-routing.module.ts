import { NotAdminGuard } from './auth/not-admin.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from './auth/guest.guard';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { AddProductComponent } from './pages/add-product/add-product.component';
import { AdminGuard } from './auth/admin.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
},
  {
    path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [GuestGuard],
  canActivateChild: [GuestGuard],
  },
  {
    path:'home',
    component:HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'cart',
    component:CartComponent,
    canActivate: [AuthGuard, NotAdminGuard]
  },
  {
    path:'wishlist',
    component:WishlistComponent,
    canActivate: [AuthGuard, NotAdminGuard]
  },

  {
    path:'edit-product/:id',
    component:EditProductComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path:'add-product',
    component:AddProductComponent,
    canActivate: [AuthGuard, AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
