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
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";

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

const colorButtonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
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
            description: product.description || "",
            category: product.category?.name || "",
            gender: product.gender || "",
            categoryId: product.categoryId,
            price: product.price.toString(),
            stock: product.stock.toString(),
            isOnOffer: product.isOnOffer || false,
            offerPrice: product.offerPrice?.toString() || "",
          });

          setSelectSizes(product.sizes || []);
          setSelectColors(typeof product.colors === "string" ? JSON.parse(product.colors) : product.colors || []);
          setSkus(
            typeof product.skus === "string" ? JSON.parse(product.skus) : product.skus || [{ key: "", value: "" }]
          );
        }
      });
    }
    fetchCategories();
  }, [isEditMode, getCurrentEditedProductId]);

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
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
      >
        <motion.header
          variants={itemVariants}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 p-8 text-white"
        >
          <h1 className="text-3xl font-extrabold tracking-tight">{isEditMode ? "Edit Product" : "Add New Product"}</h1>
          <p className="mt-2 text-indigo-100 dark:text-indigo-200 text-sm">
            Fill out the details below to {isEditMode ? "update" : "create"} your product.
          </p>
        </motion.header>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8">
          {/* Left Column - Images and Basic Info */}
          <motion.div variants={itemVariants} className="space-y-8">
            {isEditMode ? null : (
              <motion.div
                variants={colorButtonVariants}
                whileHover="hover"
                whileTap="tap"
                className={cn(
                  "w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10",
                  "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/50 dark:border-indigo-700 dark:bg-indigo-900/50 dark:hover:bg-indigo-800/50",
                  "transition-all duration-300 shadow-sm"
                )}
              >
                <div className="text-center">
                  <Upload className="mx-auto h-16 w-16 text-indigo-500 dark:text-indigo-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-300">
                    <Label className="cursor-pointer">
                      <span className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                        Upload images
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        multiple
                        onChange={handleFileChange}
                        aria-label="Upload product images"
                      />
                    </Label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
                {selectedfiles.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 grid grid-cols-3 gap-4">
                    {selectedfiles.map((file, index) => (
                      <motion.div
                        key={index}
                        variants={colorButtonVariants}
                        whileHover="hover"
                        className="relative overflow-hidden rounded-lg shadow-sm"
                      >
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          width={100}
                          height={100}
                          className="h-24 w-24 object-cover rounded-lg"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <Label className="text-gray-700 dark:text-gray-200 font-medium">
                  Product Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  name="name"
                  placeholder="Enter product name"
                  className="mt-2 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  onChange={handleInputChange}
                  value={formState.name}
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200 font-medium">
                  Brand<span className="text-red-500">*</span>
                </Label>
                <Input
                  name="brand"
                  placeholder="Enter brand name"
                  className="mt-2 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  onChange={handleInputChange}
                  value={formState.brand}
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-gray-700 dark:text-gray-200 font-medium">SKUs (Optional)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900 transition-all"
                    onClick={addSkuField}
                    aria-label="Add SKU field"
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
                    className="flex gap-3 items-center mb-3"
                  >
                    <Input
                      placeholder="SKU Key (e.g., Size)"
                      value={sku.key}
                      onChange={(e) => handleSkuChange(index, "key", e.target.value)}
                      className="rounded-lg border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      aria-label={`SKU key ${index + 1}`}
                    />
                    <Input
                      placeholder="SKU Value (e.g., M123)"
                      value={sku.value}
                      onChange={(e) => handleSkuChange(index, "value", e.target.value)}
                      className="rounded-lg border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      aria-label={`SKU value ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkuField(index)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900 transition-all"
                      aria-label={`Remove SKU ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200 font-medium">
                  Product Description<span className="text-red-500">*</span>
                </Label>
                <Textarea
                  name="description"
                  className="mt-2 min-h-[160px] rounded-lg border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Describe your product"
                  onChange={handleInputChange}
                  value={formState.description}
                  required
                  aria-required="true"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Product Details */}
          <motion.div variants={itemVariants} className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <Label className="text-gray-700 dark:text-gray-200 font-medium">
                  Category<span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formState.categoryId}
                  onValueChange={(value) => handleSelectChange("categoryId", value)}
                  required
                  aria-required="true"
                >
                  <SelectTrigger className="mt-2 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Select Category">
                      {categories.find((c) => c.id === formState.categoryId)?.name || "Select Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                    {categories.map((item) => (
                      <SelectItem value={item.id} key={item.id} className="hover:bg-indigo-50 dark:hover:bg-indigo-900">
                        {item.name || ""}
                      </SelectItem>
                    ))}
                    {categories.length === 0 && (
                      <div className="ml-3 py-2 text-sm text-gray-500 dark:text-gray-400">No categories found</div>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-normal h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900"
                      onClick={() => router.push("/super-admin/categories")}
                      aria-label="Create new category"
                    >
                      <span className="mr-2">+</span> Create new category
                    </Button>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200 font-medium">Gender</Label>
                <Select
                  value={formState.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  name="gender"
                >
                  <SelectTrigger className="mt-2 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Select Gender (Optional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                    <SelectItem value="men" className="hover:bg-indigo-50 dark:hover:bg-indigo-900">
                      Men
                    </SelectItem>
                    <SelectItem value="women" className="hover:bg-indigo-50 dark:hover:bg-indigo-900">
                      Women
                    </SelectItem>
                    <SelectItem value="kids" className="hover:bg-indigo-50 dark:hover:bg-indigo-900">
                      Kids
                    </SelectItem>
                    <SelectItem value="uni" className="hover:bg-indigo-50 dark:hover:bg-indigo-900">
                      Unisex
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200 font-medium">
                  Size<span className="text-red-500">*</span>
                </Label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {sizes.map((item) => (
                    <motion.button
                      key={item}
                      type="button"
                      onClick={() => handleToggleSize(item)}
                      variants={colorButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200",
                        selectedSizes.includes(item)
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm dark:bg-indigo-500 dark:border-indigo-500"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-indigo-900 dark:hover:border-indigo-700"
                      )}
                      aria-pressed={selectedSizes.includes(item)}
                      aria-label={`Size ${item}`}
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-gray-700 dark:text-gray-200 font-medium">
                    Colors<span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:text-indigo-300 dark:hover:bg-indigo-900 transition-all"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    aria-label={showColorPicker ? "Close color picker" : "Open color picker"}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Color
                  </Button>
                </div>

                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-5 bg-indigo-50/50 dark:bg-indigo-900/50 rounded-xl shadow-sm"
                    >
                      <div className="mb-4">
                        <Label className="block mb-1 text-gray-700 dark:text-gray-200 font-medium">Color Name</Label>
                        <Input
                          value={customColorName}
                          onChange={(e) => setCustomColorName(e.target.value)}
                          placeholder="e.g. Midnight Blue"
                          className="w-full rounded-lg border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          required
                          aria-required="true"
                        />
                      </div>
                      <HexColorPicker color={customColor} onChange={setCustomColor} />
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div
                            className="w-8 h-8 rounded-full mr-3 border border-gray-200 dark:border-gray-600 shadow-sm"
                            style={{ backgroundColor: customColor }}
                            aria-label="Selected color preview"
                          />
                          <span className="text-gray-600 dark:text-gray-300 font-medium">{customColor}</span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={addCustomColor}
                          disabled={!customColorName}
                          className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg"
                          aria-label="Add color"
                        >
                          Add Color
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-3 flex flex-wrap gap-4">
                  {selectedColors.map((color) => (
                    <motion.div
                      key={color.name}
                      variants={colorButtonVariants}
                      whileHover="hover"
                      className="relative flex flex-col items-center group"
                    >
                      <button
                        type="button"
                        className="h-10 w-10 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-600 ring-offset-2 shadow-sm"
                        style={{ backgroundColor: color.hex.startsWith("#") ? color.hex : `#${color.hex}` }}
                        aria-label={`Color ${color.name}`}
                      />
                      <span className="mt-2 text-sm text-gray-600 dark:text-gray-300 font-medium truncate max-w-[100px]">
                        {color.name}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => removeColor(color.name, e)}
                        className={cn(
                          "absolute -top-2 -right-2 rounded-full p-1",
                          "bg-red-500 text-white shadow-sm dark:bg-red-400 dark:text-gray-900",
                          "opacity-0 group-hover:opacity-100 transition-all duration-200"
                        )}
                        aria-label={`Remove color ${color.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-700 dark:text-gray-200 font-medium">
                    Price<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-2 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter price"
                    value={formState.price}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-200 font-medium">
                    Stock<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="stock"
                    type="number"
                    min="0"
                    className="mt-2 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter stock"
                    value={formState.stock}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="offer-toggle"
                    checked={formState.isOnOffer}
                    onCheckedChange={handleOfferToggle}
                    className="data-[state=checked]:bg-indigo-600 dark:data-[state=checked]:bg-indigo-500"
                    aria-label="Toggle offer"
                  />
                  <Label htmlFor="offer-toggle" className="text-gray-700 dark:text-gray-200 font-medium">
                    On Offer
                  </Label>
                </div>

                <AnimatePresence>
                  {formState.isOnOffer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Label className="text-gray-700 dark:text-gray-200 font-medium">Offer Price</Label>
                      <Input
                        name="offerPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        className="mt-2 rounded-lg border-gray-200 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Enter offer price"
                        value={formState.offerPrice}
                        onChange={handleInputChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-semibold rounded-lg py-6 shadow-lg transition-all duration-300"
                aria-label={isEditMode ? "Update product" : "Create product"}
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
