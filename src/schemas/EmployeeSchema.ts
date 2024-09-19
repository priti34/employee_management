import { z } from 'zod';

export const EmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  designation: z.string().min(1, 'Designation is required'),
  gender: z.enum(['Male', 'Female', 'Other'], { message: 'Gender is required' }),
  course: z.string().min(1, 'Course is required'),
  image: z
    .any()
    .refine((file) => file && file.size <= 5 * 1024 * 1024, 'Max image size is 5MB'),
});

//export type Employee = z.infer<typeof EmployeeSchema>;
