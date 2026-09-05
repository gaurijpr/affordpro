import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  User as UserIcon, ShoppingBag, Download, GraduationCap, Heart, 
  Settings, LogOut, Package, CheckCircle2, Clock, Sparkles, Key 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { orderService } from '../services/orderService';
import { Order } from '../types/order';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';

export const Account: React.FC = () => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { wishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const data = await orderService.getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
    });
  };

  // Derive downloads & courses from orders
  const downloads = orders.flatMap((o) =>
    o.items.filter((i) => i.productType !== 'COURSE' && i.productType !== 'SERVICE')
  );

  const courses = orders.flatMap((o) =>
    o.items.filter((i) => i.productType === 'COURSE')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'User Dashboard' }]} />

      {/* Account Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{user?.name}</h1>
            <p className="text-slate-400 text-xs mt-0.5">{user?.email} • {user?.phone || 'No phone added'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tab Sidebar */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-3xl p-4 card-shadow space-y-1">
          <button
            onClick={() => setSearchParams({ tab: 'dashboard' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'orders' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              activeTab === 'orders'
                ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            My Orders ({orders.length})
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'downloads' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              activeTab === 'downloads'
                ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Download className="w-4 h-4" />
            My Downloads ({downloads.length})
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'courses' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              activeTab === 'courses'
                ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            My Courses ({courses.length})
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'wishlist' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              activeTab === 'wishlist'
                ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-4 h-4" />
            Wishlist ({wishlist.length})
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'profile' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
              activeTab === 'profile'
                ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            Profile Settings
          </button>
        </div>

        {/* Tab Main Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Total Orders</span>
                  <div className="text-2xl font-black text-slate-900">{orders.length}</div>
                </div>

                <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Active Courses</span>
                  <div className="text-2xl font-black text-amber-600">{courses.length}</div>
                </div>

                <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Downloads</span>
                  <div className="text-2xl font-black text-emerald-600">{downloads.length}</div>
                </div>

                <div className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Saved Items</span>
                  <div className="text-2xl font-black text-indigo-600">{wishlist.length}</div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 card-shadow space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Recent Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-xs text-slate-500">No orders placed yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 2).map((order) => (
                      <div key={order.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{order.orderNumber}</div>
                          <div className="text-slate-500">{order.date} • {order.items.length} items</div>
                        </div>
                        <span className="font-black text-indigo-600">₹{order.total}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 card-shadow space-y-6">
              <h2 className="text-xl font-black text-slate-900">My Orders</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-400 block font-medium">Order Number</span>
                        <span className="font-bold text-slate-900">{order.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Date</span>
                        <span className="font-bold text-slate-900">{order.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Status</span>
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                          {order.paymentStatus}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Total</span>
                        <span className="font-black text-indigo-600">₹{order.total}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <img src={item.productImage} alt="" className="w-10 h-10 object-cover rounded-lg" />
                            <span className="font-bold text-slate-900 line-clamp-1">{item.productTitle}</span>
                          </div>
                          {item.downloadUrl && (
                            <a href={item.downloadUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">
                              Download
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MY DOWNLOADS */}
          {activeTab === 'downloads' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 card-shadow space-y-6">
              <h2 className="text-xl font-black text-slate-900">My Downloads</h2>
              <div className="space-y-3">
                {downloads.map((dl, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={dl.productImage} alt="" className="w-12 h-12 object-cover rounded-xl" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{dl.productTitle}</h4>
                        <span className="text-xs text-emerald-600 font-semibold">Ready for Download</span>
                      </div>
                    </div>
                    <a
                      href={dl.downloadUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MY COURSES */}
          {activeTab === 'courses' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 card-shadow space-y-6">
              <h2 className="text-xl font-black text-slate-900">My Courses</h2>
              <div className="space-y-4">
                {courses.map((course, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={course.productImage} alt="" className="w-12 h-12 object-cover rounded-xl" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{course.productTitle}</h4>
                        <span className="text-xs text-amber-600 font-semibold">Enrolled • Lifetime Access</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" />
                      Start Learning
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">Saved Wishlist ({wishlist.length})</h2>
              {wishlist.length === 0 ? (
                <p className="text-xs text-slate-500">No items saved in wishlist.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 card-shadow space-y-6">
              <h2 className="text-xl font-black text-slate-900">Profile Settings</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <Button type="submit" variant="primary" size="md">
                  Save Changes
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
