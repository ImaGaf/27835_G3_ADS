import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener una mayúscula')
    .regex(/[a-z]/, 'Debe contener una minúscula')
    .regex(/\d/, 'Debe contener un número')
    .regex(/[@$!%*?&]/, 'Debe contener un carácter especial'),
  confirmPassword: z.string(),
  fullName: z.string().min(3, 'Nombre completo requerido'),
  cedula: z.string().length(10, 'Cédula debe tener 10 dígitos').regex(/^\d+$/, 'Solo números'),
  telefono: z.string().min(10, 'Teléfono inválido'),
  direccion: z.string().min(10, 'Dirección muy corta'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export const recoverPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RecoverPasswordFormData = z.infer<typeof recoverPasswordSchema>;
