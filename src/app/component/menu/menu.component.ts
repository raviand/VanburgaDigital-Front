import { Component, OnInit, Input } from '@angular/core';
import { MenuService, Category, Extra, Product } from 'src/app/service/menu.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogExtraComponent } from '../dialog-extra/dialog-extra.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-menu',
  
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  categories : Category[];
  productsData : Product[];
  cartProduct : Product;
  cart : Product[] = [];
  extrasSelected : Extra[];
  extraIndexSelected : number;
  cartTotalAmount = 0.0;

  selectedProduct : boolean;
  opened = true;
  constructor(private menuService : MenuService, private router : Router,
    private dialog : MatDialog, private snackBar:MatSnackBar, private orderService : OrderService) { }
/**
 * Metodo que se dispara antes de mostrar la pagina
 */
  ngOnInit(): void {

    if(this.orderService.loadClientCart() != null){
      this.cart = this.orderService.loadClientCart();
      this.getTotalAmount()
    }

    this.menuService.getAllCategories().subscribe(
      (data:any) => {
        console.log(data.categories)
        this.categories = data.categories
      }
    )
  }

  /**
   * Extiende un listado de extras del producto seleccionado
   * 
   * @param i Index del producto al que se le selecciona el boton extra
   */
  lookExtras(i:number){
    if(this.extraIndexSelected == i){
      this.selectedProduct = !this.selectedProduct;
    }else{
      this.cartProduct.extras = []
      this.selectedProduct = true;
    }
    this.extraIndexSelected = i;
  }

  /**
   * selecciona un extra y lo agrega al producto del carro
   * @param product 
   * @param idExtra 
   */
  selectExtra(product:Product,idExtra:number){ 
    product.extras.forEach(ex => {
      if(ex.id == idExtra){
        ex.selected = !ex.selected
        if(ex.selected){
          this.cartProduct.extras.push(ex)
        }else{
          let index = this.cartProduct.extras.indexOf(ex,0)
          this.cartProduct.extras.splice(index, 1)
        }
      }
    });
  }

  /**
   * Agrega el producto con sus extras seleccionados al carrito
   * @param product 
   */
  addToCart(product:Product){
    let extras = []
    let productTotal = 0

    productTotal = product.price;
    //Busco los extras que tengo que eliminar
    product.extras?.forEach( e => {
          if(!e.selected){
            extras.push(e)
          }
        }
      )
    //hago una copia no relacionada con el objeto original
    let cartProduct = JSON.parse(JSON.stringify(product))
    //let cartProduct = product
    if(extras.length > 0){
      extras.forEach(extras => {
        let i = cartProduct.extras.indexOf(extras, 0)
        cartProduct.extras.splice(i, 1)
      })
    }
    
    console.log(product)
    this.cart.push(cartProduct)
    console.log(this.cart)
    this.getTotalAmount()
    this.snackBar.open('Agregaste un ' + product.name + ' al pedido!', 'Cerrar', {duration : 2000})
  }

  /**
   * Elimina el 
   * @param extra 
   * @param product 
   */
  removeExtra(extra : Extra, product : Product){
    let indexProduct = this.cart.indexOf(product)
    let i = this.cart[indexProduct].extras.indexOf(extra, 0)
    this.cart[indexProduct].extras.splice(i,1)
    this.cartTotalAmount -= extra.price;
  }

  /**
   * Elimina el producto del canasto
   * @param product 
   */
  removeProduct(product : Product){
    //Descuento todos los extras del total
    product.extras?.forEach(e => this.cartTotalAmount -= e.price)
    //descuento el precio del producto
    this.cartTotalAmount -= product.price
    let indexProduct = this.cart.indexOf(product)
    this.cart.splice(indexProduct,1)
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(DialogExtraComponent, {
      width: '450px',
      data: this.cart
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed [' + result + "]");
      this.cart = result;
      console.log(this.cart)
    });
  }

  /**
   * Busca en el servicio los productos que pertenecen a la categoria
   * @param id id de la categoria
   */
  categorySelected(id){
    this.cartProduct = new Product();
    this.menuService.getProductByCategory(id).subscribe(
      (data:any) => {
        console.log(data)
        this.productsData = data.products
      }
    )
  }

  confirm(){
    if(this.cart.length > 0){

      this.orderService.saveClientCart(this.cart);
      this.router.navigate(['/order'])

    }
  }

  getTotalAmount(){
    this.cart.forEach(
      prod => {
        this.cartTotalAmount += prod.price
        prod.extras?.forEach( ex => this.cartTotalAmount += ex.price )
      }
    )
  }
}
