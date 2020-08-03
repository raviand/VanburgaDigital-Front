import { Component, OnInit} from '@angular/core';
import {
  MenuService,
  Category,
  Extra,
  Product,
} from 'src/app/service/menu.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService, BusinessSchedule } from 'src/app/service/order.service';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-menu',

  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  faShoppingCart = faShoppingCart;
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
  weekday = [
    {0:"Domingo"},
    {1:"Lunes"},
    {2:"Martes"},
    {3:"Miercoles"},
    {4:"Jueves"},
    {5:"Viernes"},
    {6:"Sabado"}
  ];

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
      let minutes = now.getMinutes()
      if(hour < 6) intDay = (now.getDay() - 1 == -1) ? 6 :  now.getDay() - 1;
      let day;
      this.weekday.forEach( d => {
        
        if(d[intDay] != null){
          day = d[intDay]
          
        }
      } )

      //Tomo como parametro las 12 del mediodia. Si es menor a las doce es porque es un dia anterior
      hour = hour < 6 ? hour+24 : hour

      res.forEach(bs =>{
        
        if(day == bs.day){
          let fromTime = bs.openTime.split(":", 2);
          let toTime = bs.closeTime.split(":", 2);
          let hourFrom = parseInt(fromTime[0]) ;
          let hourTo = parseInt(toTime[0]);
          let minFrom = parseInt(fromTime[1]) ;
          let minTo = parseInt(toTime[1]);
          hourTo = hourTo < 6 ? hourTo + 24 : hourTo

          
          
          if(hour >= hourFrom && hour <= hourTo){

            if(hour == hourFrom){
              if(minutes >= minFrom){
                this.isOpen = bs.available;
              }
            }else if(hour == hourTo){
              if(minutes <= minTo){
                this.isOpen = bs.available;
              }
            }else{
              this.isOpen = bs.available;
            }

            
          }

        }
      })
      this.isOpen = true
    },
    err => {
      this.loaded = true;
      this.router.navigate(['/error']);
    } )



    if(this.orderService.loadClientCart() != null){
      this.cart = this.orderService.loadClientCart();
      
      this.getTotalAmount();
      
    }

    await this.menuService.getAllCategories().subscribe(
      (data:any) => {
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
    product = JSON.parse(JSON.stringify(product));
    product.extras.forEach((ex) => {
      if (ex.id === idExtra) {
        ex.selected = !ex.selected;
        if (ex.selected) {
          this.cartProduct.extras.push(ex);
        } else {
          let index = this.cartProduct.extras.indexOf(ex, 0);
          this.cartProduct.extras.splice(index, 1);
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
    
    this.opened = !this.opened;
    this.getTotalAmount()
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
