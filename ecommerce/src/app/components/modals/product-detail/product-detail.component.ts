import { Component, EventEmitter, Input, Output, ElementRef, HostListener } from '@angular/core';
import { iProduct } from '../../../Models/iproduct';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  @Input() product: iProduct = {} as iProduct;
  @Output() close = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  openModal(): void {
    document.addEventListener('click', this.closeModalOutside);
  }

  onClose(): void {
    this.closeModal();
  }

  closeModal(): void {
    document.removeEventListener('click', this.closeModalOutside);
    this.close.emit();
  }

  closeModalOutside(event: any): void {
    const modal = this.elementRef.nativeElement.querySelector('.modal-content');
    if (modal && !modal.contains(event.target)) {
      this.closeModal();
    }
  }
}
