import { Pipe, PipeTransform } from '@angular/core';
import { CustomerSearchListCentralStation } from '../models/customersearchlistcentralstation';

@Pipe({
  name: 'filterCentralStation'
})
export class FilterCentralStationPipe implements PipeTransform {

  transform(CustomerSearchListCentralStations: CustomerSearchListCentralStation[], searchValue: string): CustomerSearchListCentralStation[] {
    
    if(!CustomerSearchListCentralStations || !searchValue) {
      return CustomerSearchListCentralStations;
    }

    return CustomerSearchListCentralStations.filter(x => 
      x.alarmAccount.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
  }

}
