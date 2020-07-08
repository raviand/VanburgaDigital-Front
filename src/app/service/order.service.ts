import { Injectable } from '@angular/core';
import { Product, Extra, State } from './menu.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_URI , DATE_FORMAT, CLIENT_CART, USER} from '../app.constant';
import { DatePipe } from '@angular/common';
import { Socialusers } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private httpClient: HttpClient) {}

  clientCart : Product[];
  datePipe: DatePipe = new DatePipe("en-ES");
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  createOrder(orderRequest : OrderRequest){
    console.log(orderRequest);
    
    return this.httpClient.post(`${API_URI}order`, orderRequest, { headers: this.headers });
  }

  searchOrderList(status : string, dateFrom : Date , dateTo : Date, clientId : string){
    let from = this.datePipe.transform(dateFrom, DATE_FORMAT)
    let to = this.datePipe.transform(dateTo, DATE_FORMAT)

    let params = new HttpParams( );
    params.append("status", status)
    params.append("dateFrom", from)
    params.append("dateTo", to)
    params.append("clientId", clientId)
   
    return this.httpClient.get(`${API_URI}order/search?dateFrom=${from}`, { headers: this.headers })
  }

  getStates(){
    return this.httpClient.get(`${API_URI}state`)
  }

  updateStatus(orderId:number, status : string){
    let request = new OrderRequest();
    request.status = status;
    request.orderId = orderId;
    return this.httpClient.put(`${API_URI}order`,request, { headers: this.headers })
  }

  saveClientCart(cart : Product[]){
    localStorage.setItem(CLIENT_CART, JSON.stringify(cart))
  }
  
  loadClientCart() : Product[]{
    if(localStorage.getItem(CLIENT_CART) != null){
      return JSON.parse(localStorage.getItem(CLIENT_CART))
    }
  }

  getOrderDetail(orderId : number){
    return this.httpClient.get(`${API_URI}order?orderId=${orderId}`, { headers: this.headers })
  }

  cancelOrder(orderId:number, status : string){
    let request = new OrderRequest();
    request.status = status;
    request.orderId = orderId;
    const options = {
      headers: this.headers,
      body: request,
    };
    return this.httpClient.delete(`${API_URI}order`, options)
  }

}

//////////////////////////////////////////////////////////////
//    OBJETOS DE METODOS A LA API
//////////////////////////////////////////////////////////////
export interface OrderList {
  message?: string;
  code?: number;
  status?: number;
  orders?: Order[];
}

export interface OrderResponse {
  message?:     string;
  code?:        number;
  status?:      number;
  address?:     Address;
  order?:       Order;
  products?:     Product[];
  orders?:       Order[];
}

export class OrderRequest {
  client?:   Client;
  comment?:  string;
  products?: Product[];
  delivery?: boolean;
  orderId?:   number;
  status?:    string;
}

//////////////////////////////////////////////////////////////
//    OBJETOS INTERNOS
//////////////////////////////////////////////////////////////

export interface Order {
  id?: number;
  client?: Client;
  comments?: string;
  status?: string;
  createDate?: Date;
  amount?: number;
  products? : Product[];
  selected?: boolean;
  totalRawMaterial? : number;
  confirmed? : boolean;
}

export class Client {
  name?:      string;
  cellphone?: string;
  lastName?: string;
  mail?: string;
  address?: Address;
}

export class Address {
  street?:     string;
  doorNumber?: string;
  zipCode?:    string;
  state?:      string;
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
