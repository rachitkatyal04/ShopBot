import axios from "axios";

// Use API URL from environment variables with fallback to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Log the API URL in development but not in production
if (process.env.NODE_ENV !== "production") {
  console.log(`Using API URL: ${API_URL}`);
}

// Public API instance (never sends auth headers)
const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Changed to false to avoid CORS preflight issues
});

// Authenticated API instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Changed to false to avoid CORS preflight issues
});

// Define product interface for proper typing
interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

// Define category interface
interface Category {
  id: number;
  name: string;
  slug: string;
}

// Add token to requests if available (client-side only)
// Only for endpoints that require authentication
if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    // List of endpoints that don't require authentication
    const publicEndpoints = [
      "/products/",
      "/categories/",
      "/products/search/",
      "/products/recommended/",
    ];

    // Check if this is a public endpoint
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    // Only add auth header for non-public endpoints
    if (!isPublicEndpoint) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  });

  // Handle token expiration
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear invalid tokens
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
      return Promise.reject(error);
    }
  );
}

// Mock categories for fallback
const mockCategories: Category[] = [
  { id: 1, name: "Electronics", slug: "electronics" },
  { id: 2, name: "Clothing", slug: "clothing" },
  { id: 3, name: "Home & Kitchen", slug: "home-kitchen" },
  { id: 4, name: "Books", slug: "books" },
  { id: 5, name: "Sports & Outdoors", slug: "sports-outdoors" },
  { id: 6, name: "Beauty & Personal Care", slug: "beauty-personal-care" },
  { id: 7, name: "Toys & Games", slug: "toys-games" },
  { id: 8, name: "Health & Wellness", slug: "health-wellness" },
];

