import { Component } from '@angular/core';
import { iProduct } from '../../Models/iproduct';
import { AuthService } from '../../auth/auth.service';
import { ProductsService } from '../../products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {


  currentUserCartProducts: iProduct[] = [];


  constructor(private authService: AuthService, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.loadCart();
  }



  loadCart(): void {
    this.authService.user$.subscribe(user => {
      if (user && user.cart && user.cart.length > 0) {
        this.productsService.getCart(user.cart).subscribe(products => {
          this.currentUserCartProducts = products;
        });
      } else {
        this.currentUserCartProducts = [];
      }
    });
  }


  removeFromCart(productId: number): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.authService.deleteCart(userId, productId).subscribe({
        next: () => {
          console.log('Prodotto rimosso dal carrello con successo!');
          this.currentUserCartProducts = this.currentUserCartProducts.filter(product => product.id !== productId);
        },
        error: (error) => console.error('Errore nella rimozione dal carrello', error)
      });
    } else {
      console.error('ID utente non valido');
    }
  }

  countProductInCart(productId: number): number {
    return this.currentUserCartProducts.filter(product => product.id === productId).length;
  }

}
