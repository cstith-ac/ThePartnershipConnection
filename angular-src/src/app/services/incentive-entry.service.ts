import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IncentiveEntryService {
  public sharedIncentiveInfo = {};
  //public sharedIncentiveRecurringInfo = {};
  // public sharedIncentiveEquipMatInfo = {};
  // public sharedIncentiveLaborChargesInfo = {};
  // public sharedIncentiveInfo = [];
  public sharedIncentiveRecurringInfo = [];
  public sharedIncentiveEquipMatInfo = [];
  public sharedIncentiveLaborChargesInfo = [];
  constructor() { }

  updateRecurring(ItemID: number, Description: string, BillCycle: string, RMR: number, PassThrough: number, BillingStartDate: Date, Multiple: number, Add2Item: number) {
    console.log('updateRecurring');
    this.sharedIncentiveRecurringInfo.push({ ItemID, Description, BillCycle, RMR, PassThrough, BillingStartDate, Multiple, Add2Item })
  }

  updateEquipMat(ItemID: number, Description: string, Quantity: number, Cost: number, Total: number) {
    console.log('updateEquipMat');
    this.sharedIncentiveEquipMatInfo.push({
      ItemID,
      Description,
      Quantity,
      Cost,
      Total
    })
  }

  updateLaborCharges(ItemID: number, Description: string, Hours: number, CostPerHour: number, Total: number) {
    console.log('updateLaborCharges');
    this.sharedIncentiveLaborChargesInfo.push({
      ItemID,
      Description,
      Hours,
      CostPerHour,
      Total
    })
  }
}
