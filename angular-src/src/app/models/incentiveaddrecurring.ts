export class Incentive_Add_Recurring {
    incentiveID: number;
    itemID: number;
    description: string;
    billCycle: string;
    rmr: number;
    passThrough: number;
    billingStartDate: Date = new Date();
    multiple: number;
    add2Item: number;
    total: number;
}