"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryDialog from "./delete-dialogue";
import { Category } from "@/types";

interface CategoriesTableProps {
  categories: Category[];
  isLoading: boolean;
}

const CategoriesTable = ({ categories, isLoading }: CategoriesTableProps) => {
  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">No categories found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[120px]">Products</TableHead>
            <TableHead className="w-[150px]">Created At</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, i) => (
            <TableRow key={category.id}>
              <motion.div
                custom={i}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                transition={{ delay: i * 0.05 }}
                className="contents" // This makes the motion.div behave like a table row
              >
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="max-w-[300px] truncate">{category.description || "No description"}</TableCell>
                <TableCell>{category.products?.length || 0}</TableCell>
                <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <EditCategoryModal category={category}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </EditCategoryModal>
                    <DeleteCategoryDialog categoryId={category.id}>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </DeleteCategoryDialog>
                  </div>
                </TableCell>
              </motion.div>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesTable;
