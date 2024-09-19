'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
//import { useDebounce } from "@uidotdev/usehooks";
import * as z from 'zod';


import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EmployeeSchema } from '@/schemas/EmployeeSchema';
/** 
// Employee Schema
const employeeSchema = z.object({
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
**/
export default function AddEmployeeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof EmployeeSchema>>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      designation: '',
      gender: 'Male',
      course: '',
      image: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof EmployeeSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('mobile', data.mobile);
    formData.append('designation', data.designation);
    formData.append('gender', data.gender);
    formData.append('course', data.course);
    if (data.image) {
      formData.append('image', data.image[0]);
    }

    try {
      const response = await axios.post('/api/Employee', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/employees'); // Redirect to employees list or desired route
    } catch (error) {
      console.error('Error adding employee:', error);
    
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error)) {
        // Check if response and data exist to safely access error message
        const errorMessage =
          error.response?.data?.message || // If error message is available in response
          'There was a problem adding the employee. Please try again.'; // Default fallback message
    
        toast({
          title: 'Add Employee Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      } else {
        // Handle non-Axios errors
        toast({
          title: 'Unexpected Error',
          description: 'An unexpected error occurred. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
    
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Add Employee
          </h1>
          <p className="mb-4">Fill in the details to add a new employee</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} type="email" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="mobile"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="designation"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="gender"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <select {...field} className="w-full p-2 border rounded">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="course"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <Input type="file" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Add Employee'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
