import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceNullWithText'
})
export class ReplaceNullWithTextPipe implements PipeTransform {

  transform(value: any, replaceText: string = 'N/A'): any {
    if(typeof value === 'undefined' || value === null || value === '') {
      return replaceText;
    }
    return value;
  }

}
