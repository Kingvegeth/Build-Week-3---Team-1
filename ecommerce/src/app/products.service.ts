import { HttpClient } from '@angular/common/http';
import { iProduct } from './Models/iproduct';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  productsUrl = environment.productsUrl;
  productsArray: iProduct[]=[]

  productsSubject = new BehaviorSubject<iProduct[]>([]);

  constructor(private http:HttpClient) {

    this.getAll().subscribe(data => {
      this.productsSubject.next(data)
      this.productsArray = data;
    })
  }
  getAll(){
    return this.http.get<iProduct[]>(this.productsUrl)
  }

  getWishlist(wishlistedIds: number[]): Observable<iProduct[]> {
    const wishListed = this.productsArray.filter(product => wishlistedIds.includes(product.id));
    return of(wishListed);
  }

 getProductsByCategory(category: string): Observable<iProduct[]> {
  return this.getAll().pipe(
    map(products => products.filter(product => product.category.includes(category)))
  );
}

}
