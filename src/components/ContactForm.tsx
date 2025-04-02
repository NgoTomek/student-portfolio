import React, { useState } from 'react';
import { Form, FormField, FormSubmitButton } from './Form';
import * as Yup from 'yup';
import { handleError } from '../utils/errorUtils';
import { showSuccessToast } from './Toast';

interface ContactFormProps {
  recipientId?: string;
  onSubmitSuccess?: () => void;
}

interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const contactSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Please enter a valid email').required('Email is required'),
  message: Yup.string().required('Message is required').min(10, 'Message is too short'),
});

const ContactForm: React.FC<ContactFormProps> = ({ recipientId, onSubmitSuccess }) => {
  const [error, setError] = useState<string>('');

  const initialValues: ContactFormValues = {
    name: '',
    email: '',
    message: '',
  };

  const handleSubmit = async (values: ContactFormValues, { resetForm, setSubmitting }: { resetForm: () => void, setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setError('');
      
      // In a real implementation, this would send a message to Firestore
      console.log('Sending message to:', recipientId, values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      showSuccessToast('Message sent successfully!');
      
      // Reset form
      resetForm();
      
      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      handleError(err, 'Failed to send message');
      setError(err instanceof Error ? err.message : 'An error occurred while sending your message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      initialValues={initialValues}
      validationSchema={contactSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <FormField
            name="name"
            label="Name"
            placeholder="Your name"
            errors={errors}
            touched={touched}
            isSubmitting={isSubmitting}
          />
          
          <FormField
            name="email"
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            errors={errors}
            touched={touched}
            isSubmitting={isSubmitting}
          />
          
          <FormField
            name="message"
            label="Message"
            as="textarea"
            placeholder="Your message here..."
            rows={4}
            errors={errors}
            touched={touched}
            isSubmitting={isSubmitting}
          />
          
          <FormSubmitButton isSubmitting={isSubmitting} className="w-full">
            Send Message
          </FormSubmitButton>
        </>
      )}
    </Form>
  );
};

export default ContactForm;
