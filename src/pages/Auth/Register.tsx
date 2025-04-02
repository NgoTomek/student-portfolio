import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Form, FormField, FormSubmitButton } from '../../components/Form';
import * as Yup from 'yup';
import { Card } from '../../components/Card';
import { handleError } from '../../utils/errorUtils';

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  school: Yup.string()
    .required('School name is required'),
  year: Yup.string()
    .required('Year/Grade is required'),
});

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  school: string;
  year: string;
}

const Register: React.FC = () => {
  const [error, setError] = useState<string>('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const initialValues: RegisterFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    year: '',
  };

  const handleSubmit = async (values: RegisterFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setError('');
      await signup(values.email, values.password, values.name);
      navigate('/dashboard');
    } catch (err) {
      handleError(err, 'Registration failed');
      setError(err instanceof Error ? err.message : 'Failed to create an account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your portfolio account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <Form
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <>
                <FormField
                  name="name"
                  label="Full Name"
                  errors={errors}
                  touched={touched}
                  isSubmitting={isSubmitting}
                />

                <FormField
                  name="email"
                  label="Email address"
                  type="email"
                  errors={errors}
                  touched={touched}
                  isSubmitting={isSubmitting}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    name="school"
                    label="School"
                    errors={errors}
                    touched={touched}
                    isSubmitting={isSubmitting}
                  />

                  <FormField
                    name="year"
                    label="Year/Grade"
                    errors={errors}
                    touched={touched}
                    isSubmitting={isSubmitting}
                  />
                </div>

                <FormField
                  name="password"
                  label="Password"
                  type="password"
                  errors={errors}
                  touched={touched}
                  isSubmitting={isSubmitting}
                />

                <FormField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  errors={errors}
                  touched={touched}
                  isSubmitting={isSubmitting}
                />

                <FormSubmitButton isSubmitting={isSubmitting} className="w-full mt-6">
                  Create Account
                </FormSubmitButton>
              </>
            )}
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
