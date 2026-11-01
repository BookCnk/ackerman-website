import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { CATALOG_ITEMS, SHOWCASE_BUILDS } from "../lib/mock-erp-data";

const hashPassword = (password: string) => bcrypt.hash(password, 12);

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const passwordHash = await hashPassword("ackermann123");

  const customer = await prisma.user.upsert({
    where: { email: "thanaphat@ackerman.co.th" },
    update: {
      name: "ธนภัทร อัครเดช",
      phone: "089-456-7890",
      taxId: "1100400982115",
      erpCustomerId: "CUS-2026-0194",
      passwordHash,
      role: "CUSTOMER",
    },
    create: {
      email: "thanaphat@ackerman.co.th",
      name: "ธนภัทร อัครเดช",
      phone: "089-456-7890",
      taxId: "1100400982115",
      erpCustomerId: "CUS-2026-0194",
      passwordHash,
      role: "CUSTOMER",
    },
  });

  for (const item of CATALOG_ITEMS) {
    await prisma.catalogProduct.upsert({
      where: { id: item.id },
      update: {
        sku: item.sku,
        name: item.name,
        category: item.category,
        brand: item.brand,
        image: item.image,
        partPrice: item.partPrice,
        laborPrice: item.laborPrice,
        installHours: item.installHours,
        stockStatus: item.stockStatus,
        stockQty: item.stockQty,
        leadTimeDays: item.leadTimeDays,
        compatibleVehicles: item.compatibleVehicles,
        specs: item.specs,
        warrantyMonths: item.warrantyMonths,
        warrantyKm: item.warrantyKm,
      },
      create: {
        id: item.id,
        sku: item.sku,
        name: item.name,
        category: item.category,
        brand: item.brand,
        image: item.image,
        partPrice: item.partPrice,
        laborPrice: item.laborPrice,
        installHours: item.installHours,
        stockStatus: item.stockStatus,
        stockQty: item.stockQty,
        leadTimeDays: item.leadTimeDays,
        compatibleVehicles: item.compatibleVehicles,
        specs: item.specs,
        warrantyMonths: item.warrantyMonths,
        warrantyKm: item.warrantyKm,
      },
    });
  }

  for (const build of SHOWCASE_BUILDS) {
    await prisma.showcaseBuild.upsert({
      where: { id: build.id },
      update: {
        title: build.title,
        vehicleId: build.vehicleId,
        vehicleLabel: build.vehicleLabel,
        categoryTag: build.categoryTag,
        heroImage: build.heroImage,
        galleryImages: build.galleryImages,
        ownerHandle: build.ownerHandle,
        completedDate: build.completedDate,
        summary: build.summary,
        suspensionSpec: build.stanceSpecs.suspension,
        wheelsSpec: build.stanceSpecs.wheels,
        brakesSpec: build.stanceSpecs.brakes,
        exhaustSpec: build.stanceSpecs.exhaustOrAero,
        partIds: build.partIds,
      },
      create: {
        id: build.id,
        title: build.title,
        vehicleId: build.vehicleId,
        vehicleLabel: build.vehicleLabel,
        categoryTag: build.categoryTag,
        heroImage: build.heroImage,
        galleryImages: build.galleryImages,
        ownerHandle: build.ownerHandle,
        completedDate: build.completedDate,
        summary: build.summary,
        suspensionSpec: build.stanceSpecs.suspension,
        wheelsSpec: build.stanceSpecs.wheels,
        brakesSpec: build.stanceSpecs.brakes,
        exhaustSpec: build.stanceSpecs.exhaustOrAero,
        partIds: build.partIds,
      },
    });
  }

  console.log(`Seeded Ackermann Garage catalog & customer: ${customer.email}`);
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
