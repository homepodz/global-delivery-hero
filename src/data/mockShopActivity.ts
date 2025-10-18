export const MOCK_CITIES = [
  { name: "Toronto", country: "Canada", lat: 43.65, lon: -79.38 },
  { name: "Riyadh", country: "Saudi Arabia", lat: 24.71, lon: 46.67 },
  { name: "Jeddah", country: "Saudi Arabia", lat: 21.54, lon: 39.17 },
  { name: "Ottawa", country: "Canada", lat: 45.42, lon: -75.69 },
  { name: "Montreal", country: "Canada", lat: 45.50, lon: -73.57 },
  { name: "Dubai", country: "UAE", lat: 25.20, lon: 55.27 },
  { name: "London", country: "UK", lat: 51.51, lon: -0.13 },
  { name: "Calgary", country: "Canada", lat: 51.05, lon: -114.07 },
  { name: "Vancouver", country: "Canada", lat: 49.28, lon: -123.12 },
];

export const MOCK_PRODUCTS = [
  "UGREEN Charger Robot",
  "ESR Pencil Pro",
  "GameSir X5 Lite",
  "Anker PowerCore",
  "Belkin USB-C Cable",
];

export const TOAST_VARIANTS = [
  { type: "view", templates: ["Just now • Someone in {city} viewed {product}", "Now • Browsing from {city}"] },
  { type: "cart", templates: ["{time} ago • {product} added to cart from {city}"] },
  { type: "delivered", templates: ["Delivered • Order #{orderId} arrived in {city}"] },
];

export function generateMockToast() {
  const city = MOCK_CITIES[Math.floor(Math.random() * MOCK_CITIES.length)];
  const product = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
  const variantType = Math.random() < 0.7 ? "view" : "cart"; // 70% views, 30% cart
  const variant = TOAST_VARIANTS.find(v => v.type === variantType)!;
  const template = variant.templates[Math.floor(Math.random() * variant.templates.length)];
  
  const time = Math.random() < 0.5 ? "Just now" : Math.floor(Math.random() * 5 + 1) + " min";
  
  return template
    .replace("{city}", city.name)
    .replace("{product}", product)
    .replace("{time}", time)
    .replace("{orderId}", "****" + Math.floor(Math.random() * 900 + 100));
}

export function getRandomCity() {
  return MOCK_CITIES[Math.floor(Math.random() * MOCK_CITIES.length)];
}
