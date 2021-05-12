import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ShopbridgeService } from '../shopbridge.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit,OnDestroy {

  addProductsToInventorySubscription : Subscription | undefined;
  UpdateProductToInventorySubscription : Subscription | undefined;

  ProductName = "";
  ProductNameErr = false;
  ProductCost = "";
  ProductCostErr = false;
  ProductType = "";
  ProductTypeErr = false; 
  ProductDescription = "";
  ProductDescriptionErr = false;
  ProductData = {
    prodName: "",
    prodDescription:"",
    prodPrice:"",
    prodType:""
  }
  UpdateProductData = {
    prodId:0,
    prodName: "",
    prodDescription:"",
    prodPrice:"",
    prodType:""
  }

  EnableAlert = false;
  ProductNeedToUpdate = false;
  ProductId:any;
  constructor(private service:ShopbridgeService,private router:Router) { }

  ngOnInit(): void {
    if(this.router.url == '/UpdateProduct' && localStorage.getItem('ProductDetails')){
      var data:any;
      data = localStorage.getItem('ProductDetails');
      var ProductDetails = JSON.parse(data);
      this.ProductNeedToUpdate = true;
      this.ProductName = ProductDetails.prodName;
      this.ProductCost = ProductDetails.prodPrice;
      this.ProductType = ProductDetails.prodType;
      this.ProductDescription = ProductDetails.prodDescription;
      this.ProductId = ProductDetails.prodId;
    }
  }
  Goback(){
    this.router.navigate(['/Home']);
    if(this.router.url == '/UpdateProduct')
    localStorage.removeItem('ProductDetails');
  }
    _keyPressAmount(event: any) {
    const pattern = /^[0-9]+$/;
    let inputChar = String.fromCharCode(event.charCode);
        
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }

  }
  PsateOnlyNumbers(event: any) {
    const pattern = /^[0-9]+$/;
    let inputChar =  event.clipboardData.getData ("Text");
        
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }

  }
  preventingQuotes(event:any){
    const pattern = /['"]/;
    let inputChar = String.fromCharCode(event.charCode);
        
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  PastpreventingQuotes(event:any){
    const pattern = /['"]/;
    let inputChar =  event.clipboardData.getData ("Text")
        
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  Clear(){
    this.ProductName = "";
    this.ProductCost = "";
    this.ProductType = "";
    this.ProductDescription = "";
  }
  addProduct(){
    swal("Hello world!");
  }

  AddProductToInventory(){
    var IsValid = true

    if(this.ProductName.length == 0){
      IsValid = false;
      this.ProductNameErr = true;
    }else{
      this.ProductNameErr = false;
    }

    if(this.ProductCost.length == 0){
      IsValid = false;
      this.ProductCostErr = true;
    }else{
      this.ProductCostErr = false;
    }

    if(this.ProductType.length == 0){
      IsValid = false;
      this.ProductTypeErr = true;
    }else{
      this.ProductTypeErr = false;
    }

    if(this.ProductDescription.length == 0){
      IsValid = false;
      this.ProductDescriptionErr = true;
    }else{
      this.ProductDescriptionErr = false;
    }

    if (IsValid) {
      this.ProductData.prodName = this.ProductName;
      this.ProductData.prodPrice = this.ProductCost
      this.ProductData.prodType = this.ProductType;
      this.ProductData.prodDescription = this.ProductDescription;

      var Product = this.ProductData;
      this.addProductsToInventorySubscription = this.service.addProductsToInventory(Product).subscribe((msg: any) => {
        try {
          console.log(msg);
          if (msg.statusCode == '200') {
            swal({
              title: "Successfully Added!",
              text: this.ProductName + ' Added to the Inventory',
              icon: "success",
              buttons: {
                cancel: true,
                catch: {
                  text: "Goto Home",
                  value: "catch",
                },
              },
            })
            .then((value) => {
              switch (value) {            
                case "catch":
                  this.router.navigate(['/Home'])
                  break;
              }
            });
          }else{
            swal({
              title: "Un Successfull!",
              text: this.ProductName + ' Not Added to the Inventory',
              icon: "warning",
              buttons: {
                catch: {
                  text: "Try Again !",
                  value: "catch",
                },
              },
            })
            .then((value) => {
              switch (value) {            
                case "catch":
                  break;
              }
            });
          }

        } catch (e) {
          this.SomethingWentWrong();
        }

      }, error => {
        this.SomethingWentWrong();
      })
    }
  }
  UpdateProductToInventory(){
    var IsValid = true

    if(this.ProductName!.length == 0 || this.ProductName == null){
      IsValid = false;
      this.ProductNameErr = true;
    }else{
      this.ProductNameErr = false;
    }

    if(this.ProductCost!.length == 0 || this.ProductCost == null){
      IsValid = false;
      this.ProductCostErr = true;
    }else{
      this.ProductCostErr = false;
    }

    if(this.ProductType!.length == 0 || this.ProductType == null){
      IsValid = false;
      this.ProductTypeErr = true;
    }else{
      this.ProductTypeErr = false;
    }

    if(this.ProductDescription!.length == 0 || this.ProductDescription == null){
      IsValid = false;
      this.ProductDescriptionErr = true;
    }else{
      this.ProductDescriptionErr = false;
    }

    if (IsValid) {
      this.UpdateProductData.prodName = this.ProductName;
      this.UpdateProductData.prodPrice = this.ProductCost
      this.UpdateProductData.prodType = this.ProductType;
      this.UpdateProductData.prodDescription = this.ProductDescription;
      this.UpdateProductData.prodId = this.ProductId;

      var Product = this.UpdateProductData;
      this.UpdateProductToInventorySubscription = this.service.updateProduct(Product).subscribe((msg: any) => {
        try {
          console.log(msg);
          if (msg.statusCode == '200') {
            swal({
              title: "Successfully Updated!",
              text: this.ProductName + ' updated to the Inventory',
              icon: "success",
              buttons: {
                catch: {
                  text: "Goto Home",
                  value: "catch",
                },
              },
            })
            .then((value) => {
              switch (value) {            
                case "catch":
                  localStorage.removeItem('ProductDetails');
                  this.router.navigate(['/Home'])
                  break;
              }
            });
          }else{
            swal({
              title: "Un Successfull!",
              text: this.ProductName + ' Not updates to the Inventory',
              icon: "warning",
              buttons: {
                catch: {
                  text: "Try Again !",
                  value: "catch",
                },
              },
            })
            .then((value) => {
              switch (value) {            
                case "catch":
                  break;
              }
            });
          }

        } catch (e) {
          this.SomethingWentWrong();
        }

      }, error => {
        this.SomethingWentWrong();
      })
    }
  }

  SomethingWentWrong(){
    swal({
      title: "Some thing went wrong!",
      text: this.ProductName + ' Not Added to the Inventory',
      icon: "warning",
      buttons: {
        catch: {
          text: "Try Again !",
          value: "catch",
        },
      },
    })
    .then((value) => {
      switch (value) {            
        case "catch":
          break;
      }
    });
  }

  ngOnDestroy() {
    if(this.addProductsToInventorySubscription)
    this.addProductsToInventorySubscription.unsubscribe();
    if(this.UpdateProductToInventorySubscription)
    this.UpdateProductToInventorySubscription.unsubscribe();
  }

}


