import React, { ReactElement, cloneElement, Children, isValidElement } from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';

interface FormProps<T extends object> {
  initialValues: T;
  validationSchema: Yup.ObjectSchema<T>;
  onSubmit: (values: T) => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

// Define a type for the props that will be passed to child components
interface FormChildProps {
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  isSubmitting: boolean;
}

export function Form<T extends object>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  className = '',
}: FormProps<T>) {
  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isSubmitting, errors, touched }) => (
        <FormikForm className={`space-y-6 ${className}`}>
          {Children.map(children, (child) => {
            if (isValidElement(child)) {
              return cloneElement(child as ReactElement<any>, {
                errors,
                touched,
                isSubmitting,
              } as FormChildProps);
            }
            return child;
          })}
        </FormikForm>
      )}
    </Formik>
  );
}

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  className?: string;
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  errors,
  touched,
  isSubmitting,
  className = '',
}: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Field
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
          errors[name] && touched[name]
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
            : ''
        }`}
        disabled={isSubmitting}
      />
      <ErrorMessage name={name} component="p" className="mt-2 text-sm text-red-600" />
    </div>
  );
}

interface FormSubmitButtonProps {
  isSubmitting: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormSubmitButton({
  isSubmitting,
  children,
  className = '',
}: FormSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isSubmitting ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Submitting...
        </div>
      ) : (
        children
      )}
    </button>
  );
}
