import { Pipe, PipeTransform } from '@angular/core';
import { TPCPartnerAgingReport } from '../models/tpcpartneragingreport';

@Pipe({
  name: 'filter90Day'
})
export class Filter90DayPipe implements PipeTransform {

  transform(TPCPartnerAgingReport: TPCPartnerAgingReport[], filterText: string): TPCPartnerAgingReport[] {

    if(!TPCPartnerAgingReport || !filterText) {
        return TPCPartnerAgingReport;
    }
    return TPCPartnerAgingReport.filter(list => 
        list.filterCategory.toLocaleLowerCase().startsWith((filterText.toLocaleLowerCase())));

}

}
