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

  constructor(private http: HttpClient) {
    this.getAll().subscribe(data => {
      this.productsCache = data;
      this.productsSubject.next(data);
    });
  }

  getAll(): Observable<iProduct[]> {
    if (this.productsCache.length > 0) {
      return of(this.productsCache);
    } else {
      return this.http.get<iProduct[]>(this.productsUrl).pipe(
        tap(data => this.productsCache = data)
      );
    }
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


  getUniqueCategories(): Observable<string[]> {
    return this.getAll().pipe(
      map(products => [...new Set(products.map(product => product.category))])
    );
  }

}
