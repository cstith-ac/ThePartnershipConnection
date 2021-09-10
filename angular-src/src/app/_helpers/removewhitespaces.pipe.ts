import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removewhitespaces'
})
export class RemovewhitespacesPipe implements PipeTransform {

  transform(value: string): string {
    //return value.replace(/\r?\n|\r/, '');
    return value && value.trim();
  }

}
