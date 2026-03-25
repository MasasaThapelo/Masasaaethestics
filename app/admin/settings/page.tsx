'use client';

import { Settings as SettingsIcon, Bell, Shield, Smartphone, Mail, Save } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500">Configure your store and notification preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b pb-4">
                            <SettingsIcon className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-bold">Store Configuration</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Store Name</label>
                                <input type="text" defaultValue="Masasa Aesthetics" className="w-full rounded-lg border-gray-200 focus:ring-primary/20 p-2 border" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Currency</label>
                                <select className="w-full rounded-lg border-gray-200 focus:ring-primary/20 p-2 border">
                                    <option>ZAR (R)</option>
                                    <option>USD ($)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b pb-4">
                            <Bell className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-bold">Notifications</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium">WhatsApp Notifications</p>
                                        <p className="text-xs text-gray-500">Notify customers via WhatsApp on order update</p>
                                    </div>
                                </div>
                                <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full transition-all" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium">Email Notifications</p>
                                        <p className="text-xs text-gray-500">Send order confirmation emails via Resend</p>
                                    </div>
                                </div>
                                <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full transition-all" />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <section className="bg-primary/5 p-6 rounded-xl border border-primary/10 space-y-4">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-bold text-primary">Security</h2>
                        </div>
                        <p className="text-sm text-gray-600">
                            Your admin panel is secured by Supabase Auth. Only authorized emails can access these pages.
                        </p>
                        <button className="text-sm font-medium text-primary hover:underline">
                            Change Password
                        </button>
                    </section>

                    <button className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all">
                        <Save className="h-5 w-5" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
