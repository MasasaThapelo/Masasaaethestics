'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Package, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { products as localProducts } from '@/data/products';
import { Order } from '@/lib/types';

export default function DashboardPage() {
    const [stats, setStats] = useState([
        { name: 'Total Revenue', value: 'R0.00', icon: DollarSign, trend: '--' },
        { name: 'Active Orders', value: '0', icon: ShoppingCart, trend: '--' },
        { name: 'Products', value: localProducts.length.toString(), icon: Package, trend: 'In Stock' },
        { name: 'Growth', value: '0%', icon: TrendingUp, trend: 'Last Month' },
    ]);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!supabase) {
                setIsLoading(false);
                return;
            }

            try {
                // Fetch orders for stats
                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('createdAt', { ascending: false });

                if (ordersError) throw ordersError;

                if (orders) {
                    const totalRevenue = orders
                        .filter(o => o.status !== 'cancelled')
                        .reduce((sum, o) => sum + (o.total || 0), 0);

                    const activeOrders = orders.filter(o =>
                        !['delivered', 'cancelled'].includes(o.status)
                    ).length;

                    setStats([
                        { name: 'Total Revenue', value: `R${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+0%' },
                        { name: 'Active Orders', value: activeOrders.toString(), icon: ShoppingCart, trend: `+${activeOrders}` },
                        { name: 'Products', value: localProducts.length.toString(), icon: Package, trend: 'In Stock' },
                        { name: 'Growth', value: '0%', icon: TrendingUp, trend: 'Experimental' },
                    ]);

                    setRecentOrders(orders.slice(0, 5));
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Overview of your store's performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className="rounded-full bg-primary/10 p-3 text-primary">
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className={cn(
                                "font-medium",
                                stat.trend.startsWith('+') ? "text-green-600" : "text-gray-400"
                            )}>
                                {stat.trend}
                            </span>
                            <span className="ml-2 text-gray-400">vs last period</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
                    <a href="/admin/orders" className="text-sm font-medium text-primary hover:underline">View all</a>
                </div>
                <div className="overflow-x-auto">
                    {recentOrders.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm font-medium">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.map((order) => (
                                    <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{order.orderId}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.name}</td>
                                        <td className="px-6 py-4 text-gray-900">R{order.total.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                order.status === 'delivered' ? "bg-green-100 text-green-800" :
                                                    order.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-blue-100 text-blue-800"
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <p>No orders found yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper to use cn (added locally because imports might be tricky in snippets)
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
