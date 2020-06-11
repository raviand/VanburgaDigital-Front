import { Injectable } from '@angular/core';
import { Product, Extra, State } from './menu.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URI } from '../app.constant';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  
  constructor(private httpClient : HttpClient) { }

  createOrder(orderRequest : OrderRequest){
    let headers = new HttpHeaders({
      "Content-Type" : "application/json"
    })  
    return this.httpClient.post(`${API_URI}order`, orderRequest, {headers})
  }

}

//////////////////////////////////////////////////////////////
//    OBJETOS DE METODOS A LA API
//////////////////////////////////////////////////////////////
export interface OrderList {
  message?: string;
  code?:    number;
  status?:  number;
  orders?:  Order[];
}

export interface OrderResponse {
  message?:     string;
  code?:        number;
  status?:      number;
  address?:     Address;
  order?:       Order;
  orderDetail?: ProductData[];
}

export interface OrderRequest {
  client?:   Client;
  comment?:  string;
  products?: ProductData[];
}

//////////////////////////////////////////////////////////////
//    OBJETOS INTERNOS
//////////////////////////////////////////////////////////////

export interface Order {
  id?:         number;
  client?:     Client;
  comments?:   string;
  status?:     string;
  createDate?: Date;
  amount?:     number;
}

export interface Client {
  name?:      string;
  cellphone?: string;
  lastName?:  string;
  mail?:      string;
  address?:   Address;
}

export interface Address {
  street?:     string;
  doorNumber?: string;
  zipCode?:    string;
  state?:      State;
  floor?:     string;
  door?:      string;
}

export interface ProductData {
  product?: Product;
  extras?:  Extra[];
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

