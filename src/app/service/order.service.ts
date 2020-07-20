import { Injectable } from '@angular/core';
import { Product, Extra, State } from './menu.service';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpUrlEncodingCodec,
} from '@angular/common/http';
import { API_URI, DATE_FORMAT, CLIENT_CART, USER } from '../app.constant';
import { DatePipe } from '@angular/common';
import { Socialusers } from './login.service';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpClient: HttpClient) {}

  parameterEncoding: ParameterEncoder;
  clientCart: Product[];
  datePipe: DatePipe = new DatePipe('en-ES');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  createOrder(orderRequest: OrderRequest) {
    console.log(orderRequest);

    return this.httpClient.post(`${API_URI}order`, orderRequest, {
      headers: this.headers,
    });
  }

  searchOrderList(
    status: string,
    dateFrom: Date,
    dateTo: Date,
    clientId: string
  ) {
    let from = this.datePipe.transform(dateFrom, DATE_FORMAT);
    let url = `${API_URI}order/search?dateFrom=${from}`;
    if (dateTo != null) {
      let to = this.datePipe.transform(dateTo, DATE_FORMAT);
      url += `&dateTo=${to}`;
    }
    if (status != null) {
      url += `&status=${status}`;
    }
    if (clientId != null) {
      url += `&clientId=${clientId}`;
    }

    return this.httpClient.get(url, { headers: this.headers });
  }

  getStates() {
    return this.httpClient.get(`${API_URI}state`);
  }

  getExtras() {
    return this.httpClient.get(`${API_URI}extra`);
  }

  updateStatus(orderId: number, status: string, time: string) {
    let request = new OrderRequest();
    request.status = status;
    request.orderId = orderId;
    if (time != null) request.deliverTime = time;
    return this.httpClient.put(`${API_URI}order`, request, {
      headers: this.headers,
    });
  }

  saveClientCart(cart: Product[]) {
    localStorage.setItem(CLIENT_CART, JSON.stringify(cart));
  }

  loadClientCart(): Product[] {
    if (localStorage.getItem(CLIENT_CART) != null) {
      return JSON.parse(localStorage.getItem(CLIENT_CART));
    }
  }

  getOrderDetail(orderId: number) {
    return this.httpClient.get(`${API_URI}order?orderId=${orderId}`, {
      headers: this.headers,
    });
  }

  getKitchenStatus() {
    return this.httpClient.get(`${API_URI}kitchen`, { headers: this.headers });
  }

  getBusinessSchedule() {
    return this.httpClient.get(`${API_URI}BusinessSchedule`, { headers: this.headers });
  }


  cancelOrder(orderId: number, status: string) {
    let request = new OrderRequest();
    request.status = status;
    request.orderId = orderId;
    const options = {
      headers: this.headers,
      body: request,
    };
    return this.httpClient.delete(`${API_URI}order`, options);
  }

  cartClientMessageUrl(order: Order, enviado: boolean) {
    this.parameterEncoding = new ParameterEncoder();
    let msg = `Hola Soy ${order.client.name}! ${
      enviado
        ? `Realice un pedido desde vanburga.com con id N°${order.id}:\n`
        : 'No pude realizar el pedido por la pagina, les envío lo que quería pedir:\n'
    }`;
    order.products.forEach((p) => {
      if (p.category.id == 1) {
        msg += '🍔';
      } else {
        msg += '🍺🍟';
      }
      msg += ` ${p.name}\n`;
      p.extras?.forEach((e) => {
        msg += `\t*${e.name}* X${e.quantity}\n`;
      });
    });
    if (order.delivery) {
      msg += '🚗 Nos solicitaste el envio a la siguiente direccion:\n';
      msg += `calle: ${order.client.address.street} ${order.client.address.doorNumber} \n`;
      msg += `entre calles: ${order.client.address.reference} en ${order.client.address.state.state}\n`;
      if (order.client.address.floor != null)
        msg += `Piso: ${order.client.address.floor}\n`;
      if (order.client.address.door != null)
        msg += `Depto: ${order.client.address.door}\n`;
    }
    if (order.comments != null)
      msg += `📝Comentarios adicionales: ${order.comments}\n`;
    msg += 'Saludos!';

    return this.parameterEncoding.encodeValue(msg);
  }
}

export class ParameterEncoder extends HttpUrlEncodingCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }
  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }
  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }
  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

//////////////////////////////////////////////////////////////
//    OBJETOS DE METODOS A LA API
//////////////////////////////////////////////////////////////
export interface KitchenStatus {
  chips: number;
  grilledHamburger: number;
  simpleCheddar: number;
  doubleCheddar: number;
  tripleCheddar: number;
  simpleEmmenthal: number;
  doubleEmmenthal: number;
  tripleEmmenthal: number;
  noCheese: number;
  orderCount: number;
  productCount: number;
  orders?: Order[];
}

export interface OrderList {
  message?: string;
  code?: number;
  status?: number;
  orders?: Order[];
}

export interface OrderResponse {
  message?: string;
  code?: number;
  status?: number;
  address?: Address;
  order?: Order;
  products?: Product[];
  orders?: Order[];
}

export class OrderRequest {
  client?: Client;
  comment?: string;
  products?: Product[];
  delivery?: boolean;
  orderId?: number;
  status?: string;
  paymentType?: string;
  deliverTime?: string;
}

//////////////////////////////////////////////////////////////
//    OBJETOS INTERNOS
//////////////////////////////////////////////////////////////

export class BusinessSchedule{
  id :number;
  day : string;
  openTime : string;
  closeTime : string;
  available : boolean;
}

export class Order {
  id?: number;
  client?: Client;
  comments?: string;
  status?: string;
  createDate?: Date;
  amount?: number;
  products?: Product[];
  selected?: boolean;
  delivery?: boolean;
  totalRawMaterial?: number;
  confirmed?: boolean;
  paymentType?: string;
  deliverTime?: string;
  whatsappLink?: string;
}

export class Client {
  name?: string;
  cellphone?: string;
  lastName?: string;
  mail?: string;
  address?: Address;
}

export class Address {
  street?: string;
  doorNumber?: string;
  zipCode?: string;
  state?: State;
  floor?: string;
  door?: string;
  reference?: string;
}

//////////////////////////////////////////////////////////////
//    CONVERSORES
//////////////////////////////////////////////////////////////

// Converts JSON strings to/from your types
export class ConvertOrderList {
  public static toOrderList(json: string): OrderList {
    return JSON.parse(json);
  }

  public static orderListToJson(value: OrderList): string {
    return JSON.stringify(value);
  }
}

// Converts JSON strings to/from your types
export class ConvertOrderResponse {
  public static toOrderRequest(json: string): OrderResponse {
    return JSON.parse(json);
  }

  public static orderResponseToJson(value: OrderResponse): string {
    return JSON.stringify(value);
  }
}

// Converts JSON strings to/from your types
export class ConvertOrderRequest {
  public static toOrderRequest(json: string): OrderRequest {
    return JSON.parse(json);
  }

  public static orderRequestToJson(value: OrderRequest): string {
    return JSON.stringify(value);
  }
}
