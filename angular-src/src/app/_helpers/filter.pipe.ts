import { CustomerSearchList } from '../models/customerseachlist';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(CustomerSearchLists: CustomerSearchList[], searchValue: string): CustomerSearchList[] {

    if(!CustomerSearchLists || !searchValue) {
      return CustomerSearchLists;
    }

    return CustomerSearchLists.filter(x => 
      x.customer_Name.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      x.customer_Number.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()) ||
      x.customerStatus.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
    );
  }
}

// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'filter'
// })
// export class FilterPipe implements PipeTransform {

//   transform(value: any[], filterString: string, propName: string): any[] {
//     const resultArray = [];
//     if (value.length === 0 || filterString === '' || propName === '') {
//       return value;
//     }

//     for (const item of value) {
//       if (item[propName] === filterString) {
//         resultArray.push(item);
//       }
//     }
//     return resultArray;
//   }

// }
