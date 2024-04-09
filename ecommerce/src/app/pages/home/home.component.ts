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
  productsInOrder: iProduct[] = [];

  categories: string[] = [];
  filteredProducts: iProduct[] = [];
  showFiltered: boolean = false;


  searchTerms: string = ''

  isAdmin: boolean = false

  constructor(private productsSvc: ProductsService, private authSvc: AuthService) { }

  ngOnInit(): void {
    this.loadProducts()

  }

  loadProducts(){
    this.productsSvc.getAll().subscribe(allProducts => {
      this.products = allProducts;
      console.log(this.products);
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

  orderByPrice(order: string): void {
    const sourceProducts = this.showFiltered ? this.filteredProducts : this.products;

    this.productsSvc.orderedByPrice(order).subscribe(orderedProducts => {
      const orderedFilteredProducts = orderedProducts.filter(product =>
        sourceProducts.some(p => p.id === product.id)
      );
      if (this.showFiltered) {
        this.filteredProducts = orderedFilteredProducts;
      } else {
        this.products = orderedFilteredProducts;
      }
    });
  }

  toggleWishlist(product: iProduct): void {
    const userId = this.authSvc.getCurrentUserId();
    if (!userId) {
      console.error('ID utente non valido');
      return;
    }

    if (product.isInWishlist) {
      this.authSvc.deleteWish(userId, product.id).subscribe({
        next: () => {
          console.log('Prodotto rimosso dalla wishlist con successo!');
          product.isInWishlist = false;
        },
        error: (error) => {
          console.error('Errore nella rimozione dalla wishlist', error);
        }
      });
    } else {
      this.authSvc.addWish(userId, product.id).subscribe({
        next: () => {
          console.log('Prodotto aggiunto alla wishlist con successo!');
          product.isInWishlist = true;
        },
        error: (error) => {
          console.error('Errore nell\'aggiungere alla wishlist', error);
        }
      });
    }

  }


  ciao(){
    console.log('ciao');

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



  filterByCategory(category: string): void {
  this.productsSvc.getProductsByCategory(category).subscribe(filteredProducts => {
    this.products = filteredProducts;
  });
}

showAllProducts(): void {
  this.productsSvc.getAll().subscribe(allProducts => {
    this.products = allProducts;
  });
}

showSearch(event: any): void {
  const searchTerm = event?.target.value.trim().toLowerCase();
  if (searchTerm !== '') {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
    this.showFiltered = true;
  } else {
    this.filteredProducts = [...this.products];

    this.showFiltered = false;
  }
}



}
