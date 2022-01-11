import { Pipe, PipeTransform } from '@angular/core';
import { ListPartnerContacts } from '../models/listpartnercontacts';

@Pipe({
  name: 'filterPartnerviewlist'
})
export class FilterPartnerviewlistPipe implements PipeTransform {

  transform(ListPartnerContacts: ListPartnerContacts[], searchTerm: string): ListPartnerContacts[] {
    if(!ListPartnerContacts || !searchTerm) {
      return ListPartnerContacts;
    }

    return ListPartnerContacts.filter(x => x.partnerName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
  }

}