// Mock product data for fallback
const mockProducts: Product[] = [
  // Smartphones
  {
    id: 101,
    slug: "eat-smartphone",
    name: "Eat Smartphone",
    description:
      "A high-end smartphone with incredible performance, stunning camera, and all-day battery life.",
    price: 799.99,
    image_url:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
    stock: 15,
    category: { id: 1, name: "Electronics", slug: "electronics" },
  },
  {
    id: 102,
    slug: "bill-smartphone",
    name: "Bill Smartphone",
    description:
      "The latest model with advanced AI features and a brilliant OLED display.",
    price: 699.99,
    image_url:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    stock: 8,
    category: { id: 1, name: "Electronics", slug: "electronics" },
  },
  {
    id: 103,
    slug: "premium-phone-x",
    name: "Premium Phone X",
    description:
      "Our flagship model with revolutionary features, water resistance, and an unmatched camera system.",
    price: 899.99,
    image_url:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
    stock: 5,
    category: { id: 1, name: "Electronics", slug: "electronics" },
  },
  // Laptops
  {
    id: 201,
    slug: "with-laptop",
    name: "With Laptop",
    description:
      "Powerful productivity laptop with the latest processor, ample RAM, and fast SSD storage.",
    price: 1299.99,
    image_url:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    stock: 10,
    category: { id: 1, name: "Electronics", slug: "electronics" },
  },
  {
    id: 202,
    slug: "resource-laptop",
    name: "Resource Laptop",
    description:
      "Perfect balance of performance and battery life for students and professionals.",
    price: 999.99,
    image_url:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop",
    stock: 12,
    category: { id: 1, name: "Electronics", slug: "electronics" },
  },
  {
    id: 203,
    slug: "ultra-book-pro",
    name: "Ultra Book Pro",
    description:
      "Ultra-thin, ultra-powerful laptop with premium build quality and stunning display.",
    price: 1499.99,
    image_url:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
    stock: 3,
    category: { id: 1, name: "Electronics", slug: "electronics" },
  },
  // Smartwatches
  {
    id: 301,
    slug: "accept-smartwatch",
    name: "Accept Smartwatch",
    description:
      "Track your fitness goals and stay connected with this advanced smartwatch.",
    price: 299.99,
    image_url:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop",
    stock: 20,
    category: { id: 1, name: "Electronics", slug: "electronics" },
  },
  {
    id: 302,
    slug: "on-smartwatch",
    name: "On Smartwatch",
    description:
      "Feature-packed smartwatch with health monitoring and smart notifications.",
    price: 249.99,
    image_url:
      "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=400&h=400&fit=crop",
    stock: 15,
    category: { id: 1, name: "Electronics", slug: "electronics" },
  },
  {
    id: 303,
    slug: "blood-smartwatch",
    name: "Blood Smartwatch",
    description:
      "Advanced health tracking with blood oxygen and ECG monitoring in an elegant design.",
    price: 349.99,
    image_url:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
    stock: 7,
    category: { id: 1, name: "Electronics", slug: "electronics" },
  },
  // Clothing
  {
    id: 401,
    slug: "premium-t-shirt",
    name: "Premium T-Shirt",
    description: "Comfortable, stylish t-shirt made from 100% organic cotton.",
    price: 29.99,
    image_url:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    stock: 50,
    category: { id: 2, name: "Clothing", slug: "clothing" },
  },
  {
    id: 402,
    slug: "designer-jeans",
    name: "Designer Jeans",
    description: "High-quality denim jeans with perfect fit and durability.",
    price: 89.99,
    image_url:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop",
    stock: 30,
    category: { id: 2, name: "Clothing", slug: "clothing" },
  },
  {
    id: 403,
    slug: "casual-jacket",
    name: "Casual Jacket",
    description:
      "Versatile jacket perfect for any casual occasion, with water-resistant fabric.",
    price: 129.99,
    image_url:
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&h=400&fit=crop",
    stock: 18,
    category: { id: 2, name: "Clothing", slug: "clothing" },
  },
  // Home & Kitchen
  {
    id: 501,
    slug: "coffee-maker-deluxe",
    name: "Coffee Maker Deluxe",
    description:
      "Premium coffee maker with timer, multiple brewing options, and thermal carafe.",
    price: 129.99,
    image_url:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
    stock: 8,
    category: { id: 3, name: "Home & Kitchen", slug: "home-kitchen" },
  },
  {
    id: 502,
    slug: "chef-knife-set",
    name: "Chef Knife Set",
    description:
      "Professional-grade 5-piece knife set for all your culinary needs.",
    price: 199.99,
    image_url:
      "https://images.unsplash.com/photo-1566454419290-57a0589c9c51?w=400&h=400&fit=crop",
    stock: 7,
    category: { id: 3, name: "Home & Kitchen", slug: "home-kitchen" },
  },
  {
    id: 503,
    slug: "blender-pro",
    name: "Blender Pro",
    description:
      "High-powered blender for smoothies, soups, and sauces with multiple speed settings.",
    price: 89.99,
    image_url:
      "https://images.unsplash.com/photo-1595359026553-0748142565d3?w=400&h=400&fit=crop",
    stock: 12,
    category: { id: 3, name: "Home & Kitchen", slug: "home-kitchen" },
  },
  // Books
  {
    id: 601,
    slug: "mystery-thriller",
    name: "The Silent Witness",
    description:
      "A gripping mystery thriller that will keep you on the edge of your seat until the very last page.",
    price: 14.99,
    image_url:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    stock: 25,
    category: { id: 4, name: "Books", slug: "books" },
  },
  {
    id: 602,
    slug: "self-improvement",
    name: "Mindful Living",
    description:
      "A practical guide to mindfulness and personal growth that will transform your daily life.",
    price: 19.99,
    image_url:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    stock: 18,
    category: { id: 4, name: "Books", slug: "books" },
  },
  {
    id: 603,
    slug: "fantasy-adventure",
    name: "Realm of Dragons",
    description:
      "An epic fantasy adventure set in a richly imagined world filled with magic and mythical creatures.",
    price: 24.99,
    image_url:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop",
    stock: 15,
    category: { id: 4, name: "Books", slug: "books" },
  },
  // Sports & Outdoors
  {
    id: 701,
    slug: "yoga-mat-premium",
    name: "Premium Yoga Mat",
    description:
      "Non-slip, eco-friendly yoga mat with perfect cushioning for all types of yoga practice.",
    price: 49.99,
    image_url:
      "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400&h=400&fit=crop",
    stock: 22,
    category: { id: 5, name: "Sports & Outdoors", slug: "sports-outdoors" },
  },
  {
    id: 702,
    slug: "hiking-backpack",
    name: "Explorer Hiking Backpack",
    description:
      "Durable, waterproof hiking backpack with multiple compartments and comfortable padded straps.",
    price: 79.99,
    image_url:
      "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=400&fit=crop",
    stock: 14,
    category: { id: 5, name: "Sports & Outdoors", slug: "sports-outdoors" },
  },
  {
    id: 703,
    slug: "fitness-tracker-elite",
    name: "Fitness Tracker Elite",
    description:
      "Advanced fitness tracker with heart rate monitoring, GPS, and workout analytics.",
    price: 129.99,
    image_url:
      "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=400&h=400&fit=crop",
    stock: 8,
    category: { id: 5, name: "Sports & Outdoors", slug: "sports-outdoors" },
  },
  // Beauty & Personal Care
  {
    id: 801,
    slug: "skincare-set",
    name: "Complete Skincare Set",
    description:
      "All-in-one skincare set with cleanser, toner, moisturizer, and serum for glowing skin.",
    price: 69.99,
    image_url:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
    stock: 17,
    category: {
      id: 6,
      name: "Beauty & Personal Care",
      slug: "beauty-personal-care",
    },
  },
  {
    id: 802,
    slug: "luxury-perfume",
    name: "Midnight Bloom Perfume",
    description:
      "Luxurious fragrance with notes of jasmine, vanilla, and sandalwood for a captivating scent.",
    price: 89.99,
    image_url:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    stock: 12,
    category: {
      id: 6,
      name: "Beauty & Personal Care",
      slug: "beauty-personal-care",
    },
  },
  {
    id: 803,
    slug: "hair-styling-kit",
    name: "Professional Hair Styling Kit",
    description:
      "Complete hair styling kit with hairdryer, straightener, and curling wand for salon-quality results.",
    price: 149.99,
    image_url:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    stock: 9,
    category: {
      id: 6,
      name: "Beauty & Personal Care",
      slug: "beauty-personal-care",
    },
  },
  // Toys & Games
  {
    id: 901,
    slug: "building-blocks-set",
    name: "Creative Building Blocks",
    description:
      "500-piece building block set to stimulate creativity and imagination in children of all ages.",
    price: 34.99,
    image_url:
      "https://images.unsplash.com/photo-1558060370-d644485927b3?w=400&h=400&fit=crop",
    stock: 23,
    category: { id: 7, name: "Toys & Games", slug: "toys-games" },
  },
  {
    id: 902,
    slug: "board-game-collection",
    name: "Family Board Game Collection",
    description:
      "Set of 5 classic board games for family game night entertainment.",
    price: 59.99,
    image_url:
      "https://images.unsplash.com/photo-1585504198199-20277593b94f?w=400&h=400&fit=crop",
    stock: 16,
    category: { id: 7, name: "Toys & Games", slug: "toys-games" },
  },
  {
    id: 903,
    slug: "remote-control-car",
    name: "High-Speed RC Car",
    description:
      "Remote-controlled car with high-speed motors, durable design, and long battery life.",
    price: 79.99,
    image_url:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop",
    stock: 11,
    category: { id: 7, name: "Toys & Games", slug: "toys-games" },
  },
  // Health & Wellness
  {
    id: 1001,
    slug: "vitamin-supplements",
    name: "Complete Vitamin Pack",
    description:
      "30-day supply of essential vitamins and minerals for overall health and wellbeing.",
    price: 39.99,
    image_url:
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=400&h=400&fit=crop",
    stock: 28,
    category: { id: 8, name: "Health & Wellness", slug: "health-wellness" },
  },
  {
    id: 1002,
    slug: "massage-therapy-device",
    name: "Deep Tissue Massage Device",
    description:
      "Professional-grade massage therapy device with multiple attachments for muscle relief.",
    price: 129.99,
    image_url:
      "https://images.unsplash.com/photo-1626170733248-0fa8ed0a214c?w=400&h=400&fit=crop",
    stock: 13,
    category: { id: 8, name: "Health & Wellness", slug: "health-wellness" },
  },
  {
    id: 1003,
    slug: "organic-superfood-blend",
    name: "Organic Superfood Blend",
    description:
      "Nutrient-rich superfood powder blend with fruits, vegetables, and antioxidants.",
    price: 49.99,
    image_url:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
    stock: 19,
    category: { id: 8, name: "Health & Wellness", slug: "health-wellness" },
  },
];

