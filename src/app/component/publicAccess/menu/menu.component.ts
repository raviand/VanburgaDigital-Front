import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  MenuService,
  Category,
  Extra,
  Product,
} from 'src/app/service/menu.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from 'src/app/service/order.service';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-menu',

  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  categories = [
    { description: 'Las mejores del condado', id: 1, name: 'Burgers' },
    {
      description: 'Tomate una fresca',
      id: 2,
      name: 'Bebidas',
    },
    {
      description: 'No podes pedir la hamburguesa sin unas buenas papas',
      id: 3,
      name: 'Acompañamientos',
    },
  ];
  productsData: Product[];
  cartProduct: Product;
  cart: Product[] = [];
  extrasSelected: Extra[];
  extraIndexSelected: number;
  cartTotalAmount = 0.0;
  categoryName: string;
  selectedProduct: boolean;
  opened = true;

  constructor(
    private menuService: MenuService,
    private router: Router,
    private snackBar: MatSnackBar,
    private orderService: OrderService
  ) {}
  /**
   * Metodo que se dispara antes de mostrar la pagina
   */
  ngOnInit(): void {
    if (this.orderService.loadClientCart() != null) {
      this.cart = this.orderService.loadClientCart();
      this.getTotalAmount();
    }

    this.menuService.getAllCategories().subscribe((data: any) => {
      console.log(data.categories);
      this.categories = data.categories;
    });
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
    let productTotal = 0;

    productTotal = product.price;
    //Busco los extras que tengo que eliminar
    product.extras?.forEach((e) => {
      if (!e.selected) {
        extras.push(e);
      }
    });
    //hago una copia no relacionada con el objeto original
    let cartProduct = JSON.parse(JSON.stringify(product));
    //let cartProduct = product
    if (extras.length > 0) {
      extras.forEach((extras) => {
        let i = cartProduct.extras.indexOf(extras, 0);
        cartProduct.extras.splice(i, 1);
      });
    }
    if (this.cartProduct.extras?.length > 0) {
      cartProduct.extras = JSON.parse(JSON.stringify(this.cartProduct.extras));
    }
    this.lookExtras(index);
    console.log(product);
    this.cart.push(cartProduct);
    this.cartProduct.extras = [];
    console.log(this.cart);
    this.getTotalAmount();
    this.snackBar.open(
      'Agregaste un ' + product.name + ' al pedido!',
      'Cerrar',
      { duration: 2000 }
    );
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
    this.productsData = [
      {
        id: 2,
        name: 'Cuarto Vanburga',
        category: {
          id: 1,
          name: 'Burgers',
          description: 'Las mejores del condado',
        },
        price: 400.0,
        description:
          'Doble carne, Doble cheddar, Cebolla cortada, Ketchup Heinz, Mostaza Heinz',
        extras: [
          {
            id: 1,
            name: 'Extra Cheddar',
            price: 50.0,
          },
          {
            id: 2,
            name: 'Extra Bacon',
            price: 50.0,
          },
          {
            id: 3,
            name: 'Extra Medallón',
            price: 50.0,
          },
          {
            id: 4,
            name: 'Extra papas con Cheddar y Bacon',
            price: 50.0,
          },
        ],
      },
    ];
  }

  confirm() {
    if (this.cart.length > 0) {
      this.orderService.saveClientCart(this.cart);
      this.router.navigate(['/order']);
    }
  }

  getTotalAmount() {
    this.cartTotalAmount = 0;
    this.cart.forEach((prod) => {
      this.cartTotalAmount += prod.price;
      prod.extras?.forEach((ex) => (this.cartTotalAmount += ex.price));
    });
  }
}
