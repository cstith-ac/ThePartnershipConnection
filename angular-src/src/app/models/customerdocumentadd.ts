export class Customer_Document_ADD {
    company_id: number;
    customer_id: number;
    customer_site_id: number;
    customer_system_id: number;
    job_id: number;
    security_level: number;
    file_name: string;
    file_size: number;
    //upload_date: Date =null;
    upload_date: Date = new Date();
    //upload_date: Date;
    document_ext: string;
    user_code: string;
    user_description: string;
    reference1: string;
    reference2: string;
    reference3: string;
    reference4: string;
    //file_data: ImageBitmap;
    file_data: File = null;
    document_id: number;
}