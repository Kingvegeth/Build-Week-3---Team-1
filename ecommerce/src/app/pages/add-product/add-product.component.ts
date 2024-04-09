import { Component } from '@angular/core';
import { ProductsService } from '../../products.service';
import { Router } from '@angular/router';
import { iProduct } from '../../Models/iproduct';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {

  product: iProduct = {

    id: 0,
    name: '',
    category: '',
    price: 0,
    brand: '',
    productImg: '',
    description: '',
    available: true,
  };

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) { }

  saveProduct(): void {
    this.productsService.addProduct(this.product).subscribe({
      next: () => {
        console.log('Nuovo prodotto aggiunto con successo');
        this.router.navigate(['/home']);
      },
      error: (err) => console.error('Errore durante l\'aggiunta del nuovo prodotto:', err)
    });
  }

}
