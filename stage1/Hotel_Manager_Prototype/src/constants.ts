import { 
  Room, 
  Guest, 
  Stay, 
  Payment, 
  Feedback, 
  RoomTypeDetail, 
  RoomStatusDetail, 
  LoyaltyTierDetail,
  Employee,
  Department,
  HotelService,
  InventoryItem
} from './types';

export const ROOM_TYPES: RoomTypeDetail[] = [
  { id: 'rt1', typeName: 'Single', capacity: 1, basePrice: 100 },
  { id: 'rt2', typeName: 'Double', capacity: 2, basePrice: 150 },
  { id: 'rt3', typeName: 'Suite', capacity: 4, basePrice: 300 },
  { id: 'rt4', typeName: 'Deluxe', capacity: 2, basePrice: 200 },
];

export const ROOM_STATUSES: RoomStatusDetail[] = [
  { id: 'rs1', statusName: 'Available' },
  { id: 'rs2', statusName: 'Occupied' },
  { id: 'rs3', statusName: 'Cleaning' },
  { id: 'rs4', statusName: 'Maintenance' },
  { id: 'rs5', statusName: 'Reserved' },
];

export const LOYALTY_TIERS: LoyaltyTierDetail[] = [
  { tier: 'Bronze', minPoints: 0, discount: 0, benefits: ['Standard support'] },
  { tier: 'Silver', minPoints: 1000, discount: 5, benefits: ['Late check-out', 'Welcome drink'] },
  { tier: 'Gold', minPoints: 5000, discount: 10, benefits: ['Room upgrade', 'Free breakfast'] },
  { tier: 'Platinum', minPoints: 10000, discount: 15, benefits: ['Spa access', 'VIP lounge'] },
];

export const INITIAL_ROOMS: Room[] = [
  { id: '1', number: '101', floor: 1, typeId: 'rt1', statusId: 'rs1' },
  { id: '2', number: '102', floor: 1, typeId: 'rt2', statusId: 'rs2' },
  { id: '3', number: '103', floor: 1, typeId: 'rt1', statusId: 'rs3' },
  { id: '4', number: '201', floor: 2, typeId: 'rt3', statusId: 'rs1' },
  { id: '5', number: '202', floor: 2, typeId: 'rt4', statusId: 'rs2' },
];

export const INITIAL_GUESTS: Guest[] = [
  { 
    id: 'g1', 
    phone: '050-1234567', 
    email: 'yossi@gmail.com', 
    createdDate: '2026-01-10', 
    type: 'Private', 
    points: 1200, 
    loyaltyTier: 'Silver',
    firstName: 'Yossi',
    lastName: 'Cohen',
    idNumber: '123456789',
    gender: 'Male'
  },
  { 
    id: 'g2', 
    phone: '052-7654321', 
    email: 'contact@techcorp.com', 
    createdDate: '2026-02-15', 
    type: 'Business', 
    points: 8500, 
    loyaltyTier: 'Gold',
    companyName: 'TechCorp Ltd',
    contactPerson: 'Sarah Levi',
    companyId: '512345678'
  },
];

export const INITIAL_STAYS: Stay[] = [
  { id: 's1', guestId: 'g1', roomId: '2', checkIn: '2026-03-15', checkOut: '2026-03-20', status: 'Current' },
  { id: 's2', guestId: 'g2', roomId: '5', checkIn: '2026-03-16', checkOut: '2026-03-18', status: 'Current' },
  { id: 's3', guestId: 'g1', roomId: '1', checkIn: '2026-02-01', checkOut: '2026-02-05', status: 'Past' },
];

export const INITIAL_PAYMENTS: Payment[] = [
  { id: 'p1', stayId: 's1', date: '2026-03-15', amount: 300, method: 'Credit Card', status: 'Completed' },
  { id: 'p2', stayId: 's1', date: '2026-03-17', amount: 450, method: 'Credit Card', status: 'Completed' },
  { id: 'p3', stayId: 's3', date: '2026-02-05', amount: 400, method: 'Cash', status: 'Completed' },
];

export const INITIAL_FEEDBACKS: Feedback[] = [
  { stayId: 's3', rating: 5, comment: 'Amazing stay, very clean!', date: '2026-02-06' },
];

export const DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Front Desk' },
  { id: 'd2', name: 'Housekeeping' },
  { id: 'd3', name: 'Maintenance' },
  { id: 'd4', name: 'Restaurant' },
];

export const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Moshe Levi', departmentId: 'd1', role: 'Receptionist', email: 'moshe@hotel.com' },
  { id: 'e2', name: 'Rivka Cohen', departmentId: 'd2', role: 'Cleaner', email: 'rivka@hotel.com' },
];

export const INITIAL_SERVICES: HotelService[] = [
  { id: 'sv1', name: 'Full Body Massage', category: 'Spa', price: 250 },
  { id: 'sv2', name: 'Laundry Service', category: 'Laundry', price: 50 },
  { id: 'sv3', name: 'Gym Session', category: 'Gym', price: 0 },
];

export const INITIAL_SERVICE_BOOKINGS: any[] = [
  { id: 'sb1', guestId: 'g1', serviceId: 'sv1', date: '2026-03-18T10:00:00Z', status: 'Scheduled' },
];

export const MENU_ITEMS: any[] = [
  { id: 'm1', name: 'Caesar Salad', category: 'Appetizer', price: 45, available: true },
  { id: 'm2', name: 'Grilled Salmon', category: 'Main Course', price: 120, available: true },
  { id: 'm3', name: 'Chocolate Lava Cake', category: 'Dessert', price: 35, available: true },
  { id: 'm4', name: 'Fresh Orange Juice', category: 'Drink', price: 15, available: true },
];

export const INITIAL_RESTAURANT_ORDERS: any[] = [
  { id: 'ro1', stayId: 's1', items: [{ menuItemId: 'm2', quantity: 1 }, { menuItemId: 'm4', quantity: 2 }], totalAmount: 150, date: '2026-03-16T19:30:00Z', type: 'Room Service', status: 'Delivered' },
];

export const INITIAL_MAINTENANCE_REQUESTS: any[] = [
  { id: 'mr1', roomId: '3', description: 'AC not cooling properly', priority: 'High', status: 'Pending', requestedDate: '2026-03-17T08:00:00Z' },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Bed Sheets', stock: 100, supplier: 'Linens Inc' },
  { id: 'i2', name: 'Soap Bars', stock: 500, supplier: 'CleanCo' },
];
