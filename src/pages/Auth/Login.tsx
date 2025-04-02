import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Form, FormField, FormSubmitButton } from '../../components/Form';
import * as Yup from 'yup';
import { Card } from '../../components/Card';
import { handleError } from '../../utils/errorUtils';

interface LocationState {
  from?: string;
}

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [error, setError] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from || '/dashboard';

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values: LoginFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setError('');
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err) {
      handleError(err, 'Login failed');
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
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
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <>
                <FormField
                  name="email"
                  label="Email address"
                  type="email"
                  placeholder="your.email@example.com"
                  errors={errors}
                  touched={touched}
                  isSubmitting={isSubmitting}
                />

                <FormField
                  name="password"
                  label="Password"
                  type="password"
                  errors={errors}
                  touched={touched}
                  isSubmitting={isSubmitting}
                />

                <div className="flex items-center justify-between mt-4 mb-6">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <FormSubmitButton isSubmitting={isSubmitting} className="w-full">
                  Sign in
                </FormSubmitButton>
              </>
            )}
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
