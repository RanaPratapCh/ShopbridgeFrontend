import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopbridgeService {

  constructor(private http:HttpClient) { }


  addProductsToInventory(Product:any){
    return this.http.post("/api/add-product",Product);
  }

  allProducts():Observable<any>{
    return this.http.get("/api/all-Products");
  }

  deleteProduct(id:any){
    return this.http.delete("/api/delete-product/"+id);
  }

  updateProduct(product:any){
    return this.http.put("/api/update-product",product);
  }
  


}
