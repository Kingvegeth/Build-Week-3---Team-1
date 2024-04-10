import { ProductsService } from './../../products.service';
import { Component, HostListener, TemplateRef, inject } from '@angular/core';
import { iProduct } from '../../Models/iproduct';
import { AuthService } from '../../auth/auth.service';

import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CouponsService } from '../../coupons.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  products: iProduct[] = [];
  currentUserCartProducts: iProduct[] = [];
  productCount: { [productId: number]: number } = {};
  totalCartPrice: number = 0;
  discountedPrice: number = 0;
  showAlert:boolean = false

  couponCode: string = '';
  couponApplied: boolean = false

  errorMessage: string = '';

  scrolled:boolean = false;

  private offcanvasService = inject(NgbOffcanvas);

  constructor(private authSvc: AuthService, private productsSVC: ProductsService, private couponsSvc: CouponsService) { }

  ngOnInit(): void {
    this.loadCart();
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
        this.updateTotalCartPrice();
      },
      error: (error) => {
        console.error('Errore nell\'aggiungere al carrello', error);
      }
    });
  }

  loadCart(): void {
    this.authSvc.user$.subscribe(user => {
      if (user && user.cart && user.cart.length > 0) {
        const productCount: { [productId: number]: number } = {};
        user.cart.forEach((productId) => {
          productCount[productId] = (productCount[productId] || 0) + 1;
        });
        this.productsSVC.getCart(user.cart).subscribe(products => {
          this.currentUserCartProducts = products;
          this.currentUserCartProducts.forEach(product => {
            product.isInCart = (productCount[product.id] || 0) >= 2;
          });
          this.productCount = productCount;
          this.updateTotalCartPrice();
        });
      } else {
        this.currentUserCartProducts = [];
      }
    });
  }

  removeFromCart(productId: number): void {
    const userId = this.authSvc.getCurrentUserId();
    if (userId) {
      this.authSvc.deleteCart(userId, productId).subscribe({
        next: () => {
          console.log('Prodotto rimosso dal carrello con successo!');
          this.currentUserCartProducts = this.currentUserCartProducts.filter(product => product.id !== productId);
          this.updateTotalCartPrice();
        },
        error: (error) => console.error('Errore nella rimozione dal carrello', error)
      });
    } else {
      console.error('ID utente non valido');
    }
  }

  emptyCart(userId:number):void{
    this.authSvc.emptyCart(userId);
  }


  updateTotalCartPrice(): void {
    this.totalCartPrice = this.currentUserCartProducts.reduce((total, product) => {
      return total + (product.price * (this.productCount[product.id] || 1));
    }, 0);
  }

  openEnd(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'end' });
	}

  applyCoupon() {
    try {
      this.discountedPrice = this.couponsSvc.Coupon(this.couponCode, this.totalCartPrice);
      this.couponApplied = true
      this.errorMessage = '';
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    }
  }

  checkoutCompleted(){
    const userId = this.authSvc.getCurrentUserId();
    if (userId) {
      this.authSvc.emptyCart(userId).subscribe({
        next: () => {
          console.log('Carrello svuotato con successo');
          this.loadCart();
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 2000);
        },
        error: (error) => {
          console.error('Errore durante lo svuotamento del carrello', error);
        }
      });
    } else {
      console.error('ID utente non valido');
    }
  }


@HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset > 155) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }
}
