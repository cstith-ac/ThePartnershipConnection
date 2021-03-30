import { Pipe, PipeTransform } from '@angular/core';
import { CustomerSearchListSite } from '../models/customersearchlistsite';

@Pipe({
  name: 'filterSite'
})
export class FilterSitePipe implements PipeTransform {

  transform(CustomerSearchListSite: CustomerSearchListSite[], searchValue: string): CustomerSearchListSite[] {
    
    if(!CustomerSearchListSite || !searchValue) {
      return CustomerSearchListSite;
    }

    return CustomerSearchListSite.filter(x => 
      x.address_1.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      x.address_2.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      x.site_Number.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
    );

  }

}
