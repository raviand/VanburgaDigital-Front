import { Injectable } from '@angular/core';
import { Product, Extra, State } from './menu.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_URI , DATE_FORMAT} from '../app.constant';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  
  constructor(private httpClient : HttpClient,
    private datePipe:DatePipe) { }

  createOrder(orderRequest : OrderRequest){
    let headers = new HttpHeaders({
      "Content-Type" : "application/json"
    })  
    return this.httpClient.post(`${API_URI}order`, orderRequest, {headers})
  }

  searchOrderList(status : string, dateFrom : Date , dateTo : Date, clientId : string){
    let from = this.datePipe.transform(dateFrom, DATE_FORMAT)
    let to = this.datePipe.transform(dateTo, DATE_FORMAT)

    let params = new HttpParams( );
    params.append("status", status)
    params.append("dateFrom", from)
    params.append("dateTo", to)
    params.append("clientId", clientId)
    return this.httpClient.get(`${API_URI}order/search`)
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
  orderDetail?: Product[];
}

export interface OrderRequest {
  client?:   Client;
  comment?:  string;
  products?: Product[];
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

