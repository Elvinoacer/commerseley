"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Address, useAddressStore } from "@/store/useAddressStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const initialAddressFormState = {
  name: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
  phone: "",
  isDefault: false,
};

function UserAccountPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const {
    isLoading: addressesLoading,
    addresses,
    error: addressesError,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  } = useAddressStore();
  const [showAddresses, setShowAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialAddressFormState);
  const { toast } = useToast();
  const { userOrders, getOrdersByUserId, isLoading } = useOrderStore();

  useEffect(() => {
    fetchAddresses();
    getOrdersByUserId();
  }, [fetchAddresses, getOrdersByUserId]);

  const handleAddressSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (editingAddress) {
        const result = await updateAddress(editingAddress, formData);
        if (result) {
          fetchAddresses();
          setEditingAddress(null);
          toast({
            title: "Address updated successfully",
          });
        }
      } else {
        const result = await createAddress(formData);
        if (result) {
          fetchAddresses();
          toast({
            title: "Address created successfully",
          });
        }
      }

      setShowAddresses(false);
      setFormData(initialAddressFormState);
    } catch (err) {
      toast({
        title: "Error saving address",
        variant: "destructive",
      });
    }
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      name: address.name,
      address: address.address,
      city: address.city,
      country: address.country,
      phone: address.phone,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });

    setEditingAddress(address.id);
    setShowAddresses(true);
  };

  const handleDeleteAddress = async (id: string) => {
    const confirmed = window.confirm("Please confirm address deletion?");

    if (confirmed) {
      try {
        const success = await deleteAddress(id);
        if (success) {
          toast({
            title: "Address deleted successfully",
          });
        } else {
          toast({
            title: "Unable to delete the address",
            variant: "destructive",
          });
        }
      } catch (e) {
        toast({
          title: "Failed to delete address",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return isDark ? "bg-blue-600" : "bg-blue-500";
      case "PROCESSING":
        return isDark ? "bg-yellow-600" : "bg-yellow-500";
      case "SHIPPED":
        return isDark ? "bg-purple-600" : "bg-purple-500";
      case "DELIVERED":
        return isDark ? "bg-green-600" : "bg-green-500";
      default:
        return isDark ? "bg-gray-600" : "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", isDark ? "bg-gray-900" : "bg-gray-50")}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen py-8",
        isDark ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-gray-50 to-gray-100"
      )}
    >
      <div className="container mx-auto px-4">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
              className={cn(
                "absolute rounded-full",
                isDark ? "bg-indigo-700/10 blur-[1px]" : "bg-indigo-300/30 blur-[1px]"
              )}
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>MY ACCOUNT</h1>
        </motion.div>

        <Tabs defaultValue="orders" className="space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <TabsList className={cn("grid w-full grid-cols-2", isDark ? "bg-gray-800" : "bg-gray-200")}>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="orders">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className={cn("border", isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
                <CardContent className="p-6">
                  <h2 className={cn("text-xl font-semibold mb-6", isDark ? "text-white" : "text-gray-900")}>
                    Order History
                  </h2>

                  {userOrders.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                      <h3 className={cn("text-2xl font-bold mb-4", isDark ? "text-gray-300" : "text-gray-600")}>
                        You haven't placed any orders yet.
                      </h3>
                      <Button
                        className={cn(
                          "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                          "text-white"
                        )}
                      >
                        Start Shopping
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className={isDark ? "bg-gray-700" : "bg-gray-100"}>
                          <TableRow>
                            <TableHead className={isDark ? "text-gray-200" : "text-gray-800"}>Order #</TableHead>
                            <TableHead className={isDark ? "text-gray-200" : "text-gray-800"}>Date</TableHead>
                            <TableHead className={isDark ? "text-gray-200" : "text-gray-800"}>Items</TableHead>
                            <TableHead className={isDark ? "text-gray-200" : "text-gray-800"}>Status</TableHead>
                            <TableHead className={isDark ? "text-gray-200" : "text-gray-800"}>Total</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {userOrders.map((order) => (
                            <motion.tr
                              key={order.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className={cn(
                                "border-b",
                                isDark ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"
                              )}
                            >
                              <TableCell className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                                #{order.id.slice(0, 8)}
                              </TableCell>
                              <TableCell className={isDark ? "text-gray-300" : "text-gray-700"}>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className={isDark ? "text-gray-300" : "text-gray-700"}>
                                {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                              </TableCell>
                              <TableCell>
                                <Badge className={`${getStatusColor(order.status)} text-white`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                                Kes {order.total.toFixed(2)}
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="addresses">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className={cn("border", isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200")}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>Addresses</h2>
                    <Button
                      onClick={() => {
                        setEditingAddress(null);
                        setFormData(initialAddressFormState);
                        setShowAddresses(true);
                      }}
                      className={cn(
                        "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                        "text-white"
                      )}
                    >
                      Add New Address
                    </Button>
                  </div>

                  {addressesLoading ? (
                    <div className="flex justify-center py-8">
                      <div
                        className={cn(
                          "animate-spin rounded-full h-10 w-10 border-t-2 border-b-2",
                          isDark ? "border-indigo-500" : "border-indigo-600"
                        )}
                      />
                    </div>
                  ) : showAddresses ? (
                    <motion.form
                      onSubmit={handleAddressSubmit}
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-2">
                        <Label className={isDark ? "text-gray-300" : "text-gray-700"}>Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          required
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your name"
                          className={cn(isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className={isDark ? "text-gray-300" : "text-gray-700"}>Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          required
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Enter your address"
                          className={cn(isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300")}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className={isDark ? "text-gray-300" : "text-gray-700"}>City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            required
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Enter your city"
                            className={cn(
                              isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className={isDark ? "text-gray-300" : "text-gray-700"}>Country</Label>
                          <Input
                            id="country"
                            value={formData.country}
                            required
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            placeholder="Enter your country"
                            className={cn(
                              isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                            )}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className={isDark ? "text-gray-300" : "text-gray-700"}>Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={formData.postalCode}
                            required
                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                            placeholder="Enter your postal code"
                            className={cn(
                              isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className={isDark ? "text-gray-300" : "text-gray-700"}>Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            required
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Enter your phone"
                            className={cn(
                              isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                          id="default"
                          checked={formData.isDefault}
                          onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })}
                          className={cn(
                            isDark
                              ? "data-[state=checked]:bg-indigo-500 border-gray-600"
                              : "data-[state=checked]:bg-indigo-600 border-gray-300"
                          )}
                        />
                        <Label htmlFor="default" className={isDark ? "text-gray-300" : "text-gray-700"}>
                          Set as default address
                        </Label>
                      </div>
                      <div className="flex space-x-2 pt-4">
                        <Button
                          type="submit"
                          className={cn(
                            "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                            "text-white"
                          )}
                        >
                          {editingAddress ? "Update" : "Add"} Address
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowAddresses(false);
                            setEditingAddress(null);
                          }}
                          className={cn(
                            isDark ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"
                          )}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.form>
                  ) : (
                    <div className="space-y-4">
                      {addresses.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                          <h3 className={cn("text-xl font-semibold mb-4", isDark ? "text-gray-300" : "text-gray-600")}>
                            No addresses saved yet
                          </h3>
                          <Button
                            onClick={() => setShowAddresses(true)}
                            className={cn(
                              "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
                              "text-white"
                            )}
                          >
                            Add Your First Address
                          </Button>
                        </motion.div>
                      ) : (
                        <AnimatePresence>
                          {addresses.map((address) => (
                            <motion.div
                              key={address.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Card
                                className={cn(
                                  "border",
                                  isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200",
                                  "hover:shadow-md transition-shadow"
                                )}
                              >
                                <CardContent className="p-5">
                                  <div className="flex flex-col mb-5">
                                    <div className="flex justify-between items-start">
                                      <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>
                                        {address.name}
                                      </p>
                                      {address.isDefault && (
                                        <Badge variant="secondary" className="mb-2">
                                          Default
                                        </Badge>
                                      )}
                                    </div>
                                    <p className={cn("mb-2 font-semibold", isDark ? "text-gray-300" : "text-gray-700")}>
                                      {address.address}
                                    </p>
                                    <p className={cn("mb-2", isDark ? "text-gray-400" : "text-gray-600")}>
                                      {address.city}, {address.country}, {address.postalCode}
                                    </p>
                                    <p className={cn(isDark ? "text-gray-400" : "text-gray-600")}>
                                      Phone: {address.phone}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      onClick={() => handleEditAddress(address)}
                                      variant={"outline"}
                                      size={"sm"}
                                      className={cn(
                                        isDark
                                          ? "border-gray-600 hover:bg-gray-600"
                                          : "border-gray-300 hover:bg-gray-100"
                                      )}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteAddress(address.id)}
                                      variant={"destructive"}
                                      size={"sm"}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserAccountPage;
