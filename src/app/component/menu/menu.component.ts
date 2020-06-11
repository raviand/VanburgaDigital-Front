import { Component, OnInit } from '@angular/core';
import { MenuService, Category } from 'src/app/service/menu.service';
import { ProductData } from 'src/app/service/order.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  categories : Category[];
  productsData : ProductData[];
  productData : ProductData

  selectedProduct : boolean;
  events: string[] = [];
  opened = true;
  constructor(private menuService : MenuService) { }

  ngOnInit(): void {
    this.menuService.getAllCategories().subscribe(
      (data:any) => {
        console.log(data.categories)
        this.categories = data.categories
      }
    )
  }

  categorySelected(id){
    this.productData = null;
    this.menuService.getProductByCategory(id).subscribe(
      (data:any) => {
        console.log(data)
        this.productsData = data.products
      }
    )
  }

  productSelected(id){
    this.menuService.getProduct(id).subscribe(
      (data:any) => {
        console.log(data)
        this.productData = data.product
        this.selectedProduct = true;
      }
    )
  }

}
