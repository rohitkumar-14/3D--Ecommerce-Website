

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller' | 'admin'; // Example roles
  // Add other user-specific fields if needed
}

export interface CustomizationOptionChoice {
  label: string;
  value: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  type: 'select' | 'text' | 'radio';
  choices?: CustomizationOptionChoice[]; // For select and radio
  placeholder?: string; // For text input
  defaultValue?: string;
}

export type SelectedCustomizations = Record<string, string>;

export type Product = {
  id:string;
  name: string;
  description: string;
  price: number; // Base price, or starting bid for auctions
  images: string[]; // URLs of images
  category: string;
  type: 'physical' | 'digital' | 'auction';
  sellerId?: string; // Optional: ID of the seller
  stock?: number; // Number of items in stock, optional for digital/auction or if stock is managed elsewhere

  // 3D Model Viewer
  modelUrl?: string;

  // Customization Options
  customizationOptions?: CustomizationOption[];

  // Auction specific
  auctionEndDate?: string; // ISO date string
  currentBid?: number;
  highestBidder?: string; // User ID or name
  bids?: Bid[];

  // Digital specific
  digitalFileUrl?: string;

  // For featured carousel
  isFeatured?: boolean;

  // AI Hint for placeholder images
  dataAiHint?: string;
};

export type Bid = {
  id: string;
  productId: string;
  userId: string;
  userName: string; // For display
  amount: number;
  timestamp: string; // ISO date string
};

export type Order = {
  id: string;
  productName: string;
  productId: string;
  productImage: string;
  purchaseDate: string; // ISO date string
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Auction Won' | 'Order Placed';
  totalAmount: number;
  isDigitalDownloadReady?: boolean;
  digitalFileUrl?: string;
  customizations?: SelectedCustomizations; // Store selected customizations with the order
};

export interface CartItem {
  id: string; // Unique ID for the cart item (e.g., product.id + hash of customizations)
  product: Product;
  quantity: number;
  selectedCustomizations: SelectedCustomizations;
  unitPrice: number; // Price of one unit
  totalPrice: number; // quantity * unitPrice
}
