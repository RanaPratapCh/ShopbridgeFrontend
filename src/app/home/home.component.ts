import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import swal from 'sweetalert';
import { ShopbridgeService } from '../shopbridge.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {

  TotalData:any;
  allProductsSubscription : Subscription | undefined;
  DeleteProductInventorySubscription : Subscription | undefined;
  ErrorFetchingDetails = false;
  SerchByName = "";
  FilterByType = "All";
  FilterData:any = ['All'];

  TotalProducts:any;
  TotalProductsCost = 0;




  constructor(private service:ShopbridgeService,private router:Router){

  }
  ngOnInit() {
    this.GetAllProducts();
  }

  GetAllProducts(){
    this.ErrorFetchingDetails = false;
    this.allProductsSubscription = this.service.allProducts().subscribe(data=>{
      try{
        console.log(data);
        if(data.statusCode == '200'){
          this.ErrorFetchingDetails = false;
          this.TotalData = data.products;
          if(this.TotalData.length > 0){
            this.TotalProducts = this.TotalData.length;
            this.TotalData.forEach((element: { prodType: any; prodPrice:any }) => {
              var data = element.prodType;
              this.FilterData.push(data);
              this.TotalProductsCost = this.TotalProductsCost + parseInt(element.prodPrice)
            });
          }
          console.log('filter data '+this.FilterData);
          
        }else{
          this.ErrorFetchingDetails = true;
        }
      }catch (e) {
        this.ErrorFetchingDetails = true;
      }
      
    },error=>{
      this.ErrorFetchingDetails = true;
    })
  }




  AddProduct(){
    this.router.navigate(['/AddProduct'])
  }
  GotoDeleteTheProduct(data:any){
    var ProductName = data.prodName;
    swal({
      title: "Are you sure?",
      text: ProductName + ' Once deleted, you will not be able to recover this product !',
      icon: "warning",
      buttons: {
        Cancel:true,
        catch: {
          text: "Delete",
          value: "catch",
        },
      },
    })
    .then((value) => {
      switch (value) {            
        case "catch":
          this.DeleteTheProduct(data.prodId,ProductName)
          break;
      }
    });
  }
  DeleteTheProduct(id:any,name:any){
    this.DeleteProductInventorySubscription = this.service.deleteProduct(id).subscribe((msg: any) => {
      try {
        console.log(msg);
        if (msg.statusCode == '200') {
          this.GetAllProducts();
          swal({
            title: "Successfully deleted!",
            text: name + ' deleted in the Inventory',
            icon: "success",
            buttons: {
              catch: {
                text: "Ok",
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
        }else{
          swal({
            title: "Un Successfull!",
            text: name + ' Not deleted in the Inventory',
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
        this.SomethingWentWrong(name);
      }

    }, error => {
      this.SomethingWentWrong(name);
    })
  

  }

  SomethingWentWrong(ProductName:any){
    swal({
      title: "Some thing went wrong!",
      text: ProductName + ' Not Deleted in the Inventory',
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

  GotoUpdateTheProduct(data:any){
    localStorage.setItem('ProductDetails',JSON.stringify(data));
    this.router.navigate(['/UpdateProduct']);
  }


  ngOnDestroy() {
    if(this.allProductsSubscription)
      this.allProductsSubscription.unsubscribe();
      if(this.DeleteProductInventorySubscription)
      this.DeleteProductInventorySubscription.unsubscribe();

  }

}
