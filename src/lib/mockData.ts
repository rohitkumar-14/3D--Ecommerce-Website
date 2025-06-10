
import type { Product, Bid, Order, CustomizationOption } from './types';

const tShirtCustomizationOptions: CustomizationOption[] = [
  {
    id: 'color',
    name: 'Color',
    type: 'select',
    choices: [
      { label: 'Red', value: 'red' },
      { label: 'Blue', value: 'blue' },
      { label: 'Black', value: 'black' },
      { label: 'White', value: 'white' },
    ],
    defaultValue: 'black',
  },
  {
    id: 'size',
    name: 'Size',
    type: 'radio',
    choices: [
      { label: 'Small', value: 's' },
      { label: 'Medium', value: 'm' },
      { label: 'Large', value: 'l' },
      { label: 'X-Large', value: 'xl' },
    ],
    defaultValue: 'm',
  },
  {
    id: 'customText',
    name: 'Custom Text (Optional)',
    type: 'text',
    placeholder: 'Enter up to 20 characters',
    defaultValue: '',
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Cotton T-Shirt',
    description: 'A comfortable and stylish classic t-shirt made from premium cotton. Perfect for everyday wear, available in various sizes and colors.',
    price: 25.99,
    images: ['https://placehold.co/600x400.png?text=T-Shirt+Front', 'https://placehold.co/600x400.png?text=T-Shirt+Back', 'https://placehold.co/600x400.png?text=T-Shirt+Detail'],
    category: 'Apparel',
    type: 'physical',
    isFeatured: true,
    customizationOptions: tShirtCustomizationOptions,
    dataAiHint: 'tshirt apparel',
  },
  {
    id: '2',
    name: 'Vintage Leather Watch (Auction)',
    description: 'An elegant vintage leather watch with a timeless design. Features a stainless steel case and genuine leather strap. Bid now to win this classic timepiece!',
    price: 150, // Starting bid
    images: ['https://placehold.co/600x400.png?text=Watch+Face', 'https://placehold.co/600x400.png?text=Watch+Strap'],
    category: 'Accessories',
    type: 'auction',
    auctionEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    currentBid: 175.50,
    bids: [
      { id: 'b1', productId: '2', userId: 'user123', userName: 'Bidder Alpha', amount: 160, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { id: 'b2', productId: '2', userId: 'user456', userName: 'Bidder Bravo', amount: 175.50, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    ],
    isFeatured: true,
    dataAiHint: 'watch accessory',
  },
  {
    id: '3',
    name: 'Pro Photography Masterclass eBook',
    description: 'Learn professional photography techniques with this comprehensive eBook. Covers everything from camera basics to advanced lighting and composition. Instant download after purchase.',
    price: 19.99,
    images: ['https://placehold.co/600x400.png?text=eBook+Cover'],
    category: 'Digital Goods',
    type: 'digital',
    digitalFileUrl: '/api/download/pro-photography-ebook.pdf', // Simulated API path
    isFeatured: true,
    dataAiHint: 'ebook book',
  },
  {
    id: '4',
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Immerse yourself in sound with these premium wireless noise-cancelling headphones. Long battery life and superior comfort.',
    price: 199.99,
    images: ['https://placehold.co/600x400.png?text=Headphones+Main', 'https://placehold.co/600x400.png?text=Headphones+Side'],
    category: 'Electronics',
    type: 'physical',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb', // Example 3D model
    dataAiHint: 'headphones electronics',
  },
  {
    id: '5',
    name: 'Handcrafted Ceramic Mug Set (Auction)',
    description: 'A beautiful set of four handcrafted ceramic mugs. Each mug is unique with a rustic glaze. Perfect for your morning coffee or tea. Auction ends soon!',
    price: 30, // Starting bid
    images: ['https://placehold.co/600x400.png?text=Mug+Set', 'https://placehold.co/600x400.png?text=Single+Mug'],
    category: 'Home Goods',
    type: 'auction',
    auctionEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    currentBid: 45.00,
    bids: [
       { id: 'b3', productId: '5', userId: 'user789', userName: 'Bidder Charlie', amount: 45.00, timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    ],
    dataAiHint: 'mug set kitchen',
  },
  {
    id: '6',
    name: 'Ultimate Productivity Planner (Digital)',
    description: 'Boost your productivity with this feature-packed digital planner. Includes daily, weekly, and monthly views, goal tracking, and more. Compatible with popular note-taking apps.',
    price: 9.99,
    images: ['https://placehold.co/600x400.png?text=Planner+Cover'],
    category: 'Digital Goods',
    type: 'digital',
    digitalFileUrl: '/api/download/productivity-planner.zip', // Simulated API path
    dataAiHint: 'planner digital',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'order1',
    productId: '1',
    productName: 'Classic Cotton T-Shirt',
    productImage: 'https://placehold.co/100x100.png',
    purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Delivered',
    totalAmount: 25.99,
    isDigitalDownloadReady: false,
    customizations: { color: 'blue', size: 'm' },
  },
  {
    id: 'order2',
    productId: '3',
    productName: 'Pro Photography Masterclass eBook',
    productImage: 'https://placehold.co/100x100.png',
    purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Order Placed', 
    totalAmount: 19.99,
    isDigitalDownloadReady: true,
    digitalFileUrl: '/api/download/pro-photography-ebook.pdf',
  },
  {
    id: 'order3',
    productId: '5', 
    productName: 'Handcrafted Ceramic Mug Set (Auction)',
    productImage: 'https://placehold.co/100x100.png',
    purchaseDate: new Date().toISOString(), 
    status: 'Auction Won', 
    totalAmount: 45.00, 
    isDigitalDownloadReady: false,
  }
];

export const getProductById = (id: string): Product | undefined => mockProducts.find(p => p.id === id);
