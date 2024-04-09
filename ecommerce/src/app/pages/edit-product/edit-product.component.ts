import { Component } from '@angular/core';
import { ProductsService } from '../../products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { iProduct } from '../../Models/iproduct';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent {

  product: iProduct | undefined;

  constructor(
    private route: ActivatedRoute,
    private productsSvc: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.productsSvc.getProductById(id).subscribe(product => this.product = product);
  }

  saveProduct(): void {
    if (this.product) {
      this.productsSvc.updateProduct(this.product).subscribe(() => {
        this.router.navigate(['/home']);
      });
    }
  }

  deleteProduct(productId: number): void {
    if(confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      this.productsSvc.deleteProduct(productId).subscribe({
        next: () => {
          console.log('Prodotto eliminato con successo');
          this.router.navigate(['/home']);
        },
        error: (err) => console.error('Errore durante l\'eliminazione del prodotto:', err)
      });
    }
  }

}
