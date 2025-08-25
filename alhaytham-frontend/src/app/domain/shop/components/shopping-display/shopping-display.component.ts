import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Observable } from 'rxjs';
import { Product } from '../../../../models/products';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-shopping-display',
  imports: [AsyncPipe,CurrencyPipe,CommonModule],
  templateUrl: './shopping-display.component.html',
})
export class ShoppingDisplay implements OnInit {
  procuctList = [1,2,3,4,5,6]

  fullImageDisplay:string="";

  isSideView:boolean = false;

  constructor(private productService:ProductService,private sanitizer: DomSanitizer){

  }

  products$!:Observable<Product[]>;
  
  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
    
  }

  getUrlChecked(url:string){
    return  this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  fullImage(url:string){
    this.fullImageDisplay = url;
  }

  fullImageClose(){
    this.fullImageDisplay = '';
  }

  openCloseSideView(){
      this.isSideView = !this.isSideView
  }

  buyItem(event : Event){
      event.stopPropagation();
  }

  addToCart(event : Event){
      event.stopPropagation();
  }

}
