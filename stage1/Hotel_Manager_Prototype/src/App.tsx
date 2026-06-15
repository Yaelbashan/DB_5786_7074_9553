import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Bed, 
  Calendar, 
  Users, 
  ClipboardList, 
  Settings, 
  Plus, 
  Search, 
  Bell, 
  ChevronRight,
  TrendingUp,
  DollarSign,
  Hotel,
  LogOut,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Filter,
  Download,
  Briefcase,
  User,
  Star,
  CreditCard,
  MessageSquare,
  Utensils,
  Wrench,
  Package,
  ShieldCheck,
  History,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, addDays, isWithinInterval, parseISO } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  InventoryItem,
  MaintenanceRequest,
  ServiceBooking,
  MenuItem,
  RestaurantOrder,
  GuestType,
  StayStatus,
  LoyaltyTier
} from './types';

import { 
  ROOM_TYPES, 
  ROOM_STATUSES, 
  LOYALTY_TIERS, 
  INITIAL_ROOMS, 
  INITIAL_GUESTS, 
  INITIAL_STAYS, 
  INITIAL_PAYMENTS, 
  INITIAL_FEEDBACKS,
  DEPARTMENTS,
  INITIAL_EMPLOYEES,
  INITIAL_SERVICES,
  INITIAL_INVENTORY,
  INITIAL_SERVICE_BOOKINGS,
  MENU_ITEMS,
  INITIAL_RESTAURANT_ORDERS,
  INITIAL_MAINTENANCE_REQUESTS
} from './constants';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group text-left",
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
        : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
    )}
  >
    <Icon size={18} className={cn(active ? "text-white" : "group-hover:scale-110 transition-transform")} />
    <span className="font-medium text-sm">{label}</span>
    {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
  </button>
);

const Badge = ({ children, variant }: any) => {
  const styles: Record<string, string> = {
    Available: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Occupied: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Cleaning: "bg-amber-50 text-amber-600 border-amber-100",
    Maintenance: "bg-rose-50 text-rose-600 border-rose-100",
    Reserved: "bg-blue-50 text-blue-600 border-blue-100",
    
    Future: "bg-blue-50 text-blue-600 border-blue-100",
    Current: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Past: "bg-slate-50 text-slate-600 border-slate-100",
    
    Private: "bg-sky-50 text-sky-600 border-sky-100",
    Business: "bg-purple-50 text-purple-600 border-purple-100",
    
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Failed: "bg-rose-50 text-rose-600 border-rose-100",
    
    Bronze: "bg-orange-50 text-orange-700 border-orange-100",
    Silver: "bg-slate-100 text-slate-700 border-slate-200",
    Gold: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Platinum: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider", styles[variant] || "bg-slate-50 text-slate-600 border-slate-100")}>
      {children}
    </span>
  );
};

// --- Main App ---

