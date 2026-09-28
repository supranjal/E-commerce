"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  RefreshCw,
  Mail,
  Send,
  Package,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminOrders, updateOrderStatus } from "@/actions/order-actions";
import { OrderStatus } from "@/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    Record<string, OrderStatus>
  >({});
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>(
    {},
  );
  const [feedback, setFeedback] = useState<{
    id: string;
    message: string;
    isDuplicate?: boolean;
  } | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getAdminOrders();
      if (res.success && res.orders) {
        setOrders(res.orders);
        const initialStatus: Record<string, OrderStatus> = {};
        const initialTracking: Record<string, string> = {};
        res.orders.forEach((o: any) => {
          initialStatus[o.id] = o.status as OrderStatus;
          if (o.trackingNumber) initialTracking[o.id] = o.trackingNumber;
        });
        setSelectedStatus(initialStatus);
        setTrackingInputs(initialTracking);
      } else {
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (orderId: string) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) return;

    setUpdatingId(orderId);
    setFeedback(null);

    try {
      const trackingNumber = trackingInputs[orderId];
      const res = await updateOrderStatus({
        orderId,
        newStatus,
        trackingNumber,
      });

      if (res.success) {
        setFeedback({
          id: orderId,
          message: res.isDuplicate
            ? "Status unchanged. Duplicate notification blocked."
            : `Order updated to ${newStatus}.`,
          isDuplicate: res.isDuplicate,
        });
        await loadOrders();
      } else {
        setFeedback({
          id: orderId,
          message: res.error || "Update failed",
          isDuplicate: false,
        });
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-sacred-200 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-sacred-950">
            Customer Orders & Shipments
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Fulfillment lifecycle management, status transition triggers,
            duplicate protection, and automated email dispatches.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadOrders}
          disabled={loading}
          className="gap-1.5 h-8 text-xs border-sacred-300"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Refresh Orders
        </Button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-sacred-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-sacred-100/80 border-b border-sacred-200 font-serif font-bold text-sacred-900 uppercase tracking-wider">
              <tr>
                <th className="p-4">Order Reference</th>
                <th className="p-4">Customer & City</th>
                <th className="p-4">Purchased Specimen</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fulfillment Status Transition</th>
                <th className="p-4">Tracking Number</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sacred-100">
              {orders.map((order) => {
                const isSelectedSame =
                  (selectedStatus[order.id] || order.status) === order.status;
                const itemsDisplay =
                  order.items && order.items.length > 0
                    ? order.items
                        .map((i: any) => i.product?.name || "Sacred Specimen")
                        .join(", ")
                    : "Rudraksha Specimen";

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-sacred-50/50 transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-sacred-950">
                      <span>{order.orderNumber || order.id}</span>
                      <span className="text-[10px] text-muted-foreground block font-sans">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-sacred-950 block">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        {order.customerEmail}
                      </span>
                      <span className="text-[10px] text-sacred-700">
                        {order.city || "Nepal"}
                      </span>
                    </td>

                    <td
                      className="p-4 text-sacred-800 max-w-[200px] truncate"
                      title={itemsDisplay}
                    >
                      {itemsDisplay}
                    </td>

                    <td className="p-4 font-bold text-sacred-950">
                      {order.currency || "NPR"} {order.total?.toLocaleString()}
                    </td>

                    <td className="p-4 space-y-1">
                      <span className="px-2 py-0.5 rounded font-mono font-semibold text-[10px] bg-sacred-100 text-sacred-900 border border-sacred-200 block w-fit">
                        {order.paymentMethod}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[9px] block w-fit ${
                          order.paymentStatus === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4">
                      <div className="space-y-1.5 min-w-[140px]">
                        <select
                          value={selectedStatus[order.id] || order.status}
                          onChange={(e) =>
                            setSelectedStatus({
                              ...selectedStatus,
                              [order.id]: e.target.value as OrderStatus,
                            })
                          }
                          className="w-full text-xs font-bold rounded-lg border border-sacred-300 p-1.5 bg-sacred-50 focus:bg-white"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>

                        {feedback && feedback.id === order.id && (
                          <div
                            className={`text-[10px] font-semibold ${
                              feedback.isDuplicate
                                ? "text-amber-700"
                                : "text-emerald-700"
                            }`}
                          >
                            {feedback.message}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Tracking Number Input */}
                    <td className="p-4">
                      <input
                        type="text"
                        placeholder="e.g. HK-KTM-8821"
                        value={trackingInputs[order.id] || ""}
                        onChange={(e) =>
                          setTrackingInputs({
                            ...trackingInputs,
                            [order.id]: e.target.value,
                          })
                        }
                        className="w-32 px-2 py-1 text-xs font-mono rounded border border-sacred-300 bg-sacred-50 focus:bg-white"
                      />
                    </td>

                    {/* Update Action Button */}
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={updatingId === order.id || isSelectedSame}
                          onClick={() => handleStatusChange(order.id)}
                          className="h-7 text-xs px-2.5 gap-1 shadow-xs"
                        >
                          {updatingId === order.id ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Mail className="w-3 h-3" />
                          )}
                          {isSelectedSame ? "Current" : "Apply Status"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-muted-foreground text-xs"
                  >
                    No customer orders recorded in database yet. Orders placed
                    during checkout will appear here with live lifecycle and
                    tracking controls.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
