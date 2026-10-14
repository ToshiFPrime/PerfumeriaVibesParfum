export interface UserPreferences {
  fullName: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  preferredNumber: "65947174" | "65867500";
  preferredPayment: "QR Simple" | "Transferencia Bancaria" | "Contra Entrega";
  favoriteNotes: string[];
  wishlist: string[];
  saveOnCheckout: boolean;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  fullName: "",
  phone: "",
  department: "La Paz",
  city: "La Paz",
  address: "",
  preferredNumber: "65947174",
  preferredPayment: "QR Simple",
  favoriteNotes: [],
  wishlist: [],
  saveOnCheckout: true,
};
