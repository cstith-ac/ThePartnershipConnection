export class PartnerServiceListingExtended {
    service_Ticket_Id: number;
    ticket_Number: number;
    creation_Date: Date = new Date();
    customer_Number: string;
    customer_Name: string;
    problem_Code: string;
    business_Name: string;
    comResStatus: string;
    address_1: string;
    address_2: string;
    address_3: string;
    city: string;
    state: string;
    zipCode: string;
    sitePhone: string;
    customerComments: string;
    contactName: string;
    contactPhone: string;
    customerEmail: string;
    customer_Since: Date = new Date();
    csAccount: string;
    panel_Location: string;
    systemType: string;
    panelType: string;
    centralStation: string;
    acContact: string; //Alarm Connections contact
    acContactEmail: string;
    collectionQueue: string;
    cancelStatus: string;
    customerRMR: number;
    status3G: string;
    customer_Id: number;
    customer_Site_Id: number;
    customer_System_Id: number;
}