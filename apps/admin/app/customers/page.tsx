"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { User, Search, Phone, Mail, ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get("http://localhost:3002/api/v1/users");
      setCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
        <p className="text-slate-400">Manage your loyal customer base.</p>
      </div>

      <div className="stat-card !p-0 overflow-hidden">
          <table className="admin-table">
              <thead>
                  <tr>
                      <th>Customer</th>
                      <th>Contact Info</th>
                      <th>Total Orders</th>
                      <th>Role</th>
                  </tr>
              </thead>
              <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                        <td>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-500">
                                    {customer.name?.charAt(0) || "U"}
                                </div>
                                <span className="font-bold">{customer.name || "N/A"}</span>
                            </div>
                        </td>
                        <td>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <Mail className="w-3 h-3" /> {customer.email}
                                </div>
                                {customer.phone && (
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Phone className="w-3 h-3" /> {customer.phone}
                                    </div>
                                )}
                            </div>
                        </td>
                        <td>
                            <div className="flex items-center gap-2 font-black">
                                <ShoppingBag className="w-4 h-4 text-slate-500" />
                                {customer._count?.orders || 0}
                            </div>
                        </td>
                        <td>
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${customer.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500' : 'bg-slate-500/10 text-slate-400'}`}>
                                {customer.role}
                            </span>
                        </td>
                    </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
}
