import { z } from "zod";

// Validación de Checkout y datos del cliente (CIA: Integridad)
export const customerOrderSchema = z.object({
  fullName: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres")
    .max(100, "Nombre demasiado largo"),
  phone: z
    .string()
    .min(8, "Ingresa un número de celular válido (mínimo 8 dígitos)")
    .max(15, "Número demasiado largo")
    .regex(/^[0-9+\s-]+$/, "El formato de teléfono no es válido"),
  department: z.string().min(2, "Selecciona un departamento de envío"),
  city: z.string().min(2, "Ingresa tu ciudad o localidad"),
  address: z
    .string()
    .min(5, "Ingresa una dirección detallada para la entrega")
    .max(200, "Dirección demasiado larga"),
  notes: z.string().max(300, "La nota no puede exceder 300 caracteres").optional(),
  preferredWhatsAppNumber: z.enum(["65947174", "65867500"]).default("65947174"),
});

// Validación para creación de Reseña
export const reviewSchema = z.object({
  productId: z.string().min(1, "ID de producto requerido"),
  authorName: z
    .string()
    .min(2, "Ingresa tu nombre o alias")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  rating: z
    .number()
    .min(1, "La calificación mínima es 1 estrella")
    .max(5, "La calificación máxima es 5 estrellas"),
  comment: z
    .string()
    .min(10, "Tu reseña debe tener al menos 10 caracteres para ayudar a otros clientes")
    .max(500, "La reseña no puede exceder 500 caracteres"),
});

// Validación para formulario de Contacto
export const contactFormSchema = z.object({
  name: z.string().min(2, "Por favor ingresa tu nombre"),
  email: z.string().email("Ingresa un correo electrónico válido").optional().or(z.literal("")),
  phone: z.string().min(8, "Ingresa un número de teléfono válido (mínimo 8 dígitos)"),
  subject: z.string().min(3, "Indica el asunto de tu consulta"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

// Validación para aplicación de cupón
export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Código de cupón inválido")
    .max(20, "Código demasiado largo")
    .toUpperCase(),
});

export type CustomerOrderFormData = z.infer<typeof customerOrderSchema>;
export type CustomerOrder = CustomerOrderFormData;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
