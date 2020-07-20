import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  MenuService,
  Category,
  Extra,
  Product,
} from 'src/app/service/menu.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService, BusinessSchedule } from 'src/app/service/order.service';
import { MatAccordion } from '@angular/material/expansion';
import { Time } from '@angular/common';

@Component({
  selector: 'app-menu',

  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  categories : Category [];
  productsData: Product[];
  cartProduct: Product;
  cart: Product[] = [];
  extrasSelected: Extra[];
  extraIndexSelected: number;
  cartTotalAmount = 0.0;
  categoryName: string;
  selectedProduct: boolean;
  opened = true;
  loaded = false;
  notSelected = 'secondary'
  selected = 'success'
  canSelected = false;
  btnSelected;
  isOpen = false;
  businessSchedules : BusinessSchedule[];
  buttons = [
    { name: 'Simple',     buttonColor:'silver', id:1, extra: 0, selected: false, item: null }, 
    { name: 'Doble',      buttonColor:'silver', id:2, extra: 1, selected: false, item: null }, 
    { name: 'Triple',     buttonColor:'silver', id:3, extra: 2, selected: false, item: null }, 
    { name: 'Cuadruple',  buttonColor:'silver', id:4, extra: 3, selected: false, item: null }, 
  ]
  weekday = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];

  constructor(private menuService : MenuService, private router : Router,
    private snackBar:MatSnackBar, private orderService : OrderService) {}

/**
 * Metodo que se dispara antes de mostrar la pagina
 */
  async ngOnInit(): Promise<void>{

    this.orderService.getBusinessSchedule().subscribe( (res:BusinessSchedule[]) => {
      this.businessSchedules = res
      let now = new Date();
      let intDay = now.getDay()
      let hour = now.getHours()
      if(hour < 6) intDay = (now.getDay() - 1 == -1) ? 6 :  now.getDay() - 1;
      let day = this.weekday[intDay];

      //Tomo como parametro las 12 del mediodia. Si es menor a las doce es porque es un dia anterior
      hour = hour < 6 ? hour+24 : hour

      res.forEach(bs =>{
        
        if(day == bs.day){
          let from = parseInt(bs.openTime.substring(0,2), 10) ;
          let to =parseInt(bs.closeTime.substring(0,2), 10);
          to = to < 6 ? to + 24 : to

          
          if(hour > from && hour < to){
            this.isOpen = bs.available;
          }

        }
      })
    },
    err => {
      this.loaded = true;
      this.router.navigate(['/error']);
    } )



    if(this.orderService.loadClientCart() != null){
      this.cart = this.orderService.loadClientCart();
      console.log(this.cart);
      
      this.getTotalAmount();
      console.log(this.cartTotalAmount);
      
    }

    await this.menuService.getAllCategories().subscribe(
      (data:any) => {
        console.log(data.categories)
        this.categories = data.categories
        if(this.categories[0] != null){
          this.categorySelected(this.categories[0]);
          this.categorySelected(this.categories[0]);
        }
      },
      err =>{
        this.loaded = true;
        this.router.navigate(['/error']);
      }
    )
  }

  isBurger(prod : Product){
    if(prod.rawMaterial > 0){
      return true;
    }
    return false;
  }

  totalProduct(pd : Product){
    let productTotal = 0
    let cheeseSelected : Extra;
    let hamb = 0;
    let cheese :boolean = false;
    console.log(pd);
    
    this.buttons.forEach(b=>{
      if(b.selected){
        hamb += b.extra 
      }
    })

    pd.extras?.forEach( e => {
      if(e.id != 1 && e.id != 20){   
        if(e.rawMaterial > 0){
          productTotal += (e.price * (e.quantity + hamb) )
          hamb += e.quantity;
        }else{
          productTotal += (e.price * e.quantity)
        }
      } 
    })

    hamb += pd.rawMaterial;

    pd.extras?.forEach( extra => {
      if( extra.id == 1 ||  extra.id == 20 ){
        console.log(extra);
        
        productTotal += extra.price * hamb * extra.quantity
      }
    } )
    

    if(pd.rawMaterial == 0){
      this.canSelected = true;
      productTotal += pd.price;
    }else{
      productTotal += pd.price;
    }

    return productTotal
  }

  /**
   * Extiende un listado de extras del producto seleccionado
   *
   * @param i Index del producto al que se le selecciona el boton extra
   */
  lookExtras(i: number) {
    if (this.extraIndexSelected == i) {
      this.selectedProduct = !this.selectedProduct;
    } else {
      this.cartProduct.extras = [];
      this.selectedProduct = true;
    }
    this.extraIndexSelected = i;
  }

  closeModal(product:Product, index : number){
    product.extras.forEach(e => e.quantity = 0)
    this.buttons.forEach(b => b.selected=false)
    this.canSelected = false;
  }

  /**
   * selecciona un extra y lo agrega al producto del carro
   * @param product
   * @param idExtra
   */
  selectExtra(product: Product, idExtra: number) {
    console.log('idExtra : ' + idExtra);
    product = JSON.parse(JSON.stringify(product));
    product.extras.forEach((ex) => {
      if (ex.id === idExtra) {
        console.log(ex);
        ex.selected = !ex.selected;
        if (ex.selected) {
          console.log('true');
          console.log(ex);
          this.cartProduct.extras.push(ex);
        } else {
          console.log('false');
          console.log(ex);
          let index = this.cartProduct.extras.indexOf(ex, 0);
          this.cartProduct.extras.splice(index, 1);
          console.log(this.cartProduct.extras);
        }
      }
    });
  }

  resetSelectedExtras(prod: Product) {
    prod.extras?.forEach((ex) => (ex.selected = false));
  }

  /**
   * Agrega el producto con sus extras seleccionados al carrito
   * @param product
   */
  addToCart(product: Product, index: number) {
    let extras = [];

    //hago una copia no relacionada con el objeto original
    let cartProduct : Product = JSON.parse(JSON.stringify(product))

    this.buttons.forEach(b => {
      if(b.selected) {
        cartProduct.button = b;
      }
    })

    //Extraigo los que tienen una cantidad mayo a cero
    cartProduct.extras?.forEach(e =>{
      if(e.quantity != 0 && e.rawMaterial == 0){
        extras.push(e)
      }
      if(e.rawMaterial > 0 ){
        this.buttons.forEach(b=>{
          if(b.selected){
            cartProduct.rawMaterial += (e.quantity + b.extra)
            cartProduct.button.item = e;
            cartProduct.price += e.price * b.extra
            extras.push(e)
          }
        })
      }
    })
    //Elimino todos los extras para agregar la lista de los seleccionados
    cartProduct.extras = null;
    cartProduct.extras = extras;
    

    this.buttons.forEach(b => b.selected = false)

    this.canSelected = false;
    this.lookExtras(index)
    this.cart.push(cartProduct)
    this.cartProduct.extras = []
    this.getTotalAmount()
    this.snackBar.open('Agregaste un ' + product.name + ' al pedido!', 'Cerrar', {duration : 2000})
  }

  /**
   * Elimina el
   * @param extra
   * @param product
   */
  removeExtra(extra: Extra, product: Product) {
    let indexProduct = this.cart.indexOf(product);
    let i = this.cart[indexProduct].extras.indexOf(extra, 0);
    this.cart[indexProduct].extras.splice(i, 1);
    this.getTotalAmount();
    this.orderService.saveClientCart(this.cart);
  }

  /**
   * Elimina el producto del canasto
   * @param product
   */
  removeProduct(product: Product) {
    //Descuento todos los extras del total
    product.extras?.forEach((e) => (this.cartTotalAmount -= e.price));
    //descuento el precio del producto
    let indexProduct = this.cart.indexOf(product);
    this.cart.splice(indexProduct, 1);
    this.getTotalAmount();
    this.orderService.saveClientCart(this.cart);
  }

  /**
   * Busca en el servicio los productos que pertenecen a la categoria
   * @param id id de la categoria
   */
  categorySelected(category: Category) {
    this.categoryName = category.name;
    this.cartProduct = new Product();
    this.menuService.getProductByCategory(category.id).subscribe(
      (data:any) => {
        console.log(data)
        this.productsData = data.products
        this.productsData.forEach(element => {
          element.extras?.forEach( e => e.quantity = 0 )
        });
        this.loaded = true;
      },
      err=>{
        this.loaded = true;
        this.router.navigate(['/error']);
      }
    )
  }

  confirm(){
    if(this.cart.length > 0){
      this.orderService.saveClientCart(this.cart);
      this.router.navigate(['/order']);
    }
  }

  getTotalAmount(){
    this.cartTotalAmount = 0
    this.cart.forEach(
      prod => {
        console.log(prod);
        
        this.cartTotalAmount += prod.price
        prod.extras?.forEach( ex =>{
          if(ex.id != 1 && ex.id != 20){
            this.cartTotalAmount += (ex.price * ex.quantity)
          } else {
            this.cartTotalAmount += ex.price * prod.rawMaterial
          }
        } )
      }
    )
  }

  openCart(){
    console.log(this.cartTotalAmount);
    
    this.opened = !this.opened;
    this.getTotalAmount()
    console.log(this.cartTotalAmount);
  }

  
  hamburgerTypeSelected(id : number){
    this.buttons.forEach(  b => {
      if(b.id == id){
        b.selected = true;
        this.btnSelected = b;
      }else{
        b.selected = false;
      }
    })
    this.canSelected = true;
  }

  
}
