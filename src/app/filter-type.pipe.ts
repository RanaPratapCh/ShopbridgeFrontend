import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterType'
})
export class FilterTypePipe implements PipeTransform {

  transform(input: any[], searched: any): any[] {
    var output:any[] = [];
    if(searched != "" && searched != 'All' ){
      output = input.filter(item=> item.prodType.toUpperCase().indexOf(searched.toUpperCase()) != -1);
      return output;
    }else{
      output = input;
      return output;
    }
  }

}
