import { HttpClient } from '@angular/common/http';
import { iProduct } from './Models/iproduct';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productsUrl = environment.productsUrl;
  private productsCache: iProduct[] = [];
  private productsSubject = new BehaviorSubject<iProduct[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getAll().subscribe(data => {
      this.productsCache = data;
      this.productsSubject.next(data);
    });
  }

  getAll(): Observable<iProduct[]> {
    return this.http.get<iProduct[]>(this.productsUrl)
  }

  getWishlist(wishlistedIds: number[]): Observable<iProduct[]> {
    return of(this.productsCache.filter(product => wishlistedIds.includes(product.id)));
  }

  getCart(addedToCartIds: number[]): Observable<iProduct[]> {
    return of(this.productsCache.filter(product => addedToCartIds.includes(product.id)));
  }

  getProductsByCategory(category: string): Observable<iProduct[]> {
    return this.getAll().pipe(
      map(products => products.filter(product => product.category.includes(category)))
    );
  }

  getProductById(id: number): Observable<iProduct> {
    const url = `${this.productsUrl}/${id}`;
    return this.http.get<iProduct>(url);
  }

  orderedByPrice(order: string): Observable<iProduct[]> {
    return this.getAll().pipe(
      map(products =>
        products.sort((a, b) => {
          if (order === 'incr') {
            return a.price - b.price;
          } else if (order === 'decr') {
            return b.price - a.price;
          } else {
            return 0;
          }
        })
      )
    );
  }



  updateProduct(product: iProduct): Observable<any> {
    const url = `${this.productsUrl}/${product.id}`;
    return this.http.put(url, product).pipe(
      tap(() => {
        const index = this.productsCache.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.productsCache[index] = product;
          this.productsSubject.next(this.productsCache);
        }
      })
    );
  }

  deleteProduct(productId: number): Observable<any> {
    const url = `${this.productsUrl}/${productId}`;
    return this.http.delete(url).pipe(
      tap(() => this.removeProductFromList(productId))
    );
  }

  removeProductFromList(productId: number): void {
    const currentProducts = this.productsSubject.value;
    const updatedProducts = currentProducts.filter(product => product.id !== productId);
    this.productsSubject.next(updatedProducts);
  }

  addProduct(product: iProduct): Observable<iProduct> {
    return this.http.post<iProduct>(this.productsUrl, product)
    .pipe(tap(()=>{
    this.getAll().subscribe(dato=>this.productsSubject.next(dato))
    }));
  }



  getUniqueCategories(): Observable<string[]> {
    return this.getAll().pipe(
      map(products => [...new Set(products.map(product => product.category))])
    );
  }

}
