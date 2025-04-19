import { z } from 'zod';

export const CustomerFormSchema = z.object({
    CustomerName: z.string({
        required_error: "ชื่อลูกค้าจำเป็นต้องกรอก",
        invalid_type_error: "ชื่อลูกค้าต้องเป็นข้อความ"
    }),
    CustomerGender: z.string({
        required_error: "เพศจำเป็นต้องกรอก",
        invalid_type_error: "เพศต้องเป็นข้อความ"
    }),
    CustomerTel: z.number({
        required_error: "เบอร์โทรศัพท์จำเป็นต้องกรอก",
        invalid_type_error: "เบอร์โทรศัพท์ต้องเป็นตัวเลข"
    }),
    CustomerAddress: z.string({
        required_error: "ที่อยู่จำเป็นต้องกรอก",
        invalid_type_error: "ที่อยู่ต้องเป็นข้อความ"
    }),
    CustomerPostcode: z.number({
        required_error: "รหัสไปรษณีย์จำเป็นต้องกรอก",
        invalid_type_error: "รหัสไปรษณีย์ต้องเป็นตัวเลข"
    })
}).partial();

export type CustomerInput = z.infer<typeof CustomerFormSchema>;