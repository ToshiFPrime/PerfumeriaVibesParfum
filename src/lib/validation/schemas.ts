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

export const brandAdminSchema = z.object({
  name: z.string().min(2, "El nombre de la marca debe tener al menos 2 caracteres").max(60),
  origin: z.string().min(2, "Indica el país de origen").default("Emiratos Árabes Unidos"),
  category: z.enum(["Árabe / Dubai", "Diseñador Lujo", "Nicho / Exclusivo"]),
  perfumesCount: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// Validación para creación y actualización de cupones
export const couponAdminSchema = z.object({
  code: z
    .string()
    .min(3, "El código debe tener al menos 3 caracteres")
    .max(20, "El código no debe exceder 20 caracteres")
    .transform((val) => val.trim().toUpperCase()),
  percentage: z
    .number()
    .min(1, "El descuento mínimo es 1%")
    .max(100, "El descuento no puede superar 100%"),
  description: z.string().min(5, "Ingresa una descripción del cupón"),
  minSubtotal: z.number().min(0, "El subtotal mínimo debe ser 0 o superior").default(0),
  isActive: z.boolean().default(true),
});

// Validación para movimiento y ajuste de kárdex / inventario
export const stockAdjustmentApiSchema = z.object({
  perfumeId: z.string().min(1, "ID de perfume requerido"),
  perfumeName: z.string().min(1, "Nombre del perfume requerido"),
  brand: z.string().min(1, "Marca requerida"),
  variantId: z.string().min(1, "ID de variante requerido"),
  variantLabel: z.string().min(1, "Etiqueta de variante requerida"),
  delta: z
    .number()
    .int()
    .refine((val) => val !== 0, "El ajuste de stock no puede ser cero"),
  previousStock: z.number().int().min(0),
  newStock: z.number().int().min(0),
  reason: z.enum([
    "rotura",
    "regalo_muestra",
    "venta_whatsapp",
    "reingreso_lote",
    "ajuste_inventario",
    "marcado_agotado",
    "baja_producto",
  ]),
  reasonLabel: z.string().min(2),
  notes: z.string().max(300).optional(),
  adminName: z.string().min(2).default("Administrador Vibes"),
});

// Validación para actualización de estado de orden y despacho
export const orderStatusUpdateSchema = z.object({
  orderId: z.string().min(1, "ID de orden requerido"),
  status: z.enum(["Pendiente", "Confirmado", "Enviado", "Entregado"]),
  courier: z.string().max(100).optional(),
  trackingNumber: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

// Validación para ajustes generales de la tienda (teléfonos, QR, banner)
export const adminSettingsSchema = z.object({
  whatsappLine1: z.string().min(8).max(15),
  whatsappLine2: z.string().min(8).max(15),
  bankName: z.string().min(2).max(100),
  accountHolder: z.string().min(2).max(100),
  accountNumber: z.string().min(4).max(50),
  freeShippingThreshold: z.number().min(0),
  announcementText: z.string().max(250),
  isAnnouncementActive: z.boolean(),
});

export type CustomerOrderFormData = z.infer<typeof customerOrderSchema>;
export type CustomerOrder = CustomerOrderFormData;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type BrandAdminFormData = z.infer<typeof brandAdminSchema>;
export type CouponAdminFormData = z.infer<typeof couponAdminSchema>;
export type StockAdjustmentApiData = z.infer<typeof stockAdjustmentApiSchema>;
export type OrderStatusUpdateData = z.infer<typeof orderStatusUpdateSchema>;
export type AdminSettingsFormData = z.infer<typeof adminSettingsSchema>;
