import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import notificationService from "@/services/notification.service";
import { productTemplate } from "@/templates/added-productTemplate";
import { outOfStock } from "@/templates/out-of-stocTemplate";
import { removedCategory } from "@/templates/removed-categoryTemplate";
import { updatedCategory } from "@/templates/updatedCategoryTemplate";
import { deletedProducts } from "@/templates/deleted-productsTemplate";
import { allLinks, baseUrl, NotificationAction, NOTIFICATIONDATA } from "@/lib/custom-ntf";
import { requireSuperAdmin } from "@/lib/auth-helpers";

const customIcon = "https://i.pinimg.com/736x/86/a6/b2/86a6b2ccb15c88b6f879f1f5a03b9165.jpg";

export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin(req);
    const { action }: { action: NotificationAction } = await req.json();
    const { pageLinks, socialLinks } = allLinks;

    if (!action) {
      return NextResponse.json({ success: false, message: "No action or valid action provided" }, { status: 400 });
    }

    switch (action) {
      case NotificationAction.ADDED_COLLECTION:
        const productsCollection = await prisma.product.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
        });

        if (!productsCollection || productsCollection.length === 0) {
          return NextResponse.json({ success: false, message: "Please add at least one product" }, { status: 404 });
        }

        const productResultCollection = await notificationService.sendBulkNotifications(
          {
            from: process.env.USER_EMAIL!,
            subject: NOTIFICATIONDATA.ADDED_PRODUCT.title,
            text: NOTIFICATIONDATA.ADDED_PRODUCT.text,
            html: productTemplate({ products: productsCollection, pageLinks, socialLinks }),
          },
          {
            title: NOTIFICATIONDATA.ADDED_PRODUCT.title,
            body: NOTIFICATIONDATA.ADDED_PRODUCT.smallDescription,
            data: {
              icon: productsCollection[0].images[0],
              lead: baseUrl + "/listing",
            },
          },
          1000
        );

        return NextResponse.json({
          success: true,
          message: "Product notifications sent successfully",
          data: productResultCollection,
        });

      case NotificationAction.ADDED_PRODUCT:
        const products = await prisma.product.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
        });

        if (!products || products.length === 0) {
          return NextResponse.json({ success: false, message: "Please add at least one product" }, { status: 404 });
        }

        const productResult = await notificationService.sendToAll(
          {
            from: process.env.USER_EMAIL!,
            subject: NOTIFICATIONDATA.ADDED_PRODUCT.title,
            text: NOTIFICATIONDATA.ADDED_PRODUCT.text,
            html: productTemplate({ products, pageLinks, socialLinks }),
          },
          {
            title: NOTIFICATIONDATA.ADDED_PRODUCT.title,
            body: NOTIFICATIONDATA.ADDED_PRODUCT.smallDescription,
            data: { icon: products[0].images[0], lead: baseUrl + "/listing" },
          },
          1000
        );

        return NextResponse.json({
          success: true,
          message: "Product notifications sent successfully",
          data: productResult,
        });

      case NotificationAction.REMOVED_CATEGORY:
        const removedCatActivity = await prisma.adminActivity.findFirst({
          where: { action: "REMOVED_CATEGORY" },
          orderBy: { createdAt: "desc" },
        });

        if (!removedCatActivity) {
          return NextResponse.json({ success: false, message: "No removed category found" }, { status: 404 });
        }

        const removedCategoryResult = await notificationService.sendBulkNotifications(
          {
            from: process.env.USER_EMAIL!,
            subject: NOTIFICATIONDATA.REMOVED_CATEGORY.title,
            text: NOTIFICATIONDATA.REMOVED_CATEGORY.text,
            html: removedCategory(),
          },
          {
            title: NOTIFICATIONDATA.REMOVED_CATEGORY.title,
            body: NOTIFICATIONDATA.REMOVED_CATEGORY.smallDescription,
            data: { icon: customIcon, lead: baseUrl + "/listing" },
          },
          1000
        );

        return NextResponse.json({
          success: true,
          message: "Removed category notifications sent successfully",
          data: removedCategoryResult,
        });

      case NotificationAction.UPDATED_CATEGORY:
        const updatedCatActivity = await prisma.adminActivity.findFirst({
          where: { action: "UPDATED_CATEGORY" },
          orderBy: { createdAt: "desc" },
        });

        if (!updatedCatActivity) {
          return NextResponse.json({ success: false, message: "No updated category found" }, { status: 404 });
        }

        const updatedCategoryResult = await notificationService.sendBulkNotifications(
          {
            from: process.env.USER_EMAIL!,
            subject: NOTIFICATIONDATA.UPDATED_CATEGORY.title,
            text: NOTIFICATIONDATA.UPDATED_CATEGORY.text,
            html: updatedCategory(),
          },
          {
            title: NOTIFICATIONDATA.UPDATED_CATEGORY.title,
            body: NOTIFICATIONDATA.UPDATED_CATEGORY.smallDescription,
            data: { icon: customIcon, lead: baseUrl + "/listing" },
          },
          1000
        );

        return NextResponse.json({
          success: true,
          message: "Updated category notifications sent successfully",
          data: updatedCategoryResult,
        });

      case NotificationAction.OUT_OF_STOCK:
        const outOfStockProducts = await prisma.product.findMany({
          where: { stock: 0 },
          take: 5,
          orderBy: { updatedAt: "desc" },
        });

        if (!outOfStockProducts || outOfStockProducts.length === 0) {
          return NextResponse.json({ success: false, message: "No out of stock products found" }, { status: 404 });
        }

        const outOfStockResult = await notificationService.sendBulkNotifications(
          {
            from: process.env.USER_EMAIL!,
            subject: NOTIFICATIONDATA.OUT_OF_STOCK.title,
            text: NOTIFICATIONDATA.OUT_OF_STOCK.text,
            html: outOfStock(),
          },
          {
            title: NOTIFICATIONDATA.OUT_OF_STOCK.title,
            body: NOTIFICATIONDATA.OUT_OF_STOCK.smallDescription,
            data: {
              icon: outOfStockProducts[0].images[0] || customIcon,
              lead: baseUrl + "/product/" + outOfStockProducts[0].id,
            },
          },
          1000
        );

        return NextResponse.json({
          success: true,
          message: "Out of stock notifications sent successfully",
          data: outOfStockResult,
        });

      case NotificationAction.DELETED_PRODUCTS:
        const deletedProductsActivity = await prisma.adminActivity.findFirst({
          where: { action: "DELETED_PRODUCTS" },
          orderBy: { createdAt: "desc" },
        });

        if (!deletedProductsActivity) {
          return NextResponse.json({ success: false, message: "No deleted products activity found" }, { status: 404 });
        }

        const deletedProductsResult = await notificationService.sendBulkNotifications(
          {
            from: process.env.USER_EMAIL!,
            subject: NOTIFICATIONDATA.DELETED_PRODUCTS.title,
            text: NOTIFICATIONDATA.DELETED_PRODUCTS.text,
            html: deletedProducts(),
          },
          {
            title: NOTIFICATIONDATA.DELETED_PRODUCTS.title,
            body: NOTIFICATIONDATA.DELETED_PRODUCTS.smallDescription,
            data: { icon: customIcon, lead: baseUrl + "/listing" },
          },
          1000
        );

        return NextResponse.json({
          success: true,
          message: "Deleted products notifications sent successfully",
          data: deletedProductsResult,
        });

      default:
        return NextResponse.json({ success: false, message: "Invalid action provided" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Notification error:", error);
    if (error.message === "Unauthorized: Super admin access required") {
      return NextResponse.json({ success: false, message: "Unauthorized request" }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: error.message || "Something went wrong" }, { status: 500 });
  }
}
