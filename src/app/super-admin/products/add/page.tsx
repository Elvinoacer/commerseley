"use client";

import { protectProductFormAction } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCategoryStore } from "@/store/useCategories";
import { useProductStore } from "@/store/useProductStore";
import { sizes } from "@/utils/config";
import { Upload, Plus, X, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { HexColorPicker } from "react-colorful";

interface CategorySelectProps {
  categories: { id: string; name: string }[];
  value: string;
  onChange: (value: string) => void;
  onCreateNew?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

function SuperAdminManageProductPage() {
  const [formState, setFormState] = useState({
    name: "",
    brand: "",
    description: "",
    category: "",
    gender: "",
    categoryId: "",
    price: "",
    stock: "",
    isOnOffer: false,
    offerPrice: "",
  });

  const [selectedSizes, setSelectSizes] = useState<string[]>([]);
  const [selectedColors, setSelectColors] = useState<{ hex: string; name: string }[]>([]);
  const [selectedfiles, setSelectFiles] = useState<File[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState("#3B82F6");
  const [customColorName, setCustomColorName] = useState("");
  const [skus, setSkus] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);

  const { toast } = useToast();
  const { categories, fetchCategories } = useCategoryStore();
  const searchParams = useSearchParams();
  const getCurrentEditedProductId = searchParams.get("id");
  const isEditMode = !!getCurrentEditedProductId;

  const router = useRouter();
  const { createProduct, updateProduct, getProductById, isLoading, error } = useProductStore();

  useEffect(() => {
    if (isEditMode) {
      getProductById(getCurrentEditedProductId).then((product) => {
        if (product) {
          setFormState({
            name: product.name,
            brand: product.brand,
            description: product.description,
            category: product.category.name,
            gender: product.gender || "",
            categoryId: product?.categoryId,
            price: product.price.toString(),
            stock: product.stock.toString(),
            isOnOffer: product.isOnOffer || false,
            offerPrice: product.offerPrice?.toString() || "",
          });
          setSelectSizes(product.sizes);
          // Assuming product.colors is an array of objects with hex and name
          setSelectColors(product.colors || []);
          // If product has skus, initialize them
          setSkus(product.skus || [{ key: "", value: "" }]);
        }
      });
    }
    async function getCategories() {
      await fetchCategories();
    }
    getCategories();
  }, [isEditMode, getCurrentEditedProductId, getProductById]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleSize = (size: string) => {
    setSelectSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectFiles(Array.from(event.target.files));
    }
  };

  const handleOfferToggle = (checked: boolean) => {
    setFormState((prev) => ({
      ...prev,
      isOnOffer: checked,
      offerPrice: checked ? prev.offerPrice || "" : "",
    }));
  };

  const addCustomColor = () => {
    if (customColor && customColorName) {
      if (!selectedColors.some((c) => c.name === customColorName)) {
        setSelectColors([...selectedColors, { hex: customColor, name: customColorName }]);
      }
      setCustomColor("#3B82F6");
      setCustomColorName("");
      setShowColorPicker(false);
    }
  };

  const removeColor = (colorName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectColors(selectedColors.filter((c) => c.name !== colorName));
  };

  const handleSkuChange = (index: number, field: "key" | "value", value: string) => {
    const newSkus = [...skus];
    newSkus[index][field] = value;
    setSkus(newSkus);
  };

  const addSkuField = () => {
    setSkus([...skus, { key: "", value: "" }]);
  };

  const removeSkuField = (index: number) => {
    setSkus(skus.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const checkFirstLevelFormSanitization = await protectProductFormAction();

    if (!checkFirstLevelFormSanitization.success) {
      toast({
        title: checkFirstLevelFormSanitization.error,
      });
      return;
    }

    const formData = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    formData.append("sizes", selectedSizes.join(","));
    formData.append("colors", JSON.stringify(selectedColors));
    formData.append("skus", JSON.stringify(skus.filter((sku) => sku.key && sku.value)));

    if (!isEditMode) {
      selectedfiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    const result = isEditMode
      ? await updateProduct(getCurrentEditedProductId, formData)
      : await createProduct(formData);

    if (result) {
      router.push("/super-admin/products/list");
    } else {
      toast({
        title: error || "An error occurred while processing your request., please check all the fields and try again.",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <motion.header variants={itemVariants} className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
        </motion.header>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Left Column - Images and Basic Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            {isEditMode ? null : (
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="w-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 p-8 bg-blue-50"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-blue-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <Label className="cursor-pointer">
                      <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload images</span>
                      <input type="file" accept="image/*" className="sr-only" multiple onChange={handleFileChange} />
                    </Label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
                {selectedfiles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex flex-wrap gap-2 justify-center"
                  >
                    {selectedfiles.map((file, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="relative overflow-hidden rounded-md"
                      >
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          width={80}
                          height={80}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="space-y-4">
              <div>
                <Label className="text-gray-700">Product Name*</Label>
                <Input
                  name="name"
                  placeholder="Product Name"
                  className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  onChange={handleInputChange}
                  value={formState.name}
                  required
                />
              </div>

              <div>
                <Label className="text-gray-700">Brand*</Label>
                <Input
                  name="brand"
                  placeholder="Product Brand"
                  className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  onChange={handleInputChange}
                  value={formState.brand}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-gray-700">SKUs (Optional)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={addSkuField}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add SKU
                  </Button>
                </div>
                {skus.map((sku, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex gap-2 items-center mb-2"
                  >
                    <Input
                      placeholder="SKU Key (e.g., Size)"
                      value={sku.key}
                      onChange={(e) => handleSkuChange(index, "key", e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Input
                      placeholder="SKU Value (e.g., M123)"
                      value={sku.value}
                      onChange={(e) => handleSkuChange(index, "value", e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkuField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div>
                <Label className="text-gray-700">Product Description*</Label>
                <Textarea
                  name="description"
                  className="mt-1.5 min-h-[150px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Product description"
                  onChange={handleInputChange}
                  value={formState.description}
                  required
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Product Details */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-4">
              <div>
                <Label className="text-gray-700">Category*</Label>
                <Select
                  value={formState.categoryId}
                  onValueChange={(value) => handleSelectChange("categoryId", value)}
                  required
                >
                  <SelectTrigger className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select Category">
                      {categories.find((c) => c.id === formState.categoryId)?.name || "Select Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem value={item.id} key={item.id}>
                        {item.name || ""}
                      </SelectItem>
                    ))}
                    {categories.length === 0 && (
                      <div className="ml-3 py-2 text-sm text-muted-foreground">No categories found</div>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal h-8 text-blue-600 hover:text-blue-700"
                      onClick={() => router.push("/super-admin/categories")}
                    >
                      <span className="mr-2">+</span> Create new category
                    </Button>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700">Gender</Label>
                <Select
                  value={formState.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  name="gender"
                >
                  <SelectTrigger className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select Gender (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                    <SelectItem value="uni">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700">Size*</Label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {sizes.map((item) => (
                    <motion.button
                      key={item}
                      type="button"
                      onClick={() => handleToggleSize(item)}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1 text-sm rounded-full border ${
                        selectedSizes.includes(item)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Label className="text-gray-700">Colors*</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Color
                  </Button>
                </div>

                {showColorPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="mb-3">
                      <Label className="block mb-1">Color Name</Label>
                      <Input
                        value={customColorName}
                        onChange={(e) => setCustomColorName(e.target.value)}
                        placeholder="e.g. Midnight Blue"
                        className="w-full"
                        required
                      />
                    </div>
                    <HexColorPicker color={customColor} onChange={setCustomColor} />
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className="w-6 h-6 rounded-full mr-2 border border-gray-300"
                          style={{ backgroundColor: customColor }}
                        />
                        <span>{customColor}</span>
                      </div>
                      <Button type="button" size="sm" onClick={addCustomColor} disabled={!customColorName}>
                        Add Color
                      </Button>
                    </div>
                  </motion.div>
                )}

                <div className="mt-1.5 flex flex-wrap gap-4">
                  {selectedColors.map((color) => (
                    <motion.div
                      key={color.name}
                      whileHover={{ scale: 1.05 }}
                      className="relative flex flex-col items-center"
                    >
                      <button
                        type="button"
                        className="h-8 w-8 rounded-full ring-2 ring-blue-500 ring-offset-2"
                        style={{ backgroundColor: color.hex.startsWith("#") ? color.hex : `#${color.hex}` }}
                        title={color.name}
                      />
                      <span className="mt-1 text-xs text-gray-700 font-medium truncate max-w-[80px]">{color.name}</span>
                      <button
                        type="button"
                        onClick={(e) => removeColor(color.name, e)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700">Price*</Label>
                  <Input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter Product Price"
                    value={formState.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label className="text-gray-700">Stock*</Label>
                  <Input
                    name="stock"
                    type="number"
                    min="0"
                    className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter Product Stock"
                    value={formState.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="offer-toggle"
                    checked={formState.isOnOffer}
                    onCheckedChange={handleOfferToggle}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor="offer-toggle" className="text-gray-700">
                    On Offer
                  </Label>
                </div>

                {formState.isOnOffer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label className="text-gray-700">Offer Price</Label>
                    <Input
                      name="offerPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      className="mt-1.5 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter Offer Price"
                      value={formState.offerPrice}
                      onChange={handleInputChange}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isEditMode
                  ? isLoading
                    ? "Updating..."
                    : "Update Product"
                  : isLoading
                  ? "Creating..."
                  : "Create Product"}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

export default SuperAdminManageProductPage;