// Category-specific image URLs for related products
const categoryImages = {
  electronics: {
    smartphones: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&h=400&fit=crop",
    ],
    laptops: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop",
    ],
    smartwatches: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    ],
  },
  clothing: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1542060748-10c28b62716f?w=400&h=400&fit=crop",
  ],
  homeKitchen: [
    "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1566454419290-57a0589c9c51?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1586158291800-2665f07bba79?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1595359026553-0748142565d3?w=400&h=400&fit=crop",
  ],
  books: [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=400&h=400&fit=crop",
  ],
  sportsOutdoors: [
    "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1591291621086-2ba81a536385?w=400&h=400&fit=crop",
  ],
  beautyPersonalCare: [
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1571646034647-52e6ea84b28c?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
  ],
  toysGames: [
    "https://images.unsplash.com/photo-1558060370-d644485927b3?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1585504198199-20277593b94f?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=400&fit=crop",
  ],
  healthWellness: [
    "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1626170733248-0fa8ed0a214c?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1604480132736-44c188fe4d20?w=400&h=400&fit=crop",
  ],
};

// Helper function to get a related image for a product based on category and subcategory
function getRelatedProductImage(
  category: Product["category"],
  productId: number
): string {
  let imagePool: string[] = [];

  // Determine which image pool to use based on category and id range
  if (category.slug === "electronics" || category.id === 1) {
    if (productId >= 100 && productId < 200) {
      imagePool = categoryImages.electronics.smartphones;
    } else if (productId >= 200 && productId < 300) {
      imagePool = categoryImages.electronics.laptops;
    } else if (productId >= 300 && productId < 400) {
      imagePool = categoryImages.electronics.smartwatches;
    } else {
      // Fallback to laptops if we can't determine subcategory
      imagePool = categoryImages.electronics.laptops;
    }
  } else if (category.slug === "clothing" || category.id === 2) {
    imagePool = categoryImages.clothing;
  } else if (category.slug === "home-kitchen" || category.id === 3) {
    imagePool = categoryImages.homeKitchen;
  } else if (category.slug === "books" || category.id === 4) {
    imagePool = categoryImages.books;
  } else if (category.slug === "sports-outdoors" || category.id === 5) {
    imagePool = categoryImages.sportsOutdoors;
  } else if (category.slug === "beauty-personal-care" || category.id === 6) {
    imagePool = categoryImages.beautyPersonalCare;
  } else if (category.slug === "toys-games" || category.id === 7) {
    imagePool = categoryImages.toysGames;
  } else if (category.slug === "health-wellness" || category.id === 8) {
    imagePool = categoryImages.healthWellness;
  } else {
    // If we can't determine category, use a consistent fallback
    const allImages = [
      ...categoryImages.electronics.smartphones,
      ...categoryImages.electronics.laptops,
      ...categoryImages.clothing,
      ...categoryImages.homeKitchen,
      ...categoryImages.books,
      ...categoryImages.sportsOutdoors,
      ...categoryImages.beautyPersonalCare,
      ...categoryImages.toysGames,
      ...categoryImages.healthWellness,
    ];
    imagePool = allImages;
  }

  // Use productId to consistently select an image from the pool
  const index = productId % imagePool.length;
  return imagePool[index];
}

