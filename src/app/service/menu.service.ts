import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URI } from '../app.constant';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  

  constructor(private httpClient : HttpClient) { }

  getAllCategories() {
    return this.httpClient.get<Category[]>(`${API_URI}category`)
  }

  getProductByCategory(id) {
    let headers = new HttpHeaders({
      "Content-Type" : "application/json"
    })
    return this.httpClient.get<Product[]>(`${API_URI}product/search?categoryId=${id}`, {headers})
  }

  getProduct(id) {
    let headers = new HttpHeaders({
      "Content-Type" : "application/json"
    })
    return this.httpClient.get<Product[]>(`${API_URI}product?productId=${id}`, {headers})
  }

  getStates() {
    let headers = new HttpHeaders({
      "Content-Type" : "application/json"
    })
    return this.httpClient.get<State[]>(`${API_URI}state`, {headers})
  }

}


export interface Category {
  id?:          number;
  name?:        string;
  description?: string;
}

// Converts JSON strings to/from your types
export class ConvertCategory {
  public static toCategory(json: string): Category {
      return JSON.parse(json);
  }

  public static categoryToJson(value: Category): string {
      return JSON.stringify(value);
  }
}

export class State {
  id?:          string;
  state?:        string;
}

// Converts JSON strings to/from your types
export class ConvertState {
  public static toState(json: string): State {
      return JSON.parse(json);
  }

  public static stateToJson(value: State): string {
      return JSON.stringify(value);
  }
}

export class Product {
  id?:          number;
  name?:        string;
  category?:    Category;
  price?:       number;
  description?: string;
  available?:   boolean;
  extras?:      Extra[];
}


// Converts JSON strings to/from your types
export class ConvertProduct {
  public static toProduct(json: string): Product {
      return JSON.parse(json);
  }

  public static productToJson(value: Product): string {
      return JSON.stringify(value);
  }
}

export interface Extra {
  id?:        number;
  name?:      string;
  price?:     number;
  available?: boolean;
  selected?:  boolean;
  quantity?:  number;
}

// Converts JSON strings to/from your types
export class ConvertExtra {
  public static toExtra(json: string): Extra {
      return JSON.parse(json);
  }

  public static extraToJson(value: Extra): string {
      return JSON.stringify(value);
  }
}
