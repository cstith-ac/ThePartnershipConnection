import { Pipe, PipeTransform } from '@angular/core';
import { InstallCompanyList2 } from '../models/installcompanylist2';

@Pipe({ 
    name: 'listFilter'
})
export class ListFilterPipe implements PipeTransform {

    // transform(list: any[], filterText: string): any {
    //     console.log(list)
    //     return list ? list.filter(item => item.companyName.search(new RegExp(filterText, 'i')) > -1) : [];
    // }
    transform(InstallCompanyLists2: InstallCompanyList2[], filterText: string): InstallCompanyList2[] {

        if(!InstallCompanyLists2 || !filterText) {
            return InstallCompanyLists2;
        }
        return InstallCompanyLists2.filter(list => 
            list.companyName.toLocaleLowerCase().startsWith((filterText.toLocaleLowerCase())));

    }
}