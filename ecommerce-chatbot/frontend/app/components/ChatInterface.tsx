"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ProductCard from "./ProductCard";
import ChatHistory from "./ChatHistory";
import {
  createChatSession,
  sendChatMessage,
  fetchChatHistory,
  deleteChatSession,
} from "../lib/api";

// Define message type
interface ChatMessageType {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  hasProducts?: boolean;
  productData?: Product[];
}

interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock: number;
}

// Initial welcome message
const initialMessage: ChatMessageType = {
  id: 0,
  role: "assistant",
  content:
    "Hello! I'm your shopping assistant. How can I help you today? You can ask me to search for products, show categories, or help with your order.",
  timestamp: new Date().toISOString(),
};

// Mock product database for fallback mode
const mockProductDatabase = {
  // Electronics subcategories
  smartphones: [
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
  ],
  laptops: [
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
  ],
  smartwatches: [
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
  ],
  // Other categories
  clothing: [
    {
      id: 401,
      slug: "premium-t-shirt",
      name: "Premium T-Shirt",
      description:
        "Comfortable, stylish t-shirt made from 100% organic cotton.",
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
  ],
  "home-kitchen": [
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
  ],
  books: [
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
  ],
  "sports-outdoors": [
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
  ],
  "beauty-personal-care": [
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
  ],
  "toys-games": [
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
  ],
  "health-wellness": [
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
  ],
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([initialMessage]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [lastShownProductCategory, setLastShownProductCategory] = useState<
    string | null
  >(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // First try the standard approach
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Then also use direct DOM manipulation as a backup
    const chatContainer = document.getElementById("chat-messages-container");
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Additional useEffect to handle scrolling when products change
  useEffect(() => {
    if (showProducts) {
      scrollToBottom();
    }
  }, [showProducts, products]);

  // Create a chat session when the component mounts
  useEffect(() => {
    const initSession = async () => {
      try {
        // Don't try to use the real API if we're in mock mode
        if (typeof window !== "undefined" && !localStorage.getItem("token")) {
          console.log("Using mock mode for chat (no authentication)");
          setSessionId(999); // Use a dummy session ID for mock mode
          return;
        }

        const session = await createChatSession();
        setSessionId(session.id);
      } catch (error) {
        console.error("Failed to create chat session:", error);
        // Fall back to mock mode if API fails
        setSessionId(999); // Use a dummy session ID
      }
    };

    // Try to create a session regardless of auth status
    initSession();
  }, []);

  // Add effect to clear products when a new message is added
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    // If the last message has specific products, make sure only those are shown
    if (lastMessage && lastMessage.hasProducts && lastMessage.productData) {
      setProducts(lastMessage.productData);
      setShowProducts(true);
    }
  }, [messages]);

  // Check if user is authenticated on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    }
  }, []);

  const extractProductsFromMessage = (content: string): Product[] => {
    // This is a simple implementation that looks for product information in the message
    // Format we're looking for: "- Product Name: $price (stock in stock)"
    const productRegex = /- ([^:]+): \$(\d+\.\d+) \((\d+) in stock\)/g;
    const extractedProducts: Product[] = [];
    let match;
    let id = 1;

    while ((match = productRegex.exec(content)) !== null) {
      const [, name, price, stock] = match;
      extractedProducts.push({
        id: id++,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        description: `${name} - Available in our store.`,
        price: parseFloat(price),
        image_url: `https://source.unsplash.com/random/300x300/?${name
          .split(" ")[0]
          .toLowerCase()}`,
        stock: parseInt(stock, 10),
      });
    }

    return extractedProducts;
  };

  // Function to find a specific product by name (case insensitive partial match)
  const findProductByName = (productName: string): Product | null => {
    const searchTerm = productName.toLowerCase();

    // Check all product categories
    for (const category in mockProductDatabase) {
      const products =
        mockProductDatabase[category as keyof typeof mockProductDatabase];

      // Look for a match in this category
      const foundProduct = products.find(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          searchTerm.includes(product.name.toLowerCase())
      );

      if (foundProduct) {
        return foundProduct;
      }
    }

    return null;
  };

  // Delete a chat session
  const handleDeleteSession = async (
    sessionToDelete: number
  ): Promise<void> => {
    try {
      await deleteChatSession(sessionToDelete);
      // If the user deletes the current session, reset to a new one
      if (sessionToDelete === sessionId) {
        handleNewChat();
      }
    } catch (error) {
      console.error("Failed to delete chat session:", error);
      throw error;
    }
  };

  // Load a previous chat session
  const loadChatSession = async (sessionId: number) => {
    try {
      setIsLoading(true);

      // Get the session data with its messages
      const response = await fetchChatHistory();
      const session = response.find((s: any) => s.id === sessionId);

      if (session && session.messages && session.messages.length > 0) {
        // Format messages to match the ChatMessageType interface
        const formattedMessages = session.messages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          hasProducts: false, // Reset product display
          productData: [],
        }));

        // Set the messages and session ID
        setMessages(formattedMessages);
        setSessionId(sessionId);
        setShowChatHistory(false); // Hide chat history after selection

        // Clear any products being displayed
        setProducts([]);
        setShowProducts(false);
      }
    } catch (error) {
      console.error("Failed to load chat session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle chat history visibility
  const toggleChatHistory = () => {
    setShowChatHistory(!showChatHistory);
  };

  // Create a new chat session
  const handleNewChat = async () => {
    // Create a new unique welcome message to prevent duplicates
    const newWelcomeMessage: ChatMessageType = {
      id: Date.now(),
      role: "assistant",
      content:
        "Hello! I'm ShopBot, your shopping assistant. How can I help you today? You can ask me to search for products, show categories, or help with your order.",
      timestamp: new Date().toISOString(),
    };

    // Only set the single welcome message
    setMessages([newWelcomeMessage]);
    setShowProducts(false);
    setProducts([]);
    setLastShownProductCategory(null);
    setShowChatHistory(false);
    setIsLoading(true);

    try {
      // Check if we're in mock mode (no authentication)
      if (typeof window !== "undefined" && !localStorage.getItem("token")) {
        console.log("Using mock mode for new chat (no authentication)");
        setSessionId(999); // Use a dummy session ID for mock mode
        setIsLoading(false);
        return;
      }

      // Try to create a new session
      const session = await createChatSession();
      setSessionId(session.id);
    } catch (error) {
      console.error("Failed to create new chat session:", error);
      setSessionId(999); // Use a dummy session ID for fallback mode
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Clear products from ALL previous messages
    // This ensures only the latest message shows products
    setMessages((prevMessages) =>
      prevMessages.map((msg) => ({
        ...msg,
        hasProducts: false,
        productData: [],
      }))
    );

    // Check if this is a detail request
    const isDetailRequest =
      inputValue.toLowerCase().includes("detail") ||
      inputValue.toLowerCase().includes("about") ||
      inputValue.toLowerCase().includes("more information") ||
      inputValue.toLowerCase().includes("tell me more");

    // If this is a detail request, reset global product state
    if (isDetailRequest) {
      setShowProducts(false);
      setProducts([]);
    }

    // Add user message to UI immediately
    const userMessage: ChatMessageType = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    // Include product information with the message if products are shown
    const messageWithProduct = showProducts
      ? { ...userMessage, hasProducts: true, productData: products }
      : userMessage;

    setMessages((prev) => [...prev, messageWithProduct]);
    const userQuery = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Only try to use the real API if we have a valid session ID (not our mock ID)
      if (sessionId && sessionId !== 999) {
        try {
          // Send message to API and get response
          const chatMessages = await sendChatMessage(sessionId, userQuery);

          // Get the latest assistant message
          const assistantMessage = chatMessages.find(
            (msg: any) => msg.role === "assistant" && msg.content
          );

          if (assistantMessage) {
            // Clear products from ALL previous messages
            // This ensures only the latest message shows products
            setMessages((prev) =>
              prev.map((msg) => ({
                ...msg,
                hasProducts: false,
                productData: [],
              }))
            );

            // Add assistant message to UI
            const botResponse: ChatMessageType = {
              id: assistantMessage.id || Date.now() + 1,
              role: "assistant",
              content: assistantMessage.content,
              timestamp: assistantMessage.timestamp || new Date().toISOString(),
            };

            // Check if the message contains product information
            const extractedProducts = extractProductsFromMessage(
              assistantMessage.content
            );

            // If this is a detail request about a specific product, look for product mentions
            if (
              userQuery.toLowerCase().includes("detail") ||
              userQuery.toLowerCase().includes("about") ||
              userQuery.toLowerCase().includes("tell me more") ||
              userQuery.toLowerCase().includes("more information")
            ) {
              // Try to find which specific product is being asked about
              let specificProduct: Product | null = null;

              // Check if the response mentions a specific product
              for (const category in mockProductDatabase) {
                const products =
                  mockProductDatabase[
                    category as keyof typeof mockProductDatabase
                  ];
                for (const product of products) {
                  // Check both user query and assistant response for product name
                  if (
                    assistantMessage.content.includes(product.name) ||
                    userQuery.toLowerCase().includes(product.name.toLowerCase())
                  ) {
                    specificProduct = product;
                    break;
                  }
                }
                if (specificProduct) break;
              }

              // If we found a specific product, use that instead of extracted products
              if (specificProduct) {
                console.log(
                  `API path: Found specific product ${specificProduct.name} for detail request`
                );

                const botResponseWithProduct = {
                  ...botResponse,
                  hasProducts: true,
                  productData: [specificProduct], // Just this one product
                };
                setMessages((prev) => [...prev, botResponseWithProduct]);

                // Make sure we're ONLY showing this specific product
                setProducts([specificProduct]);
                setShowProducts(true);

                return; // Exit early
              }
            }

            const botResponseWithProducts =
              extractedProducts.length > 0
                ? {
                    ...botResponse,
                    hasProducts: true,
                    productData: extractedProducts,
                  }
                : botResponse;

            setMessages((prev) => [...prev, botResponseWithProducts]);

            if (extractedProducts.length > 0) {
              setProducts(extractedProducts);
              setShowProducts(true);
            }
          }
          return; // Exit if API call was successful
        } catch (error) {
          console.error("API call failed, falling back to mock mode:", error);
          // Continue to fallback mode
        }
      }

      // Fallback mode - simple keyword-based responses
      setTimeout(() => {
        let responseContent = "";
        const query = userQuery.toLowerCase().trim();
        let shouldShowProducts = false;
        let productsToShow: Product[] = [];

        console.log("Processing query:", query); // For debugging

        // Handle "show me X" pattern explicitly
        if (
          query === "show me phones" ||
          query === "show phones" ||
          query === "show me smartphones"
        ) {
          responseContent =
            "Here are some smartphone products I found for you:\n- Eat Smartphone: $799.99 (15 in stock)\n- Bill Smartphone: $699.99 (8 in stock)\n- Premium Phone X: $899.99 (5 in stock)\n\nWould you like more details on any of these?";
          shouldShowProducts = true;
          productsToShow = mockProductDatabase.smartphones;
        } else if (
          query === "show me laptops" ||
          query === "show laptops" ||
          query === "show me computers"
        ) {
          responseContent =
            "Here are some laptop products I found for you:\n- With Laptop: $1299.99 (10 in stock)\n- Resource Laptop: $999.99 (12 in stock)\n- Ultra Book Pro: $1499.99 (3 in stock)\n\nWould you like more details on any of these?";
          shouldShowProducts = true;
          productsToShow = mockProductDatabase.laptops;
        } else if (
          query === "show me watches" ||
          query === "show watches" ||
          query === "show me smartwatches"
        ) {
          responseContent =
            "Here are some smartwatch products I found for you:\n- Accept Smartwatch: $299.99 (20 in stock)\n- On Smartwatch: $249.99 (15 in stock)\n- Blood Smartwatch: $349.99 (7 in stock)\n\nWould you like more details on any of these?";
          shouldShowProducts = true;
          productsToShow = mockProductDatabase.smartwatches;
        } else if (
          query === "show me clothing" ||
          query === "show clothing" ||
          query === "show me clothes"
        ) {
          responseContent =
            "Here are some clothing products I found for you:\n- Premium T-Shirt: $29.99 (50 in stock)\n- Designer Jeans: $89.99 (30 in stock)\n- Casual Jacket: $129.99 (18 in stock)\n\nWould you like more details on any of these?";
          shouldShowProducts = true;
          productsToShow = mockProductDatabase.clothing;
        } else if (
          query === "show me home" ||
          query === "show home" ||
          query === "show me kitchen" ||
          query === "show kitchen" ||
          query === "show me home and kitchen" ||
          query === "show home and kitchen" ||
          query === "show me home & kitchen" ||
          query === "show home & kitchen"
        ) {
          responseContent =
            "Here are some home & kitchen products I found for you:\n- Coffee Maker Deluxe: $129.99 (8 in stock)\n- Chef Knife Set: $199.99 (7 in stock)\n- Blender Pro: $89.99 (12 in stock)\n\nWould you like more details on any of these?";
          shouldShowProducts = true;
          productsToShow = mockProductDatabase["home-kitchen"];
        } else if (
          query === "show me books" ||
          query === "show books" ||
          query === "show me book"
        ) {
          responseContent =
            "Here are some books I found for you:\n- The Silent Witness: $14.99 (25 in stock)\n- Mindful Living: $19.99 (18 in stock)\n- Realm of Dragons: $24.99 (15 in stock)\n\nWould you like more details on any of these?";
          shouldShowProducts = true;
          productsToShow = mockProductDatabase.books;
        } else if (
          query === "show me sports" ||
          query === "show sports" ||
          query === "show me outdoors" ||
          query === "show outdoors" ||
          query === "show me sports and outdoors" ||
          query === "show sports and outdoors" ||
          query === "show me sports & outdoors" ||
          query === "show sports & outdoors"
        ) {
          responseContent =
            "Here are some sports & outdoors products I found for you:\n- Premium Yoga Mat: $49.99 (22 in stock)\n- Explorer Hiking Backpack: $79.99 (14 in stock)\n- Fitness Tracker Elite: $129.99 (8 in stock)\n\nWould you like more details on any of these?";
          shouldShowProducts = true;
          productsToShow = mockProductDatabase["sports-outdoors"];
        } else if (
          query === "show me beauty" ||
          query === "show beauty" ||
          query === "show me personal care" ||
          query === "show personal care" ||
          query === "show me beauty and personal care" ||
          query === "show beauty and personal care" ||
          query === "show me beauty & personal care" ||
          query === "show beauty & personal care"
        ) {
          responseContent =
            "Here are some beauty & personal care products I found for you:\n- Complete Skincare Set: $69.99 (17 in stock)\n- Midnight Bloom Perfume: $89.99 (12 in stock)\n- Professional Hair Styling Kit: $149.99 (9 in stock)\n\nWould you like more details on any of these?";
          shouldShowProducts = true;
          productsToShow = mockProductDatabase["beauty-personal-care"];
        } else if (
          query === "show me toys" ||
          query === "show toys" ||
          query === "show me games" ||
          query === "show games" ||
          query === "show me toys and games" ||
          query === "show toys and games" ||
          query === "show me toys & games" ||
          query === "show toys & games"
        ) {
          responseContent =
            "Here are some toys & games products I found for you:\n- Creative Building Blocks: $34.99 (23 in stock)\n- Family Board Game Collection: $59.99 (16 in stock)\n- High-Speed RC Car: $79.99 (11 in stock)\n\nWould you like more details on any of these?";
          shouldShowProducts = true;
          productsToShow = mockProductDatabase["toys-games"];
        } else if (
          query === "show me health" ||
          query === "show health" ||
          query === "show me wellness" ||
          query === "show wellness" ||
          query === "show me health and wellness" ||
          query === "show health and wellness" ||
          query === "show me health & wellness" ||
          query === "show health & wellness"
        ) {
          responseContent =
            "Here are some health & wellness products I found for you:\n- Complete Vitamin Pack: $39.99 (28 in stock)\n- Deep Tissue Massage Device: $129.99 (13 in stock)\n- Organic Superfood Blend: $49.99 (19 in stock)\n\nWould you like more details on any of these?";
          shouldShowProducts = true;
          productsToShow = mockProductDatabase["health-wellness"];
        }
        // First check for category listing requests since they're more common
        else if (
          query.includes("show") ||
          query.includes("list") ||
          query.includes("display")
        ) {
          // Handle phone category request
          if (
            query.includes("phone") ||
            query.includes("mobile") ||
            query.includes("smartphone") ||
            query.includes("electronics")
          ) {
            responseContent =
              "Here are some smartphone products I found for you:\n- Eat Smartphone: $799.99 (15 in stock)\n- Bill Smartphone: $699.99 (8 in stock)\n- Premium Phone X: $899.99 (5 in stock)\n\nWould you like more details on any of these?";
            shouldShowProducts = true;
            productsToShow = mockProductDatabase.smartphones;
          }
          // Handle laptop category request
          else if (query.includes("laptop") || query.includes("computer")) {
            responseContent =
              "Here are some laptop products I found for you:\n- With Laptop: $1299.99 (10 in stock)\n- Resource Laptop: $999.99 (12 in stock)\n- Ultra Book Pro: $1499.99 (3 in stock)\n\nWould you like more details on any of these?";
            shouldShowProducts = true;
            productsToShow = mockProductDatabase.laptops;
          }
          // Handle watch category request
          else if (query.includes("watch") || query.includes("smartwatch")) {
            responseContent =
              "Here are some smartwatch products I found for you:\n- Accept Smartwatch: $299.99 (20 in stock)\n- On Smartwatch: $249.99 (15 in stock)\n- Blood Smartwatch: $349.99 (7 in stock)\n\nWould you like more details on any of these?";
            shouldShowProducts = true;
            productsToShow = mockProductDatabase.smartwatches;
          }
          // Handle clothing category request
          else if (query.includes("cloth") || query.includes("apparel")) {
            responseContent =
              "Here are some clothing products I found for you:\n- Premium T-Shirt: $29.99 (50 in stock)\n- Designer Jeans: $89.99 (30 in stock)\n- Casual Jacket: $129.99 (18 in stock)\n\nWould you like more details on any of these?";
            shouldShowProducts = true;
            productsToShow = mockProductDatabase.clothing;
          }
          // Handle home & kitchen category request
          else if (query.includes("home") || query.includes("kitchen")) {
            responseContent =
              "Here are some home & kitchen products I found for you:\n- Coffee Maker Deluxe: $129.99 (8 in stock)\n- Chef Knife Set: $199.99 (7 in stock)\n- Blender Pro: $89.99 (12 in stock)\n\nWould you like more details on any of these?";
            shouldShowProducts = true;
            productsToShow = mockProductDatabase["home-kitchen"];
          }
          // Handle books category request
          else if (query.includes("book")) {
            responseContent =
              "Here are some books I found for you:\n- The Silent Witness: $14.99 (25 in stock)\n- Mindful Living: $19.99 (18 in stock)\n- Realm of Dragons: $24.99 (15 in stock)\n\nWould you like more details on any of these?";
            shouldShowProducts = true;
            productsToShow = mockProductDatabase.books;
          }
          // Handle sports & outdoors category request
          else if (query.includes("sport") || query.includes("outdoor")) {
            responseContent =
              "Here are some sports & outdoors products I found for you:\n- Premium Yoga Mat: $49.99 (22 in stock)\n- Explorer Hiking Backpack: $79.99 (14 in stock)\n- Fitness Tracker Elite: $129.99 (8 in stock)\n\nWould you like more details on any of these?";
            shouldShowProducts = true;
            productsToShow = mockProductDatabase["sports-outdoors"];
          }
          // Handle beauty & personal care category request
          else if (
            query.includes("beauty") ||
            query.includes("personal care")
          ) {
            responseContent =
              "Here are some beauty & personal care products I found for you:\n- Complete Skincare Set: $69.99 (17 in stock)\n- Midnight Bloom Perfume: $89.99 (12 in stock)\n- Professional Hair Styling Kit: $149.99 (9 in stock)\n\nWould you like more details on any of these?";
            shouldShowProducts = true;
            productsToShow = mockProductDatabase["beauty-personal-care"];
          }
          // Handle toys & games category request
          else if (query.includes("toy") || query.includes("game")) {
            responseContent =
              "Here are some toys & games products I found for you:\n- Creative Building Blocks: $34.99 (23 in stock)\n- Family Board Game Collection: $59.99 (16 in stock)\n- High-Speed RC Car: $79.99 (11 in stock)\n\nWould you like more details on any of these?";
            shouldShowProducts = true;
            productsToShow = mockProductDatabase["toys-games"];
          }
          // Handle health & wellness category request
          else if (query.includes("health") || query.includes("wellness")) {
            responseContent =
              "Here are some health & wellness products I found for you:\n- Complete Vitamin Pack: $39.99 (28 in stock)\n- Deep Tissue Massage Device: $129.99 (13 in stock)\n- Organic Superfood Blend: $49.99 (19 in stock)\n\nWould you like more details on any of these?";
            shouldShowProducts = true;
            productsToShow = mockProductDatabase["health-wellness"];
          }
          // Handle "show me" without specifics - show a mix of products
          else if (
            query === "show me" ||
            query.includes("show me products") ||
            query.includes("show products")
          ) {
            responseContent =
              "Here are some of our most popular products across different categories:\n\nElectronics:\n- Eat Smartphone: $799.99\n\nClothing:\n- Premium T-Shirt: $29.99\n\nHome & Kitchen:\n- Coffee Maker Deluxe: $129.99\n\nMore categories are available. What would you like to explore?";

            // Create a mixed product list from different categories
            shouldShowProducts = true;
            productsToShow = [
              mockProductDatabase.smartphones[0],
              mockProductDatabase.clothing[0],
              mockProductDatabase["home-kitchen"][0],
              mockProductDatabase.books[0],
              mockProductDatabase["sports-outdoors"][0],
              mockProductDatabase["beauty-personal-care"][0],
              mockProductDatabase["toys-games"][0],
              mockProductDatabase["health-wellness"][0],
            ];
          }
        }

        // If not a category listing request, check for product detail requests
        if (!shouldShowProducts) {
          if (
            query.includes("detail") ||
            query.includes("more information") ||
            query.includes("tell me more") ||
            query.includes("about") ||
            (query.includes("what") && query.includes("is"))
          ) {
            console.log("Product detail request detected");

            // Extract product name from query
            let productName = "";

            // Check for specific product names in the query
            for (const category in mockProductDatabase) {
              const products =
                mockProductDatabase[
                  category as keyof typeof mockProductDatabase
                ];
              for (const product of products) {
                const nameLower = product.name.toLowerCase();
                if (query.includes(nameLower)) {
                  productName = product.name;
                  console.log(`Found exact product match: ${product.name}`);
                  // Found exact product - show ONLY this product
                  responseContent = `Here are the details for ${product.name}:\n\nPrice: $${product.price}\nStock: ${product.stock} available\n\nDescription: ${product.description}\n\nWould you like to add this to your cart?`;
                  shouldShowProducts = true;
                  productsToShow = [product]; // Just this one product

                  // Reset global state
                  setLastShownProductCategory(null);

                  break;
                }
              }
              if (productName) break;
            }

            // If no exact match, try finding any product name
            if (!productName) {
              const foundProduct = findProductByName(query);
              if (foundProduct) {
                productName = foundProduct.name;
                // Found using fuzzy matching - show ONLY this product
                responseContent = `Here are the details for ${foundProduct.name}:\n\nPrice: $${foundProduct.price}\nStock: ${foundProduct.stock} available\n\nDescription: ${foundProduct.description}\n\nWould you like to add this to your cart?`;
                shouldShowProducts = true;
                productsToShow = [foundProduct];
              } else {
                // No product found - don't show any products
                responseContent =
                  "I'm not sure which product you're asking about. Can you specify the product name?";
                shouldShowProducts = false;
                productsToShow = [];
              }
            }
          }
          // Handle single category names after "Which category would you like to explore?"
          else if (
            query === "electronics" ||
            query === "clothing" ||
            query === "home & kitchen" ||
            query === "home and kitchen" ||
            query === "books" ||
            query === "sports & outdoors" ||
            query === "sports and outdoors" ||
            query === "beauty & personal care" ||
            query === "beauty and personal care" ||
            query === "toys & games" ||
            query === "toys and games" ||
            query === "health & wellness" ||
            query === "health and wellness"
          ) {
            // Handle each category directly without requiring "show me" prefix
            let category = "";
            let products: Product[] = [];

            if (query === "electronics") {
              category = "Electronics";
              // Show a mix of electronics subcategories
              products = [
                mockProductDatabase.smartphones[0],
                mockProductDatabase.laptops[0],
                mockProductDatabase.smartwatches[0],
              ];
            } else if (query === "clothing") {
              category = "Clothing";
              products = mockProductDatabase.clothing;
            } else if (
              query === "home & kitchen" ||
              query === "home and kitchen"
            ) {
              category = "Home & Kitchen";
              products = mockProductDatabase["home-kitchen"];
            } else if (query === "books") {
              category = "Books";
              products = mockProductDatabase.books;
            } else if (
              query === "sports & outdoors" ||
              query === "sports and outdoors"
            ) {
              category = "Sports & Outdoors";
              products = mockProductDatabase["sports-outdoors"];
            } else if (
              query === "beauty & personal care" ||
              query === "beauty and personal care"
            ) {
              category = "Beauty & Personal Care";
              products = mockProductDatabase["beauty-personal-care"];
            } else if (query === "toys & games" || query === "toys and games") {
              category = "Toys & Games";
              products = mockProductDatabase["toys-games"];
            } else if (
              query === "health & wellness" ||
              query === "health and wellness"
            ) {
              category = "Health & Wellness";
              products = mockProductDatabase["health-wellness"];
            }

            responseContent = `Here are some popular products in the ${category} category:\n\n`;

            // Add product details to the response
            products.forEach((product) => {
              responseContent += `- ${product.name}: $${product.price.toFixed(
                2
              )} (${product.stock} in stock)\n`;
            });

            responseContent +=
              "\nWould you like more details about any of these products?";
            shouldShowProducts = true;
            productsToShow = products;
          }
          // Handle Ultra Book Pro special case
          else if (
            query.includes("ultra book") ||
            query.includes("ultrabook") ||
            query.includes("ultra-book")
          ) {
            // Special case for "Ultra Book Pro" details only
            const ultraBook = mockProductDatabase.laptops.find(
              (p) => p.name === "Ultra Book Pro"
            );
            if (ultraBook) {
              responseContent = `Here are the details for Ultra Book Pro:\n\nPrice: $${ultraBook.price}\nStock: ${ultraBook.stock} available\n\nDescription: ${ultraBook.description}\n\nWould you like to add this to your cart?`;
              // Always show the product card for Ultra Book Pro only
              shouldShowProducts = true;
              productsToShow = [ultraBook];
            }
          }
          // Handle help, categories, and other general requests
          else if (query.includes("help") || query.includes("assist")) {
            responseContent =
              "I can help you with:\n- Searching for products\n- Exploring categories\n- Getting product recommendations\n- Checking product availability\n- Simulating purchases\n\nWhat would you like to do?";
            // No products here
          } else if (
            query.includes("category") ||
            query.includes("categories")
          ) {
            responseContent =
              "Here are our product categories:\n- Electronics\n- Clothing\n- Home & Kitchen\n- Books\n- Sports & Outdoors\n- Beauty & Personal Care\n- Toys & Games\n- Health & Wellness\n\nWhich category would you like to explore?";
            // No products here
          } else {
            responseContent =
              "I'm here to help you find products! You can ask me to show you specific items like 'show me phones', browse categories, or search for products by name.";
            // No products for generic responses
          }
        }

        const botResponse: ChatMessageType = {
          id: Date.now() + 1,
          role: "assistant",
          content: responseContent,
          timestamp: new Date().toISOString(),
        };

        // Only attach products if we explicitly decided to show them
        if (shouldShowProducts && productsToShow.length > 0) {
          botResponse.hasProducts = true;
          botResponse.productData = productsToShow;

          // Clear any previously shown products to ensure only these products are displayed
          setProducts(productsToShow);
          setShowProducts(true);

          // If we're showing a single product detail, make sure we're not showing any other products globally
          if (
            query.includes("detail") ||
            query.includes("more information") ||
            query.includes("tell me more") ||
            query.includes("about") ||
            (query.includes("what") && query.includes("is"))
          ) {
            // This will ensure only the specific product is shown throughout the UI
            setProducts(productsToShow);
          }
        } else {
          // Otherwise don't show products
          botResponse.hasProducts = false;
          setShowProducts(false);
        }

        setMessages((prev) => [...prev, botResponse]);
      }, 500);
    } catch (error) {
      console.error("Failed to process message:", error);
      // Add error message
      const errorMessage: ChatMessageType = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    // Create a new unique welcome message to prevent duplicates
    const newWelcomeMessage: ChatMessageType = {
      id: Date.now(),
      role: "assistant",
      content:
        "Hello! I'm ShopBot, your shopping assistant. How can I help you today? You can ask me to search for products, show categories, or help with your order.",
      timestamp: new Date().toISOString(),
    };

    // Only set the single welcome message
    setMessages([newWelcomeMessage]);
    setShowProducts(false);
    setProducts([]);
    setLastShownProductCategory(null);
    setShowChatHistory(false);

    // Don't create a new session on reset, just clear the messages
  };

  return (
    <div className="flex h-[calc(100vh-16rem)]">
      {/* Chat History Sidebar (conditionally shown) */}
      {showChatHistory && isAuthenticated && (
        <div className="w-80 mr-4 flex-shrink-0">
          <ChatHistory
            onSelectSession={loadChatSession}
            onDeleteSession={handleDeleteSession}
          />
        </div>
      )}

      <div
        className={`flex flex-col flex-grow bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-lg overflow-hidden`}
      >
        {/* Chat header */}
        <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-white font-medium">ShopBot Assistant</p>
              <p className="text-gray-400 text-xs">Online</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {isAuthenticated && (
              <button
                onClick={toggleChatHistory}
                className="text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-1 text-sm transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              >
                {showChatHistory ? "Hide History" : "Show History"}
              </button>
            )}
            <button
              onClick={handleNewChat}
              className="text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-1 text-sm transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              disabled={isLoading}
            >
              New Chat
            </button>
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md px-3 py-1 text-sm transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]"
            >
              Reset Chat
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          id="chat-messages-container"
        >
          <div className="flex flex-col min-h-full justify-end">
            {messages.map((message, index) => (
              <div key={message.id} className="message-container mb-4">
                <ChatMessage message={message} />

                {/* ONLY show products for the LATEST message */}
                {message.hasProducts &&
                  message.productData &&
                  message.productData.length > 0 &&
                  index === messages.length - 1 && (
                    <div className="mt-2 mb-4 bg-gray-800/60 p-4 rounded-lg border border-gray-700">
                      <h3 className="text-white text-sm font-medium mb-3">
                        Products
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {message.productData.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center my-2">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                  <div className="h-2 w-2 bg-purple-300 rounded-full"></div>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat input */}
        <div className="border-t border-gray-700 p-4 bg-gray-800">
          <div className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-l-md px-4 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_10px_rgba(139,92,246,0.7)] transition-all duration-300"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 h-10 rounded-r-md transition-all duration-300 ease-in-out hover:from-purple-400 hover:to-cyan-400 hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.7)] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
