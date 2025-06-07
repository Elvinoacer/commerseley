// components/admin/categories/DeleteCategoryDialog.tsx
"use client";

import { useState } from "react";
import { useCategoryStore } from "@/store/useCategories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCustomersStore } from "@/store/useCustomerStore";
import { useRouter } from "next/navigation";

interface DeleteCategoryDialogProps {
  categoryId?: string;
  customerId?: string;
  children: React.ReactNode;
}

const DeleteDialog = ({ categoryId, children, customerId }: DeleteCategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const { deleteCategory } = useCategoryStore();
  const { deleteCustomer } = useCustomersStore();
  const router = useRouter();

  const handleDeleteCategory = async () => {
    try {
      const success = categoryId ? await deleteCategory(categoryId) : false;
      if (success) {
        toast.success("Category deleted successfully");
      } else {
        toast.error("Failed to delete category");
      }
      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };
  async function handleDeleteCustomer(customerId: string) {
    try {
      const success = await deleteCustomer(customerId);
      if (success) {
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
      setOpen(false);
    } catch (error) {
      toast.error("Failed to delete user");
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        {children}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {categoryId ? "category" : "user"} and
              remove all associated products from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              // @ts-ignore
              onClick={customerId ? handleDeleteCustomer(customerId) : handleDeleteCategory}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteDialog;
