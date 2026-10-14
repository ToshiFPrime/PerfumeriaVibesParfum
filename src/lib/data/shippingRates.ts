import { ShippingRate } from "@/types";

export const BOLIVIA_DEPARTMENTS: ShippingRate[] = [
  {
    department: "La Paz",
    city: "La Paz / El Alto",
    cost: 15,
    estimatedDays: "Mismo día o 24 hrs",
    freeShippingAbove: 350,
  },
  {
    department: "Santa Cruz",
    city: "Santa Cruz de la Sierra",
    cost: 25,
    estimatedDays: "24 a 48 hrs hábiles",
    freeShippingAbove: 400,
  },
  {
    department: "Cochabamba",
    city: "Cochabamba Cercado / Quillacollo",
    cost: 20,
    estimatedDays: "24 a 48 hrs hábiles",
    freeShippingAbove: 380,
  },
  {
    department: "Oruro",
    city: "Oruro Ciudad",
    cost: 20,
    estimatedDays: "24 a 48 hrs hábiles",
    freeShippingAbove: 380,
  },
  {
    department: "Potosí",
    city: "Potosí / Uyuni",
    cost: 25,
    estimatedDays: "48 hrs hábiles",
    freeShippingAbove: 400,
  },
  {
    department: "Chuquisaca",
    city: "Sucre",
    cost: 25,
    estimatedDays: "24 a 48 hrs hábiles",
    freeShippingAbove: 400,
  },
  {
    department: "Tarija",
    city: "Tarija / Yacuiba",
    cost: 25,
    estimatedDays: "48 hrs hábiles",
    freeShippingAbove: 400,
  },
  {
    department: "Beni",
    city: "Trinidad / Riberalta",
    cost: 35,
    estimatedDays: "48 a 72 hrs hábiles",
    freeShippingAbove: 450,
  },
  {
    department: "Pando",
    city: "Cobija",
    cost: 40,
    estimatedDays: "48 a 72 hrs hábiles",
    freeShippingAbove: 500,
  },
];

export const ACTIVE_COUPONS = [
  {
    code: "VIBES10",
    percentage: 10,
    description: "10% OFF de bienvenida en tu primera compra",
    minSubtotal: 100,
  },
  {
    code: "DECANTLOVER",
    percentage: 15,
    description: "15% OFF en selección de decants",
    minSubtotal: 150,
  },
  {
    code: "ENVIOVIP",
    percentage: 5,
    description: "Descuento especial de cortesía",
    minSubtotal: 200,
  },
];
