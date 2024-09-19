// api/employee/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import EmployeeModel from '@/model/User';
import { EmployeeSchema } from '@/schemas/EmployeeSchema';
import { z } from 'zod';
import multer from 'multer';
import { NextRequest } from 'next/server';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing to handle file uploads
  },
};

// Multer setup for handling image upload
const upload = multer({
  storage: multer.memoryStorage(), // Store image in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export async function POST(req: NextRequest) {
  await dbConnect();

  // Wrap multer in a promise to handle uploads
  const uploadPromise = new Promise<{ fields: any; files: any }>((resolve, reject) => {
    upload.single('image')(req as any, {} as any, (err: any) => {
      if (err) return reject(err);
      resolve({ fields: req.body, files: (req as any).file });
    });
  });

  try {
    const { fields, files } = await uploadPromise;

    // Extract fields and validate using Zod
    const employeeData = {
      name: fields.name,
      email: fields.email,
      mobile: fields.mobile,
      designation: fields.designation,
      gender: fields.gender,
      course: fields.course,
      image: files?.buffer.toString('base64'), // Convert image to base64
    };

    // Validate employee data using Zod schema
    const validatedEmployee = EmployeeSchema.parse(employeeData);

    // Create new employee in the database
    const newEmployee = new EmployeeModel(validatedEmployee);
    await newEmployee.save();

    return NextResponse.json({
      success: true,
      message: 'Employee added successfully',
      employee: newEmployee,
    }, { status: 201 });

  } catch (error: any) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: error.errors.map((err) => err.message).join(', '),
      }, { status: 400 });
    }

    // Log error and return generic error response
    console.error('Error adding employee:', error);
    return NextResponse.json({
      success: false,
      message: 'Error adding employee',
    }, { status: 500 });
  }
}