export default function App() {
  const [viewMode, setViewMode] = useState<'admin' | 'guest'>('admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [guestActiveTab, setGuestActiveTab] = useState('book');
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [stays, setStays] = useState<Stay[]>(INITIAL_STAYS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(INITIAL_FEEDBACKS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [services, setServices] = useState<HotelService[]>(INITIAL_SERVICES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(INITIAL_SERVICE_BOOKINGS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [restaurantOrders, setRestaurantOrders] = useState<RestaurantOrder[]>(INITIAL_RESTAURANT_ORDERS);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(INITIAL_MAINTENANCE_REQUESTS);

  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [selectedStayId, setSelectedStayId] = useState<string | null>(null);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isAddStayOpen, setIsAddStayOpen] = useState(false);
  const [newGuestType, setNewGuestType] = useState<GuestType>('Private');
  const [viewingTier, setViewingTier] = useState<LoyaltyTier | null>(null);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  // --- Loyalty Logic ---
  const updateGuestLoyalty = (guestId: string, pointsToAdd: number) => {
    setGuests(prev => prev.map(guest => {
      if (guest.id === guestId) {
        const newPoints = guest.points + pointsToAdd;
        // Find the highest tier the guest qualifies for
        const newTier = [...LOYALTY_TIERS]
          .sort((a, b) => b.minPoints - a.minPoints)
          .find(t => newPoints >= t.minPoints)?.tier || 'Bronze';
        
        return { ...guest, points: newPoints, loyaltyTier: newTier as LoyaltyTier };
      }
      return guest;
    }));
  };

  const handleRecordPayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `p${Date.now()}`
    };
    setPayments(prev => [...prev, newPayment]);

    // Add loyalty points (10% of amount)
    const stay = stays.find(s => s.id === paymentData.stayId);
    if (stay && paymentData.status === 'Completed') {
      const pointsToAdd = Math.floor(paymentData.amount * 0.1);
      updateGuestLoyalty(stay.guestId, pointsToAdd);
    }
  };

  // --- Persistence ---
  useEffect(() => {
    const savedData = localStorage.getItem('hotel_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setRooms(parsed.rooms || INITIAL_ROOMS);
      setGuests(parsed.guests || INITIAL_GUESTS);
      setStays(parsed.stays || INITIAL_STAYS);
      setPayments(parsed.payments || INITIAL_PAYMENTS);
      setFeedbacks(parsed.feedbacks || INITIAL_FEEDBACKS);
      setEmployees(parsed.employees || INITIAL_EMPLOYEES);
      setServices(parsed.services || INITIAL_SERVICES);
      setInventory(parsed.inventory || INITIAL_INVENTORY);
      setServiceBookings(parsed.serviceBookings || INITIAL_SERVICE_BOOKINGS);
      setMenuItems(parsed.menuItems || MENU_ITEMS);
      setRestaurantOrders(parsed.restaurantOrders || INITIAL_RESTAURANT_ORDERS);
      setMaintenanceRequests(parsed.maintenanceRequests || INITIAL_MAINTENANCE_REQUESTS);
    }
  }, []);

  useEffect(() => {
    const data = {
      rooms, guests, stays, payments, feedbacks, employees, services, inventory, serviceBookings, menuItems, restaurantOrders, maintenanceRequests
    };
    localStorage.setItem('hotel_data', JSON.stringify(data));
  }, [rooms, guests, stays, payments, feedbacks, employees, services, inventory, serviceBookings, menuItems, restaurantOrders, maintenanceRequests]);

  // --- Actions ---
  const handleCheckIn = (stayId: string) => {
    setStays(prev => prev.map(s => s.id === stayId ? { ...s, status: 'Current' } : s));
    const stay = stays.find(s => s.id === stayId);
    if (stay) {
      setRooms(prev => prev.map(r => r.id === stay.roomId ? { ...r, statusId: 'rs2' } : r));
    }
  };

  const handleCheckOut = (stayId: string) => {
    setStays(prev => prev.map(s => s.id === stayId ? { ...s, status: 'Past' } : s));
    const stay = stays.find(s => s.id === stayId);
    if (stay) {
      setRooms(prev => prev.map(r => r.id === stay.roomId ? { ...r, statusId: 'rs3' } : r));
    }
  };

  // --- Dashboard Stats ---
  const totalRevenue = useMemo(() => payments.reduce((sum, p) => sum + p.amount, 0), [payments]);
  const activeStays = useMemo(() => stays.filter(s => s.status === 'Current').length, [stays]);
  const guestCount = useMemo(() => guests.length, [guests]);

  const occupancyRate = useMemo(() => {
    const occupiedRooms = rooms.filter(r => r.statusId === 'rs2').length;
    return Math.round((occupiedRooms / rooms.length) * 100);
  }, [rooms]);

  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  const revenueByGuestType = useMemo(() => {
    const data = { Private: 0, Business: 0 };
    payments.forEach(p => {
      const stay = stays.find(s => s.id === p.stayId);
      const guest = guests.find(g => g.id === stay?.guestId);
      if (guest) {
        data[guest.type] += p.amount;
      }
    });
    return [
      { name: 'Private', value: data.Private },
      { name: 'Business', value: data.Business },
    ];
  }, [payments, stays, guests]);

  const maintenanceSummary = useMemo(() => {
    const pending = maintenanceRequests.filter(r => r.status === 'Pending').length;
    const inProgress = maintenanceRequests.filter(r => r.status === 'In Progress').length;
    return { pending, inProgress };
  }, [maintenanceRequests]);

  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 shrink-0 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Hotel className="text-white" size={20} />
          </div>
          <h1 className="text-lg font-bold tracking-tight">GrandStay Pro</h1>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core Modules</div>
          <SidebarItem icon={Bed} label="Rooms" active={activeTab === 'rooms'} onClick={() => setActiveTab('rooms')} />
          <SidebarItem icon={Calendar} label="Reservations" active={activeTab === 'reservations'} onClick={() => setActiveTab('reservations')} />
          <SidebarItem icon={ShieldCheck} label="Front Desk" active={activeTab === 'front-desk'} onClick={() => setActiveTab('front-desk')} />
          <SidebarItem icon={Users} label="Guests" active={activeTab === 'guests'} onClick={() => setActiveTab('guests')} />
          
          <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operations</div>
          <SidebarItem icon={Briefcase} label="Employees" active={activeTab === 'employees'} onClick={() => setActiveTab('employees')} />
          <SidebarItem icon={Star} label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
          <SidebarItem icon={Utensils} label="Restaurant" active={activeTab === 'restaurant'} onClick={() => setActiveTab('restaurant')} />
          <SidebarItem icon={CreditCard} label="Billing" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
          <SidebarItem icon={Wrench} label="Maintenance" active={activeTab === 'maintenance'} onClick={() => setActiveTab('maintenance')} />
          <SidebarItem icon={Package} label="Inventory" active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} />
        </nav>

        <div className="mt-8 pt-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
            <LogOut size={18} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{activeTab.replace('-', ' ')}</h2>
          </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('admin')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                viewMode === 'admin' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-indigo-600"
              )}
            >
              Admin View
            </button>
            <button 
              onClick={() => setViewMode('guest')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                viewMode === 'guest' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-indigo-600"
              )}
            >
              Guest View
            </button>
          </div>
          <div className="relative">
              <Bell size={18} className="text-slate-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">EM</div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {viewMode === 'admin' ? (
              <>
                {activeTab === 'dashboard' && (
                  <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Total Revenue</p>
                        <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Occupancy Rate</p>
                        <p className="text-2xl font-bold">{occupancyRate}%</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Avg Rating</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold">{averageRating}</p>
                          <Star size={18} className="text-yellow-400 fill-yellow-400" />
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Active Stays</p>
                        <p className="text-2xl font-bold">{activeStays}</p>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Total Guests</p>
                        <p className="text-2xl font-bold">{guestCount}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-80">
                        <h3 className="font-bold mb-6">Revenue Growth</h3>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={3} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-80">
                        <h3 className="font-bold mb-6 text-sm">Revenue by Guest Type</h3>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={revenueByGuestType}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              <Cell fill="#4f46e5" />
                              <Cell fill="#10b981" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                            <span className="text-[10px] text-slate-500">Private</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] text-slate-500">Business</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                          <Wrench size={18} className="text-slate-400" />
                          Maintenance Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <p className="text-amber-600 text-[10px] font-bold uppercase mb-1">Pending</p>
                            <p className="text-2xl font-bold text-amber-700">{maintenanceSummary.pending}</p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-blue-600 text-[10px] font-bold uppercase mb-1">In Progress</p>
                            <p className="text-2xl font-bold text-blue-700">{maintenanceSummary.inProgress}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                          <Bell size={18} className="text-slate-400" />
                          Quick Alerts
                        </h3>
                        <div className="space-y-3">
                          {occupancyRate > 90 && (
                            <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl text-rose-700 text-xs border border-rose-100">
                              <AlertCircle size={16} />
                              <span>High occupancy alert: {occupancyRate}% of rooms are full.</span>
                            </div>
                          )}
                          {maintenanceSummary.pending > 5 && (
                            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl text-amber-700 text-xs border border-amber-100">
                              <AlertCircle size={16} />
                              <span>Maintenance backlog: {maintenanceSummary.pending} pending requests.</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl text-indigo-700 text-xs border border-indigo-100">
                            <CheckCircle2 size={16} />
                            <span>System status: All services are running smoothly.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

            {activeTab === 'guests' && (
              <motion.div key="guests" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Guest Management</h2>
                  <button 
                    onClick={() => setIsAddGuestOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={16} /> Add Guest
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Guest List */}
                  <div className="lg:col-span-1 space-y-4">
                    {guests.map(guest => (
                      <button 
                        key={guest.id} 
                        onClick={() => setSelectedGuestId(guest.id)}
                        className={cn(
                          "w-full bg-white p-4 rounded-2xl border text-left transition-all",
                          selectedGuestId === guest.id ? "border-indigo-600 shadow-md" : "border-slate-100 hover:border-indigo-200"
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant={guest.type}>{guest.type}</Badge>
                          <Badge variant={guest.loyaltyTier}>{guest.loyaltyTier}</Badge>
                        </div>
                        <p className="font-bold text-slate-900">
                          {guest.type === 'Private' ? `${guest.firstName} ${guest.lastName}` : guest.companyName}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{guest.phone}</p>
                      </button>
                    ))}
                  </div>

                  {/* Guest Details */}
                  <div className="lg:col-span-2">
                    {selectedGuestId ? (
                      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {guests.filter(g => g.id === selectedGuestId).map(guest => (
                          <div key={guest.id}>
                            <div className="p-8 bg-slate-50 border-b border-slate-100">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-2xl font-bold mb-1">
                                    {guest.type === 'Private' ? `${guest.firstName} ${guest.lastName}` : guest.companyName}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <p className="text-slate-500 text-sm">Guest ID: {guest.id} • Joined {guest.createdDate}</p>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setViewingTier(guest.loyaltyTier);
                                      }}
                                      className="hover:opacity-80 transition-opacity"
                                    >
                                      <Badge variant={guest.loyaltyTier}>{guest.loyaltyTier}</Badge>
                                    </button>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Loyalty Points</p>
                                  <p className="text-2xl font-bold text-indigo-600">{guest.points.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>

                            <div className="p-8 space-y-8">
                              {/* Profile Info */}
                              <div className="grid grid-cols-2 gap-8">
                                <div>
                                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Information</h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm">
                                      <Bell size={14} className="text-slate-400" />
                                      <span>{guest.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                      <Bell size={14} className="text-slate-400" />
                                      <span>{guest.email || 'No email provided'}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    {guest.type === 'Private' ? 'Personal Details' : 'Company Details'}
                                  </h4>
                                  <div className="space-y-3 text-sm">
                                    {guest.type === 'Private' ? (
                                      <>
                                        <p><span className="text-slate-400">ID/Passport:</span> {guest.idNumber}</p>
                                        <p><span className="text-slate-400">Gender:</span> {guest.gender}</p>
                                      </>
                                    ) : (
                                      <>
                                        <p><span className="text-slate-400">Contact Person:</span> {guest.contactPerson}</p>
                                        <p><span className="text-slate-400">Company ID:</span> {guest.companyId}</p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Stays History */}
                              <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                  <History size={14} /> Stay History
                                </h4>
                                <div className="space-y-3">
                                  {stays.filter(s => s.guestId === guest.id).map(stay => {
                                    const room = rooms.find(r => r.id === stay.roomId);
                                    const roomType = ROOM_TYPES.find(t => t.id === room?.typeId);
                                    return (
                                      <div key={stay.id} className="p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                                        <div>
                                          <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-bold">Stay #{stay.id}</p>
                                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-bold uppercase tracking-wider">
                                              {roomType?.typeName} • ${roomType?.basePrice}
                                            </span>
                                          </div>
                                          <p className="text-xs text-slate-500">{stay.checkIn} to {stay.checkOut} • Room {room?.number}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <Badge variant={stay.status}>{stay.status}</Badge>
                                          <button 
                                            onClick={() => setSelectedStayId(stay.id)}
                                            className="text-indigo-600 text-xs font-bold hover:underline"
                                          >
                                            Details
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Payments */}
                              <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                  <CreditCard size={14} /> Recent Payments
                                </h4>
                                <div className="space-y-3">
                                  {payments.filter(p => stays.filter(s => s.guestId === guest.id).map(s => s.id).includes(p.stayId)).map(payment => (
                                    <div key={payment.id} className="p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                                      <div>
                                        <div className="flex items-baseline gap-2">
                                          <p className="text-sm font-bold">${payment.amount}</p>
                                          <p className="text-[10px] text-indigo-500 font-bold">+{Math.floor(payment.amount * 0.1)} pts</p>
                                        </div>
                                        <p className="text-xs text-slate-500">{payment.date} • {payment.method}</p>
                                      </div>
                                      <Badge variant={payment.status}>{payment.status}</Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Feedback */}
                              <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                  <MessageSquare size={14} /> Guest Feedback
                                </h4>
                                <div className="space-y-3">
                                  {feedbacks.filter(f => stays.filter(s => s.guestId === guest.id).map(s => s.id).includes(f.stayId)).map(feedback => (
                                    <div key={feedback.stayId} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                      <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                          <Star key={i} size={12} className={cn(i < feedback.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300")} />
                                        ))}
                                      </div>
                                      <p className="text-sm text-slate-700 italic">"{feedback.comment}"</p>
                                      <p className="text-[10px] text-slate-400 mt-2">{feedback.date}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200 p-12">
                        <Users size={48} className="mb-4 opacity-20" />
                        <p className="font-medium">Select a guest to view their profile and history</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'rooms' && (
              <motion.div key="rooms" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Rooms Management</h2>
                  <div className="flex gap-2">
                    {ROOM_STATUSES.map(status => (
                      <Badge key={status.id} variant={status.statusName}>{status.statusName}</Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {rooms.map(room => {
                    const type = ROOM_TYPES.find(t => t.id === room.typeId);
                    const status = ROOM_STATUSES.find(s => s.id === room.statusId);
                    return (
                      <div key={room.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold">Room {room.number}</h3>
                          <Badge variant={status?.statusName || 'Available'}>{status?.statusName}</Badge>
                        </div>
                        <div className="space-y-2 text-sm text-slate-500">
                          <p>Type: {type?.typeName}</p>
                          <p>Floor: {room.floor}</p>
                          <p className="font-bold text-indigo-600">${type?.basePrice}/night</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                          <button className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded">Edit</button>
                          <button className="text-[10px] font-bold text-slate-400 hover:bg-slate-50 px-2 py-1 rounded">Maintenance</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'reservations' && (
              <motion.div key="reservations" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Reservations</h2>
                  <button 
                    onClick={() => setIsAddStayOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={16} /> New Reservation
                  </button>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guest</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Room</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dates</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stays.map(stay => {
                        const guest = guests.find(g => g.id === stay.guestId);
                        const room = rooms.find(r => r.id === stay.roomId);
                        return (
                          <tr key={stay.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-sm">{guest?.type === 'Private' ? `${guest?.firstName} ${guest?.lastName}` : guest?.companyName}</p>
                              <p className="text-xs text-slate-400">{guest?.phone}</p>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">Room {room?.number}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">{stay.checkIn} - {stay.checkOut}</td>
                            <td className="px-6 py-4"><Badge variant={stay.status}>{stay.status}</Badge></td>
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => setSelectedStayId(stay.id)}
                                className="text-indigo-600 text-xs font-bold hover:underline"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'employees' && (
              <motion.div key="employees" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Employee Management</h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> Add Employee
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {employees.map(emp => {
                    const dept = DEPARTMENTS.find(d => d.id === emp.departmentId);
                    return (
                      <div key={emp.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold">{emp.name}</h3>
                            <p className="text-xs text-slate-400">{emp.role}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-slate-500">
                          <p>Department: {dept?.name}</p>
                          <p>Email: {emp.email}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div key="inventory" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Inventory & Supplies</h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> New Order
                  </button>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item Name</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stock Level</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Supplier</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inventory.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-sm">{item.name}</td>
                          <td className="px-6 py-4 text-sm">{item.stock} units</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{item.supplier}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                              item.stock < 150 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                            )}>
                              {item.stock < 150 ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'front-desk' && (
              <motion.div key="front-desk" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Front Desk Operations</h2>
                  <div className="flex gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Clock size={16} className="text-indigo-600" />
                      <span className="text-sm font-bold">{format(new Date(), 'HH:mm')}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Today's Arrivals</h3>
                    <div className="space-y-3">
                      {stays.filter(s => s.status === 'Future' && s.checkIn === format(new Date(), 'yyyy-MM-dd')).map(stay => {
                        const guest = guests.find(g => g.id === stay.guestId);
                        return (
                          <div key={stay.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                            <div>
                              <p className="font-bold">{guest?.type === 'Private' ? `${guest?.firstName} ${guest?.lastName}` : guest?.companyName}</p>
                              <p className="text-xs text-slate-500">Room {rooms.find(r => r.id === stay.roomId)?.number}</p>
                            </div>
                            <button 
                              onClick={() => handleCheckIn(stay.id)}
                              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
                            >
                              Check In
                            </button>
                          </div>
                        );
                      })}
                      {stays.filter(s => s.status === 'Future' && s.checkIn === format(new Date(), 'yyyy-MM-dd')).length === 0 && (
                        <p className="text-sm text-slate-400 italic">No arrivals scheduled for today.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Today's Departures</h3>
                    <div className="space-y-3">
                      {stays.filter(s => s.status === 'Current' && s.checkOut === format(new Date(), 'yyyy-MM-dd')).map(stay => {
                        const guest = guests.find(g => g.id === stay.guestId);
                        return (
                          <div key={stay.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                            <div>
                              <p className="font-bold">{guest?.type === 'Private' ? `${guest?.firstName} ${guest?.lastName}` : guest?.companyName}</p>
                              <p className="text-xs text-slate-500">Room {rooms.find(r => r.id === stay.roomId)?.number}</p>
                            </div>
                            <button 
                              onClick={() => handleCheckOut(stay.id)}
                              className="bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors"
                            >
                              Check Out
                            </button>
                          </div>
                        );
                      })}
                      {stays.filter(s => s.status === 'Current' && s.checkOut === format(new Date(), 'yyyy-MM-dd')).length === 0 && (
                        <p className="text-sm text-slate-400 italic">No departures scheduled for today.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'services' && (
              <motion.div key="services" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Hotel Services</h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> New Booking
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map(service => (
                      <div key={service.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Star size={20} />
                          </div>
                          <span className="text-lg font-bold text-indigo-600">${service.price}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-1">{service.name}</h3>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">{service.category}</p>
                        <button className="w-full mt-6 py-2 rounded-xl border border-indigo-100 text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-colors">Book Service</button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Bookings</h3>
                    <div className="space-y-3">
                      {serviceBookings.map(booking => {
                        const guest = guests.find(g => g.id === booking.guestId);
                        const service = services.find(s => s.id === booking.serviceId);
                        return (
                          <div key={booking.id} className="bg-white p-4 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-bold text-sm">{service?.name}</p>
                              <Badge variant={booking.status}>{booking.status}</Badge>
                            </div>
                            <p className="text-xs text-slate-500">Guest: {guest?.type === 'Private' ? `${guest?.firstName} ${guest?.lastName}` : guest?.companyName}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{format(new Date(booking.date), 'MMM d, HH:mm')}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'restaurant' && (
              <motion.div key="restaurant" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Restaurant & Room Service</h2>
                  <div className="flex gap-2">
                    <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold">Menu Management</button>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold">New Order</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {menuItems.map(item => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 font-bold text-sm">{item.name}</td>
                              <td className="px-6 py-4 text-sm text-slate-500">{item.category}</td>
                              <td className="px-6 py-4 text-sm font-bold">${item.price}</td>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                  item.available ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                )}>
                                  {item.available ? 'Available' : 'Sold Out'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Orders</h3>
                    <div className="space-y-3">
                      {restaurantOrders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-sm">Order #{order.id}</p>
                            <Badge variant={order.status}>{order.status}</Badge>
                          </div>
                          <p className="text-xs text-slate-500 mb-2">{order.type} • ${order.totalAmount}</p>
                          <div className="pt-2 border-t border-slate-50">
                            {order.items.map((item, idx) => (
                              <p key={idx} className="text-[10px] text-slate-400">
                                {item.quantity}x {menuItems.find(m => m.id === item.menuItemId)?.name}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Billing & Payments</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsAddPaymentOpen(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                    >
                      <Plus size={16} /> Record Payment
                    </button>
                    <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                      <Download size={16} /> Export Report
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-2">Total Revenue</p>
                    <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-2">Pending Payments</p>
                    <p className="text-2xl font-bold text-amber-600">${payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0)}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-2">Successful Transactions</p>
                    <p className="text-2xl font-bold text-emerald-600">{payments.filter(p => p.status === 'Completed').length}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map(payment => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 text-sm font-medium">{payment.id}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{payment.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold">${payment.amount}</span>
                              <span className="text-[10px] text-indigo-500 font-bold">+{Math.floor(payment.amount * 0.1)} pts</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{payment.method}</td>
                          <td className="px-6 py-4"><Badge variant={payment.status}>{payment.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'maintenance' && (
              <motion.div key="maintenance" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Maintenance Requests</h2>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    <Plus size={16} /> New Request
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {maintenanceRequests.map(request => (
                    <div key={request.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <Wrench size={18} className="text-slate-400" />
                          <h3 className="font-bold">Room {rooms.find(r => r.id === request.roomId)?.number}</h3>
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          request.priority === 'High' ? "bg-rose-50 text-rose-600" : 
                          request.priority === 'Medium' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                        )}>
                          {request.priority} Priority
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{request.description}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                        <Badge variant={request.status}>{request.status}</Badge>
                        <p className="text-[10px] text-slate-400">{format(new Date(request.requestedDate), 'MMM d, HH:mm')}</p>
                      </div>
                      <button className="w-full mt-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors">Update Status</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
              </>
            ) : (
              <motion.div key="guest-view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                {/* Guest Profile Header */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
                      {guests[0]?.type === 'Private' ? (guests[0]?.firstName?.[0] || '') + (guests[0]?.lastName?.[0] || '') : (guests[0]?.companyName?.[0] || 'G')}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        {guests[0]?.type === 'Private' ? `${guests[0]?.firstName} ${guests[0]?.lastName}` : guests[0]?.companyName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-500 text-sm">{guests[0]?.type} Guest • </span>
                        <button 
                          onClick={() => setViewingTier(guests[0]?.loyaltyTier)}
                          className="hover:opacity-80 transition-opacity"
                        >
                          <Badge variant={guests[0]?.loyaltyTier}>{guests[0]?.loyaltyTier}</Badge>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Accumulated Points</p>
                    <p className="text-3xl font-bold text-indigo-600">{guests[0]?.points.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => setGuestActiveTab('book')}
                    className={cn(
                      "px-6 py-2 rounded-xl font-bold text-sm transition-all",
                      guestActiveTab === 'book' ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500 hover:bg-indigo-50"
                    )}
                  >
                    Book a Room
                  </button>
                  <button 
                    onClick={() => setGuestActiveTab('feedback')}
                    className={cn(
                      "px-6 py-2 rounded-xl font-bold text-sm transition-all",
                      guestActiveTab === 'feedback' ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500 hover:bg-indigo-50"
                    )}
                  >
                    Give Feedback
                  </button>
                  <button 
                    onClick={() => setGuestActiveTab('history')}
                    className={cn(
                      "px-6 py-2 rounded-xl font-bold text-sm transition-all",
                      guestActiveTab === 'history' ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500 hover:bg-indigo-50"
                    )}
                  >
                    My Stays
                  </button>
                </div>

                {guestActiveTab === 'book' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ROOM_TYPES.map(type => (
                      <div key={type.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-300">
                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                          <img 
                            src={`https://picsum.photos/seed/${type.typeName}/800/600`} 
                            alt={type.typeName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 flex flex-col items-end">
                            <span>${type.basePrice}/night</span>
                            <span className="text-[10px] font-medium opacity-70">+{Math.floor(type.basePrice * 0.1)} points</span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2">{type.typeName}</h3>
                          <p className="text-slate-500 text-sm mb-6 line-clamp-2">Experience luxury and comfort in our {type.typeName.toLowerCase()} rooms, designed for a perfect stay.</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <Badge variant="Available">Available</Badge>
                            </div>
                            <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {guestActiveTab === 'feedback' && (
                  <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-2xl font-bold mb-6">Your Feedback Matters</h3>
                    <p className="text-slate-500 text-sm mb-8">How was your recent stay? We'd love to hear from you to improve our services.</p>
                    
                    <form className="space-y-6" onSubmit={(e) => {
                      e.preventDefault();
                      alert("Thank you for your feedback!");
                    }}>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} type="button" className="text-slate-300 hover:text-yellow-400 transition-colors">
                              <Star size={32} />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comment</label>
                        <textarea 
                          className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-600 outline-none text-sm min-h-[120px]"
                          placeholder="Tell us about your experience..."
                        ></textarea>
                      </div>
                      
                      <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                        Submit Feedback
                      </button>
                    </form>
                  </div>
                )}

                {guestActiveTab === 'history' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold mb-6">Your Stay History</h3>
                    {stays.slice(0, 3).map(stay => {
                      const room = rooms.find(r => r.id === stay.roomId);
                      const type = ROOM_TYPES.find(t => t.id === room?.typeId);
                      return (
                        <div key={stay.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <Bed size={24} />
                            </div>
                            <div>
                              <p className="font-bold">{type?.typeName} - Room {room?.number}</p>
                              <p className="text-sm text-slate-500">{stay.checkIn} to {stay.checkOut}</p>
                            </div>
                          </div>
                          <Badge variant={stay.status}>{stay.status}</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isAddGuestOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">Add New Guest</h3>
                <button onClick={() => setIsAddGuestOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              
              <div className="px-6 pt-6">
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setNewGuestType('Private')}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                      newGuestType === 'Private' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                    )}
                  >
                    Private Guest
                  </button>
                  <button 
                    onClick={() => setNewGuestType('Business')}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                      newGuestType === 'Business' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"
                    )}
                  >
                    Business Guest
                  </button>
                </div>
              </div>

              <form className="p-6 space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newGuest: Guest = {
                  id: `g${Date.now()}`,
                  phone: formData.get('phone') as string,
                  email: formData.get('email') as string,
                  type: newGuestType,
                  points: 0,
                  loyaltyTier: 'Bronze',
                  createdDate: format(new Date(), 'yyyy-MM-dd'),
                  ...(newGuestType === 'Private' ? {
                    firstName: formData.get('firstName') as string,
                    lastName: formData.get('lastName') as string,
                    idNumber: formData.get('idNumber') as string,
                    gender: formData.get('gender') as string,
                  } : {
                    companyName: formData.get('companyName') as string,
                    contactPerson: formData.get('contactPerson') as string,
                    companyId: formData.get('companyId') as string,
                  })
                };
                setGuests(prev => [...prev, newGuest]);
                setIsAddGuestOpen(false);
              }}>
                {newGuestType === 'Private' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
                        <input name="firstName" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Last Name</label>
                        <input name="lastName" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">ID Number</label>
                        <input name="idNumber" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Gender</label>
                        <select name="gender" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm bg-white">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Company Name</label>
                      <input name="companyName" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Person</label>
                        <input name="contactPerson" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Company ID (H.P)</label>
                        <input name="companyId" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Phone</label>
                  <input name="phone" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                  <input name="email" type="email" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-4">
                  Save Guest
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isAddStayOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">New Reservation</h3>
                <button onClick={() => setIsAddStayOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form className="p-6 space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newStay: Stay = {
                  id: `s${Date.now()}`,
                  guestId: formData.get('guestId') as string,
                  roomId: formData.get('roomId') as string,
                  checkIn: formData.get('checkIn') as string,
                  checkOut: formData.get('checkOut') as string,
                  status: 'Future'
                };
                setStays(prev => [...prev, newStay]);
                setIsAddStayOpen(false);
              }}>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Select Guest</label>
                  <select name="guestId" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm bg-white">
                    {guests.map(g => (
                      <option key={g.id} value={g.id}>{g.type === 'Private' ? `${g.firstName} ${g.lastName}` : g.companyName}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Select Room</label>
                  <select name="roomId" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm bg-white">
                    {rooms.filter(r => r.statusId === 'rs1').map(r => (
                      <option key={r.id} value={r.id}>Room {r.number} ({ROOM_TYPES.find(t => t.id === r.typeId)?.typeName})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Check In</label>
                    <input name="checkIn" type="date" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Check Out</label>
                    <input name="checkOut" type="date" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-4">
                  Create Reservation
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {viewingTier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">Loyalty Tier Details</h3>
                <button onClick={() => setViewingTier(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                {LOYALTY_TIERS.filter(t => t.tier === viewingTier).map(tier => (
                  <div key={tier.tier} className="space-y-6">
                    <div className="flex justify-between items-center">
                      <Badge variant={tier.tier}>{tier.tier}</Badge>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Min. Points</p>
                        <p className="text-xl font-bold text-indigo-600">{tier.minPoints.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50 p-4 rounded-2xl">
                      <p className="text-xs font-bold text-indigo-400 uppercase mb-1">Stay Discount</p>
                      <p className="text-3xl font-bold text-indigo-600">{tier.discount}%</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Tier Benefits</h4>
                      <ul className="space-y-2">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => setViewingTier(null)}
                  className="w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedStayId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              {(() => {
                const stay = stays.find(s => s.id === selectedStayId);
                const guest = guests.find(g => g.id === stay?.guestId);
                const room = rooms.find(r => r.id === stay?.roomId);
                const roomType = ROOM_TYPES.find(t => t.id === room?.typeId);
                const stayPayments = payments.filter(p => p.stayId === selectedStayId);
                const stayFeedback = feedbacks.find(f => f.stayId === selectedStayId);

                return (
                  <>
                    <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold">Stay Details #{stay?.id}</h3>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                          {stay?.status} Reservation
                        </p>
                      </div>
                      <button 
                        onClick={() => setSelectedStayId(null)}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-8 overflow-y-auto max-h-[70vh] space-y-8">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Guest Information</h4>
                          <div className="space-y-1">
                            <p className="font-bold">{guest?.type === 'Private' ? `${guest?.firstName} ${guest?.lastName}` : guest?.companyName}</p>
                            <p className="text-sm text-slate-500">{guest?.email}</p>
                            <p className="text-sm text-slate-500">{guest?.phone}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Room Information</h4>
                          <div className="space-y-1">
                            <p className="font-bold">Room {room?.number}</p>
                            <p className="text-sm text-slate-500">{roomType?.typeName}</p>
                            <p className="text-sm font-bold text-indigo-600">${roomType?.basePrice}/night</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Dates</h4>
                          <div className="space-y-1">
                            <p className="text-sm"><span className="text-slate-400">Check-in:</span> {stay?.checkIn}</p>
                            <p className="text-sm"><span className="text-slate-400">Check-out:</span> {stay?.checkOut}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Status</h4>
                          <Badge variant={stay?.status}>{stay?.status}</Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Payments</h4>
                        <div className="space-y-2">
                          {stayPayments.length > 0 ? stayPayments.map(p => (
                            <div key={p.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <div>
                                <p className="text-sm font-bold">${p.amount}</p>
                                <p className="text-[10px] text-slate-400">{p.date} • {p.method}</p>
                              </div>
                              <Badge variant={p.status}>{p.status}</Badge>
                            </div>
                          )) : (
                            <p className="text-sm text-slate-400 italic">No payments recorded for this stay.</p>
                          )}
                        </div>
                      </div>

                      {stayFeedback && (
                        <div>
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Guest Feedback</h4>
                          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={cn(i < stayFeedback.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300")} />
                              ))}
                            </div>
                            <p className="text-sm text-slate-700 italic">"{stayFeedback.comment}"</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                      <button 
                        onClick={() => setSelectedStayId(null)}
                        className="px-6 py-2 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        Close
                      </button>
                      {stay?.status === 'Future' && (
                        <button 
                          onClick={() => {
                            handleCheckIn(stay.id);
                            setSelectedStayId(null);
                          }}
                          className="px-6 py-2 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
                          Check In Now
                        </button>
                      )}
                      {stay?.status === 'Current' && (
                        <button 
                          onClick={() => {
                            handleCheckOut(stay.id);
                            setSelectedStayId(null);
                          }}
                          className="px-6 py-2 rounded-xl font-bold text-sm bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                        >
                          Check Out Now
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}

        {isAddPaymentOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">Record Payment</h3>
                <button onClick={() => setIsAddPaymentOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form className="p-6 space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleRecordPayment({
                  stayId: formData.get('stayId') as string,
                  amount: Number(formData.get('amount')),
                  method: formData.get('method') as any,
                  status: 'Completed',
                  date: format(new Date(), 'yyyy-MM-dd')
                });
                setIsAddPaymentOpen(false);
              }}>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Select Stay / Guest</label>
                  <select name="stayId" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm bg-white">
                    {stays.filter(s => s.status !== 'Past').map(s => {
                      const guest = guests.find(g => g.id === s.guestId);
                      return (
                        <option key={s.id} value={s.id}>
                          Stay #{s.id} - {guest?.type === 'Private' ? `${guest?.firstName} ${guest?.lastName}` : guest?.companyName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Amount ($)</label>
                    <input name="amount" type="number" required className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Payment Method</label>
                    <select name="method" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-sm bg-white">
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="PayPal">PayPal</option>
                    </select>
                  </div>
                </div>
                <p className="text-[10px] text-indigo-500 font-medium italic">
                  * This payment will award 10% in loyalty points to the guest.
                </p>
                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-4">
                  Confirm Payment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