// Use public API for public endpoints with fallback to mock if necessary
export const fetchProducts = async (params = {}) => {
  try {
    const response = await publicApi.get("/products/", { params });
    return response.data;
  } catch (error) {
    console.log("Using mock product data due to API unavailability");
    // If network error or server not available, return mock data
    if (
      axios.isAxiosError(error) &&
      (error.message.includes("Network Error") || !error.response)
    ) {
      console.log("Serving mock product data");
      // Generate 100 products by duplicating our mocks with different IDs
      const extendedMockProducts: Product[] = [];
      const numberOfSets = Math.ceil(100 / mockProducts.length);

      for (let i = 0; i < numberOfSets; i++) {
        mockProducts.forEach((product) => {
          // If we already have 100 products, stop adding more
          if (extendedMockProducts.length >= 100) return;

          const newId = 1000 * i + product.id;

          // Create a copy with a new ID
          extendedMockProducts.push({
            ...product,
            id: newId,
            name: i === 0 ? product.name : `${product.name} ${i + 1}`,
            slug: i === 0 ? product.slug : `${product.slug}-${i + 1}`,
            image_url: getRelatedProductImage(product.category, newId),
          });
        });
      }
      return extendedMockProducts;
    }
    throw error;
  }
};

export const fetchProduct = async (slug: string) => {
  try {
    const response = await publicApi.get(`/products/${slug}/`);
    return response.data;
  } catch (error) {
    console.log(
      `Using mock data for product ${slug} due to API unavailability`
    );
    // If network error or server not available, return mock data
    if (
      axios.isAxiosError(error) &&
      (error.message.includes("Network Error") || !error.response)
    ) {
      // Check in both original and extended mocks
      // First check original mocks
      const mockProduct = mockProducts.find((p) => p.slug === slug);
      if (mockProduct) return mockProduct;

      // Then check for generated mock variants with suffixes
      const baseName = slug.replace(/-\d+$/, "");
      const extendedMock = mockProducts.find((p) => p.slug === baseName);
      if (extendedMock) {
        const suffix = slug.match(/-(\d+)$/);
        const iteration = suffix ? parseInt(suffix[1]) - 1 : 0;
        const newId = 1000 * iteration + extendedMock.id;

        return {
          ...extendedMock,
          id: newId,
          name:
            iteration === 0
              ? extendedMock.name
              : `${extendedMock.name} ${iteration + 1}`,
          slug: slug,
          image_url: getRelatedProductImage(extendedMock.category, newId),
        };
      }

      // If no match found, return the first product as fallback
      return {
        ...mockProducts[0],
        slug: slug,
        name: `Product ${slug}`,
        image_url: getRelatedProductImage(
          mockProducts[0].category,
          parseInt(slug.replace(/[^\d]/g, "")) || 101
        ),
      };
    }
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await publicApi.get("/categories/");
    return response.data;
  } catch (error) {
    console.log("Using mock category data due to API unavailability");
    // If network error or server not available, return mock data
    if (
      axios.isAxiosError(error) &&
      (error.message.includes("Network Error") || !error.response)
    ) {
      return mockCategories;
    }
    throw error;
  }
};

