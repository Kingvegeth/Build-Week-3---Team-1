import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  constructor() { }

  coupon = [
    {code:"GiancarloMagalli", discount:0.9},
    {code:"Sconto20", discount:0.2}
  ]

  Coupon(code:string,total:number):number{
    const coupon = this.coupon.find (c => c.code === code);
    if (coupon){
      return total - (total * coupon.discount)
    }else{
      throw new Error ("Il coupon inserito non è valido o scaduto o semplicemente non è Magalli");

    }
  }
}
