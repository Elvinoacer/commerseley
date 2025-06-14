"use client";
import { useSession } from "next-auth/react";
import OrderDetailsModal from "@/components/super-admin/order-details-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { AdminOrder, useOrderStore } from "@/store/useOrderStore";
import { useEffect, useState } from "react";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";

function SuperAdminManageOrdersPage() {
  const { data } = useSession();
  console.log("Here is your session: ", data);
  const { getAllOrders, adminOrders, updateOrderStatus, pagination, isLoading, setPagination } = useOrderStore();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    getAllOrders(pagination.currentPage, pagination.itemsPerPage);
  }, [pagination.currentPage, pagination.itemsPerPage]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-500 dark:bg-blue-400";
      case "PROCESSING":
        return "bg-yellow-500 dark:bg-yellow-400";
      case "SHIPPED":
        return "bg-purple-500 dark:bg-purple-400";
      case "DELIVERED":
        return "bg-green-500 dark:bg-green-400";
      default:
        return "bg-gray-500 dark:bg-gray-400";
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      toast({ title: "Status updated successfully" });
    } else {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ currentPage: newPage });
    }
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setPagination({
      itemsPerPage: newLimit,
      currentPage: 1, // Reset to first page when changing items per page
    });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (pagination.totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = pagination.totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (pagination.currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (pagination.currentPage + maxPagesAfterCurrent >= pagination.totalPages) {
        startPage = pagination.totalPages - maxVisiblePages + 1;
        endPage = pagination.totalPages;
      } else {
        startPage = pagination.currentPage - maxPagesBeforeCurrent;
        endPage = pagination.currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={pagination.currentPage === i ? "default" : "outline"}
          size="sm"
          className={`w-10 h-10 p-0 ${
            pagination.currentPage === i
              ? "bg-indigo-600 dark:bg-indigo-500 text-white"
              : "text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900"
          }`}
          onClick={() => handlePageChange(i)}
          aria-label={`Page ${i}`}
        >
          {i}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 p-6 space-y-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 bg-clip-text text-transparent">
              Orders List
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Items per page</span>
                <Select
                  value={pagination.itemsPerPage.toString()}
                  onValueChange={(value) => handleItemsPerPageChange(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[80px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder={pagination.itemsPerPage} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    {[5, 10, 20, 50].map((size) => (
                      <SelectItem
                        key={size}
                        value={size.toString()}
                        className="text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                      >
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 dark:border-gray-600">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableHead className="text-gray-900 dark:text-gray-100">Order ID</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Created At</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Customer</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Total</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Payment Status</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Items</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Order Status</TableHead>
                  <TableHead className="text-gray-900 dark:text-gray-100">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-[300px]">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : adminOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-[300px] text-gray-600 dark:text-gray-300">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  adminOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/50">
                      <TableCell
                        onClick={() => setSelectedOrder(order)}
                        className="font-semibold cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline"
                        aria-label={`View order ${order.id}`}
                      >
                        {order.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100">{order.user.name}</TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100">Kes {order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={order.paymentStatus === "COMPLETED" ? "default" : "secondary"}
                          className={
                            order.paymentStatus === "COMPLETED"
                              ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                              : "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                          }
                        >
                          {order.paymentStatus || "PENDING"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-gray-100">
                        {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(order.status)} text-white hover:${getStatusColor(order.status)}`}
                        >
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusUpdate(order.id, value as OrderStatus)}
                        >
                          <SelectTrigger className="w-[150px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                            <SelectItem
                              value="PENDING"
                              className="text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                            >
                              Pending
                            </SelectItem>
                            <SelectItem
                              value="PROCESSING"
                              className="text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                            >
                              Processing
                            </SelectItem>
                            <SelectItem
                              value="SHIPPED"
                              className="text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                            >
                              Shipped
                            </SelectItem>
                            <SelectItem
                              value="DELIVERED"
                              className="text-gray-900 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                            >
                              Delivered
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
                {pagination.totalItems} orders
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous</span>
                </Button>

                {renderPaginationButtons()}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>
          )}

          <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </div>
      </div>
    </div>
  );
}

export default SuperAdminManageOrdersPage;
