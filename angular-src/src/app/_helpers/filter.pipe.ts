import { CustomerSearchList } from '../models/customersearchlist';
import { CustomerSearchListDec14 } from '../models/customersearchlistdec14';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  // transform(CustomerSearchLists: CustomerSearchList[], searchValue: string): CustomerSearchList[] {

  //   if(!CustomerSearchLists || !searchValue) {
  //     return CustomerSearchLists;
  //   }

  //   return CustomerSearchLists.filter(x => 
  //     x.customer_Name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
  //     x.customer_Number.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
  //     x.customerStatus.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
  //   );
  // }

  transform(CustomerSearchListDec14s: CustomerSearchListDec14[], searchValue: string): CustomerSearchListDec14[] {

    if(!CustomerSearchListDec14s || !searchValue) {
      return CustomerSearchListDec14s;
    }

    return CustomerSearchListDec14s.filter(x => 
      x.customer_Name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      x.customer_Number.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      x.customerStatus.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      x.address_1.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
    );
  }
}