export const searchProducts = async (query: string) => {
  try {
    const response = await publicApi.get(`/products/search/?q=${query}`);
    return response.data;
  } catch (error) {
    console.log(`Using mock search for "${query}" due to API unavailability`);
    // If network error or server not available, search in mock data
    if (
      axios.isAxiosError(error) &&
      (error.message.includes("Network Error") || !error.response)
    ) {
      const lowerQuery = query.toLowerCase();

      // Generate extended mock products first
      const extendedMockProducts: Product[] = [];
      const numberOfSets = Math.ceil(100 / mockProducts.length);

      for (let i = 0; i < numberOfSets; i++) {
        mockProducts.forEach((product) => {
          // If we already have 100 products, stop adding more
          if (extendedMockProducts.length >= 100) return;

          const newId = 1000 * i + product.id;

          // Create a copy with a new ID
          extendedMockProducts.push({
            ...product,
            id: newId,
            name: i === 0 ? product.name : `${product.name} ${i + 1}`,
            slug: i === 0 ? product.slug : `${product.slug}-${i + 1}`,
            image_url: getRelatedProductImage(product.category, newId),
          });
        });
      }

      // Then filter the extended products
      return extendedMockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)
      );
    }
    throw error;
  }
};

// Modified chat API functions with better error handling
export const fetchChatSessions = async () => {
  try {
    const response = await api.get("/chat-sessions/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chat sessions:", error);
    throw error;
  }
};

