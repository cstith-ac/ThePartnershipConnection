import { Pipe, PipeTransform } from '@angular/core';
import { AspNetUsers } from '../models/aspnetusers';

@Pipe({
  name: 'filterAdmin'
})
export class FilterAdminPipe implements PipeTransform {

  transform(value: any, input: any): any {
    if(input) {
      return value.filter(val => val.indexOf(input)) >= 0;
    } else {
      return value;
    }
  }

}
