// dashboard/page.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import {CustomAxiosError} from 'next-auth'

// Employee interface
interface Employee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  designation: string;
  gender: string;
  course: string;
  imageUrl: string;
}

function UserDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobile: '',
      designation: '',
      gender: '',
      course: '',
      image: null as File | null,
    },
  });

  const { register, handleSubmit, reset, watch } = form;
  const image = watch('image');

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/Employee'); // Assuming you have this API
      setEmployees(response.data.employees || []);
    } catch (error) {
      // Cast the error as CustomAxiosError
      const axiosError = error as CustomAxiosError;
    
      // Safely access the error message or provide a default fallback message
      const errorMessage =
        axiosError.response?.data?.message || 'Failed to fetch employees';
    
      // Display the error message using toast
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    
      // Optional: Log the error for debugging purposes
      console.error('Error fetching employees:', axiosError);
    }
     finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Handle form submit to add an employee
  const onSubmit = async (data: Omit<Employee, 'id' | 'imageUrl'> & { image: File | null }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('mobile', data.mobile);
    formData.append('designation', data.designation);
    formData.append('gender', data.gender);
    formData.append('course', data.course);
    if (data.image) {
      formData.append('image', data.image);
    }

    try {
      const response = await axios.post('/api/Employee', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }); // Assuming this API exists
      setEmployees([...employees, response.data.employee]);
      reset();
      setShowAddForm(false);
      toast({
        title: 'Success',
        description: 'Employee added successfully',
      });
    } catch (error) {
      // Cast the error to CustomAxiosError
      const axiosError = error as CustomAxiosError;
    
      // Safely access the message with optional chaining, with a default fallback message
      const errorMessage = axiosError.response?.data?.message || 'Failed to add employee';
    
      // Display the error message using toast
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    
      // Log the error for debugging purposes
      console.error('Error adding employee:', axiosError);
    }
    
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">Employee List</h1>

      <div className="mb-4">
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Employee'}
        </Button>
      </div>

      {/* Add Employee Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4 grid gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              required
              className="input input-bordered w-full p-2 mt-1"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              required
              className="input input-bordered w-full p-2 mt-1"
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
              Mobile No.
            </label>
            <input
              id="mobile"
              type="tel"
              {...register('mobile')}
              required
              className="input input-bordered w-full p-2 mt-1"
            />
          </div>

          <div>
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
              Designation
            </label>
            <input
              id="designation"
              type="text"
              {...register('designation')}
              required
              className="input input-bordered w-full p-2 mt-1"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              {...register('gender')}
              required
              className="input input-bordered w-full p-2 mt-1"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700">
              Course
            </label>
            <input
              id="course"
              type="text"
              {...register('course')}
              required
              className="input input-bordered w-full p-2 mt-1"
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              {...register('image')}
              className="input input-bordered w-full p-2 mt-1"
            />
          </div>

          <Button type="submit" className="mt-4">
            Add Employee
          </Button>
        </form>
      )}

      <Separator />

      {/* Employee List */}
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin mt-4" />
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {employees.length > 0 ? (
            employees.map((employee) => (
              <div key={employee.id} className="p-4 bg-gray-100 rounded-lg shadow">
                <img src={employee.imageUrl} alt={employee.name} className="w-16 h-16 rounded-full mb-2" />
                <h2 className="text-xl font-semibold">{employee.name}</h2>
                <p>Email: {employee.email}</p>
                <p>Mobile: {employee.mobile}</p>
                <p>Designation: {employee.designation}</p>
                <p>Gender: {employee.gender}</p>
                <p>Course: {employee.course}</p>
              </div>
            ))
          ) : (
            <p>No employees to display.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
