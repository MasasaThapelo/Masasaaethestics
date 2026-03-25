'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut, Menu, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Skip auth check for login page
    const isLoginPage = pathname === '/admin/login';

    useEffect(() => {
        if (isLoginPage) {
            setLoading(false);
            return;
        }

        const checkAuth = async () => {
            // Check for development bypass
            const isDevBypass = typeof window !== 'undefined' && localStorage.getItem('admin_dev_bypass') === 'true';

            if (isDevBypass) {
                setIsAuthenticated(true);
                setLoading(false);
                return;
            }

            if (!supabase) {
                // If supabase not configured, allow access for development UI preview
                setLoading(false);
                return;
            }

            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.push('/admin/login');
                } else {
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.error("Auth check failed", err);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [isLoginPage, router]);


    const handleLogout = async () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_dev_bypass');
        }
        if (supabase) await supabase.auth.signOut();
        router.push('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    // SINGLE RETURN to avoid hook ordering issues (Error #310)
    // We render the wrapper always, and conditionally render the content inside
    return (
        <div className="flex min-h-screen bg-gray-100">
            {isLoginPage ? (
                <div className="w-full h-full">{children}</div>
            ) : (
                <>
                    {/* Mobile Header */}
                    <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
                        <span className="text-xl font-bold text-primary">Masasa Admin</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="rounded-md p-2 text-gray-600 hover:bg-gray-100"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </header>

                    {/* Sidebar Overlay */}
                    {isMobileMenuOpen && (
                        <div
                            className="fixed inset-0 z-40 bg-black/50 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    )}

                    {/* Sidebar */}
                    <aside className={cn(
                        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform md:translate-x-0 flex flex-col",
                        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    )}>
                        <div className="flex h-16 items-center justify-center border-b px-6">
                            <span className="text-xl font-bold text-primary">Masasa Admin</span>
                        </div>

                        <nav className="flex-1 space-y-1 px-4 py-8">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="border-t p-4">
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 min-h-screen">
                        {loading ? (
                            <div className="flex h-[60vh] w-full items-center justify-center">
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <p className="text-sm text-gray-500 animate-pulse">Loading admin...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-500">
                                {children}
                            </div>
                        )}
                    </main>
                </>
            )}
        </div>
    );
}
