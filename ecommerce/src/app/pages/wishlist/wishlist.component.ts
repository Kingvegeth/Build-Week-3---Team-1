import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ProductsService } from '../../products.service';
import { iProduct } from '../../Models/iproduct';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {

  currentUserWishlistProducts: iProduct[] = [];
  isAdmin: boolean = false;

  constructor(private authSvc: AuthService, private productsSvc: ProductsService) { }

  ngOnInit(): void {
    this.loadWishlist();
    this.checkAdminStatus();
  }



  loadWishlist(): void {
    this.authSvc.user$.subscribe(user => {
      if (user && user.wishlist && user.wishlist.length > 0) {
        this.productsSvc.getWishlist(user.wishlist).subscribe(products => {
          this.currentUserWishlistProducts = products;
        });
      } else {
        this.currentUserWishlistProducts = [];
      }
    });
  }

  checkAdminStatus(): void {
    this.authSvc.user$.subscribe(user => {
      this.isAdmin = !!user && user.admin;
    });
  }

  removeFromWishlist(productId: number): void {
    const userId = this.authSvc.getCurrentUserId();
    if (userId) {
      this.authSvc.deleteWish(userId, productId).subscribe({
        next: () => {
          console.log('Prodotto rimosso dalla wishlist con successo!');
          this.currentUserWishlistProducts = this.currentUserWishlistProducts.filter(product => product.id !== productId);
        },
        error: (error) => console.error('Errore nella rimozione dalla wishlist', error)
      });
    } else {
      console.error('ID utente non valido');
    }
  }

  addToCart(product: iProduct): void {
    console.log('Aggiunta al carrello in corso...');

    const userId = this.authSvc.getCurrentUserId();
    if (!userId) {
      console.error('ID utente non valido');
      return;
    }

    this.authSvc.addCart(userId, product.id).subscribe({
      next: () => {
        console.log('Prodotto aggiunto al carrello con successo!');

      },
      error: (error) => {
        console.error('Errore nell\'aggiungere al carrello', error);

      }
    });
  }



}
