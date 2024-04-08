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

  constructor(private authService: AuthService, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user && user.wishlist && user.wishlist.length) {
        this.productsService.getWishlist(user.wishlist).subscribe(products => {
          this.currentUserWishlistProducts = products;
        });
      } else {
        this.currentUserWishlistProducts = [];
      }
    });
  }

  removeFromWishlist(productId: number): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.authService.deleteWish(userId, productId).subscribe({
        next: () => {
          console.log('Prodotto rimosso dalla wishlist con successo!');
          this.currentUserWishlistProducts = this.currentUserWishlistProducts.filter(product => product.id !== productId);
        },
        error: (error) => {
          console.error('Errore nella rimozione dalla wishlist', error);
        }
      });
    } else {
      console.error('ID utente non valido');
    }
  }

}
