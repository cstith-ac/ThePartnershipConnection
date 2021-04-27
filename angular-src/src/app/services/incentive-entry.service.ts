import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IncentiveEntryService {
  public sharedIncentiveInfo = {};
  public sharedIncentiveRecurringInfo = {};
  public sharedIncentiveEquipMatInfo = {};
  public sharedIncentiveLaborChargesInfo = {};
  // public sharedIncentiveInfo = [];
  // public sharedIncentiveRecurringInfo = [];
  // public sharedIncentiveEquipMatInfo = [];
  // public sharedIncentiveLaborChargesInfo = [];
  constructor() { }
}
