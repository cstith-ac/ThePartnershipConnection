import { Pipe, PipeTransform } from '@angular/core';
import { AspNetUsers } from '../models/aspnetusers';

@Pipe({
  name: 'filterAdmin'
})
export class FilterAdminPipe implements PipeTransform {

  transform(AspNetUsers: AspNetUsers[], searchTerm: string): AspNetUsers[] {
    if(!AspNetUsers || !searchTerm) {
      return AspNetUsers;
    }

    return AspNetUsers.filter(x => x.userName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()))
  }

}
