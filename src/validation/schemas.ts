import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const registerSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  displayName: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
});

export const personalInfoSchema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  phone: yup
    .string()
    .matches(/^[0-9+\s-()]*$/, 'Please enter a valid phone number')
    .nullable(),
  location: yup.string().nullable(),
  bio: yup.string().max(500, 'Bio must not exceed 500 characters').nullable(),
});

export const projectSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  technologies: yup.array().of(yup.string()).min(1, 'At least one technology is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().min(yup.ref('startDate'), 'End date must be after start date').nullable(),
  link: yup.string().url('Please enter a valid URL').nullable(),
});

export const leadershipSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  organization: yup.string().required('Organization is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().min(yup.ref('startDate'), 'End date must be after start date').nullable(),
});

export const skillSchema = yup.object().shape({
  name: yup.string().required('Skill name is required'),
  category: yup.string().required('Category is required'),
  level: yup
    .string()
    .oneOf(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
    .required('Level is required'),
});
