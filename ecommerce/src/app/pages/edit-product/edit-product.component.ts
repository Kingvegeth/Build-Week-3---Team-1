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
    private productsService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.productsService.getProductById(id).subscribe(product => this.product = product);
  }

  saveProduct(): void {
    if (this.product) {
      this.productsService.updateProduct(this.product).subscribe(() => {
        this.router.navigate(['/home']);
      });
    }
  }

}
