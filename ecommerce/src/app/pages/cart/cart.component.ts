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

  products: iProduct[] = [];

  currentUserCartProducts: iProduct[] = [];
  productCount: {[productId: number]: number} = {};


  constructor(private authService: AuthService, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.loadCart();
  }


  addToCart(product: iProduct): void {
    console.log('Aggiunta al carrello in corso...');

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      console.error('ID utente non valido');
      return;
    }

    this.authService.addCart(userId, product.id).subscribe({
      next: () => {
        console.log('Prodotto aggiunto al carrello con successo!');

      },
      error: (error) => {
        console.error('Errore nell\'aggiungere al carrello', error);

      }
    });
  }

  loadCart(): void {
    this.authService.user$.subscribe(user => {
      if (user && user.cart && user.cart.length > 0) {
        const productCount: {[productId: number]: number} = {};
        user.cart.forEach((productId) => {
          productCount[productId] = (productCount[productId] || 0) + 1;
        });
        this.productsService.getCart(user.cart).subscribe(products => {
          this.currentUserCartProducts = products;
          this.currentUserCartProducts.forEach(product => {
            product.isInCart = (productCount[product.id] || 0) >= 2;
          });
          this.productCount = productCount;
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



}
