// --- Rooms Management ---
export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance' | 'Reserved';
export type RoomType = 'Single' | 'Double' | 'Suite' | 'Deluxe';

export interface Room {
  id: string;
  number: string;
  floor: number;
  typeId: string;
  statusId: string;
}

export interface RoomTypeDetail {
  id: string;
  typeName: RoomType;
  capacity: number;
  basePrice: number;
}

export interface RoomStatusDetail {
  id: string;
  statusName: RoomStatus;
}

export interface Amenity {
  id: string;
  name: string;
}

// --- Guest Management ---
export type GuestType = 'Private' | 'Business';
export type StayStatus = 'Future' | 'Current' | 'Past';
export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface LoyaltyTierDetail {
  tier: LoyaltyTier;
  minPoints: number;
  discount: number;
  benefits: string[];
}

export interface Guest {
  id: string;
  phone: string;
  email?: string;
  createdDate: string;
  type: GuestType;
  points: number;
  loyaltyTier: LoyaltyTier;
  
  // Private fields
  firstName?: string;
  lastName?: string;
  idNumber?: string;
  gender?: string;
  
  // Business fields
  companyName?: string;
  contactPerson?: string;
  companyId?: string;
}

export interface Stay {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: StayStatus;
}

export interface Payment {
  id: string;
  stayId: string;
  date: string;
  amount: number;
  method: 'Credit Card' | 'Cash' | 'Bank Transfer' | 'PayPal';
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
}

export interface Feedback {
  stayId: string; // PK is StayID
  rating: number; // 1-5
  comment?: string;
  date: string;
}

// --- Employee Management ---
export interface Employee {
  id: string;
  name: string;
  departmentId: string;
  role: string;
  email: string;
}

export interface Department {
  id: string;
  name: string;
}

// --- Services ---
export interface HotelService {
  id: string;
  name: string;
  category: 'Spa' | 'Gym' | 'Pool' | 'Laundry' | 'Restaurant';
  price: number;
}

export interface ServiceBooking {
  id: string;
  guestId: string;
  serviceId: string;
  date: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

// --- Restaurant ---
export interface MenuItem {
  id: string;
  name: string;
  category: 'Appetizer' | 'Main Course' | 'Dessert' | 'Drink';
  price: number;
  available: boolean;
}

export interface RestaurantOrder {
  id: string;
  stayId: string;
  items: { menuItemId: string; quantity: number }[];
  totalAmount: number;
  date: string;
  type: 'Dine-in' | 'Room Service';
  status: 'Pending' | 'Preparing' | 'Delivered' | 'Paid';
}

// --- Maintenance ---
export interface MaintenanceRequest {
  id: string;
  roomId: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Resolved';
  requestedDate: string;
}

// --- Inventory ---
export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  supplier: string;
}