export const fetchChatHistory = async () => {
  try {
    const response = await api.get("/chat-sessions/history/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    throw error;
  }
};

export const deleteChatSession = async (sessionId: number) => {
  try {
    const response = await api.delete(`/chat-sessions/${sessionId}/`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete chat session ${sessionId}:`, error);
    throw error;
  }
};

export const createChatSession = async () => {
  try {
    const response = await api.post("/chat-sessions/");
    return response.data;
  } catch (error) {
    console.error("Failed to create chat session:", error);
    throw error;
  }
};

export const sendChatMessage = async (sessionId: number, message: string) => {
  try {
    const response = await api.post(
      `/chat-sessions/${sessionId}/send_message/`,
      {
        message,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send chat message:", error);
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    console.log("Login attempt with:", { email });

    // For Django JWT login, we need to use the username field
    const loginData = {
      username: email, // This could be email or username
      password: password,
    };

    // Try the API token endpoint
    try {
      const response = await publicApi.post("/token/", loginData);

      if (response.data.access && typeof window !== "undefined") {
        // JWT tokens received, store them (only in browser)
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh || "");
        return response.data;
      }
    } catch (tokenError) {
      console.error("Token endpoint login failed:", tokenError);

      // If that fails, try alternative username format
      // (username might be required to be the part before @ in email)
      if (email.includes("@")) {
        try {
          const usernameLoginData = {
            username: email.split("@")[0],
            password: password,
          };

          const usernameResponse = await publicApi.post(
            "/token/",
            usernameLoginData
          );

          if (usernameResponse.data.access && typeof window !== "undefined") {
            // Store tokens (only in browser)
            localStorage.setItem("token", usernameResponse.data.access);
            localStorage.setItem(
              "refreshToken",
              usernameResponse.data.refresh || ""
            );
            return usernameResponse.data;
          }
        } catch (usernameError) {
          console.error("Username login failed:", usernameError);
          throw usernameError;
        }
      } else {
        // If not an email, rethrow the original error
        throw tokenError;
      }
    }

    throw new Error("Unable to authenticate with the provided credentials");
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const register = async (userData: any) => {
  try {
    console.log("Registration data:", JSON.stringify(userData));

    // Format data according to what Django expects
    // Based on UserSerializer in the backend
    const formattedData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      profile: {}, // Empty profile as it's created via signal in the backend
    };

    // Call the API but don't store tokens - user needs to log in separately
    const response = await publicApi.post("/register/", formattedData);
    return response.data;
  } catch (error: any) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = async () => {
  let refreshToken;
  let token;
  if (typeof window !== "undefined") {
    refreshToken = localStorage.getItem("refreshToken");
    token = localStorage.getItem("token");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  }

  try {
    // Include the Authorization header with the token
    return await axios.post(
      `${API_URL}/logout/`,
      { refresh: refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
    // Even if the logout API fails, we've already removed the tokens from localStorage
    // So the user is effectively logged out on the client side
    return { success: true, client_only: true };
  }
};

export const checkAuth = async () => {
  // Make sure we're in the browser environment
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }

    // Try to access a protected endpoint that requires authentication
    const response = await api.get("/profile/");
    return true;
  } catch (error: any) {
    console.error("Authentication check failed:", error);

    // Clean up invalid tokens
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
    return false;
  }
};

export default api;
