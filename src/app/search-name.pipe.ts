import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchName'
})
export class SearchNamePipe implements PipeTransform {

  transform(input: any[], searched: any): any[] {
    var output:any[] = [];
    if(searched != "" ){
      output = input.filter(item=> item.prodName.toUpperCase().indexOf(searched.toUpperCase()) != -1);
      return output;
    }else{
      output = input;
      return output;
    }
  }

}
