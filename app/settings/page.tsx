"use client";

import { useState } from "react";
import Link from "next/link";
import { User, CreditCard, Bell, Shield, Crown, Check, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("subscription");

  const user = {
    name: "Demo User",
    email: "demo@zenvixy.com",
    isPremium: false,
    subscriptionEnds: null as Date | null,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight mb-8">Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-48 flex-shrink-0">
            <nav className="space-y-1">
              {[
                { key: "account", icon: User, label: "Account" },
                { key: "subscription", icon: CreditCard, label: "Subscription" },
                { key: "notifications", icon: Bell, label: "Notifications" },
                { key: "privacy", icon: Shield, label: "Privacy" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === item.key
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "subscription" && (
              <div className="space-y-6">
                <div className="p-6 bg-secondary/50 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Crown className={`w-6 h-6 ${user.isPremium ? "text-amber-500" : "text-muted-foreground"}`} />
                      <div>
                        <p className="font-medium">{user.isPremium ? "Premium Member" : "Free Plan"}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.isPremium ? `Renews ${user.subscriptionEnds?.toLocaleDateString()}` : "$4.99/month for Premium"}
                        </p>
                      </div>
                    </div>
                    {!user.isPremium && (
                      <Link href="/pricing" className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90">
                        Upgrade
                      </Link>
                    )}
                  </div>

                  {user.isPremium && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Check className="w-4 h-4" />
                        Active subscription
                      </div>
                    </div>
                  )}
                </div>

                {!user.isPremium && (
                  <div className="p-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <h3 className="font-semibold mb-2">Upgrade to Premium</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get unlimited high quality processing, no ads, cloud save, and more.
                    </p>
                    <ul className="space-y-2 text-sm mb-6">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Unlimited high quality output</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> No ads ever</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Cloud file saving</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Priority support</li>
                    </ul>
                    <Link href="/pricing" className="block w-full py-3 text-center bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90">
                      Go Premium - $4.99/mo
                    </Link>
                  </div>
                )}

                {user.isPremium && (
                  <div className="p-6 bg-secondary/50 rounded-2xl">
                    <h3 className="font-medium mb-4">Manage Subscription</h3>
                    <div className="space-y-3">
                      <button className="w-full py-2.5 px-4 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-medium transition-colors text-left">
                        Update payment method
                      </button>
                      <button className="w-full py-2.5 px-4 bg-secondary hover:bg-secondary/80 rounded-xl text-sm font-medium transition-colors text-left text-red-500">
                        Cancel subscription
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Your subscription will remain active until the end of your billing period.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="p-6 bg-secondary/50 rounded-2xl">
                  <h3 className="font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Subscription renewals", desc: "7-day and 1-day reminders before renewal", enabled: true },
                      { label: "New features", desc: "Get notified about new tools and features", enabled: true },
                      { label: "Tips & tricks", desc: "Occasional tips to get the most out of Zenvixy", enabled: false },
                    ].map((item) => (
                      <label key={item.label} className="flex items-center justify-between cursor-pointer">
                        <div>
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <input type="checkbox" defaultChecked={item.enabled} className="w-5 h-5 rounded border-border text-primary focus:ring-primary" />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-500">Subscription reminders</p>
                    <p className="text-blue-500/80">You'll always receive renewal reminders regardless of these settings.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-6">
                <div className="p-6 bg-secondary/50 rounded-2xl">
                  <h3 className="font-medium mb-4">Account Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Name</label>
                      <input type="text" defaultValue={user.name} className="w-full px-4 py-2.5 bg-background rounded-xl border border-border focus:border-primary focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Email</label>
                      <input type="email" defaultValue={user.email} className="w-full px-4 py-2.5 bg-background rounded-xl border border-border focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                  <button className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90">
                    Save changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div className="p-6 bg-secondary/50 rounded-2xl">
                  <h3 className="font-medium mb-4">Privacy</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    All file processing happens entirely in your browser. Your files never leave your device and are automatically deleted after processing.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> No file uploads to servers</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> No data collection or tracking</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Files auto-deleted after download</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> No cookies required</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
