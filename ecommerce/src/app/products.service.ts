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

  getProductsByCategory(category: string): Observable<iProduct[]> {
    return this.getAll().pipe(
      map(products => products.filter(product => product.category.includes(category)))
    );
  }

  getUniqueCategories(): Observable<string[]> {
    return this.getAll().pipe(
      map(products => [...new Set(products.map(product => product.category))])
    );
  }

}
