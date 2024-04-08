import { Component } from '@angular/core';
import { ProductsService } from '../../products.service';
import { AuthService } from '../../auth/auth.service';
import { iProduct } from '../../Models/iproduct';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  products: iProduct[] = [];
  categories: string[] = [];
  filteredProducts: iProduct[] = [];
  showFiltered: boolean = false;


  isAdmin: boolean = false

  constructor(private productsSvc: ProductsService, private authSvc: AuthService) { }

  ngOnInit(): void {
    this.productsSvc.getAll().subscribe(allProducts => {
      this.products = allProducts;
    });

    this.authSvc.user$.subscribe(user => {
      this.isAdmin = !!user && user.admin;
      if(user) {
        const wishlistIds = user.wishlist || [];
        this.products.forEach(product => {
          product.isInWishlist = wishlistIds.includes(product.id);
        });
      }
    });
    this.productsSvc.getUniqueCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  toggleWishlist(product: iProduct): void {
    const userId = this.authSvc.getCurrentUserId();
    if (!userId) {
      console.error('ID utente non valido');
      return;
    }

    if (product.isInWishlist) {
      this.authSvc.deleteWish(userId, product.id).subscribe(() => {
        console.log('Prodotto rimosso dalla wishlist con successo!');
        product.isInWishlist = false;
      }, error => {
        console.error('Errore nella rimozione dalla wishlist', error);
      });
    } else {
      this.authSvc.addWish(userId, product.id).subscribe(() => {
        console.log('Prodotto aggiunto alla wishlist con successo!');
        product.isInWishlist = true;
      }, error => {
        console.error('Errore nell\'aggiungere alla wishlist', error);
      });
    }
  }

  filterByCategory(category: string): void {
    this.productsSvc.getProductsByCategory(category).subscribe(filtered => {
      this.filteredProducts = filtered;
      this.showFiltered = true;
      console.log('categorie filtrate!');

    });
  }

}
