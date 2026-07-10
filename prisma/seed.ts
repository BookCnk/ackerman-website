import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const hashPassword = (password: string) => bcrypt.hash(password, 12);

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const adminPasswordHash = await hashPassword("adminpassword123");

  // Upsert the system administrator account
  const admin = await prisma.user.upsert({
    where: { email: "admin@cnk-shop.com" },
    update: {
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
    create: {
      email: "admin@cnk-shop.com",
      name: "System Administrator",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  console.log(`Admin account created: ${admin.email}`);

  // Seed default billing products (both Licenses and Digital Downloads)
  const products = [
    {
      id: "prod_basic_1m",
      name: "สิทธิ์เข้าใช้งานระดับเริ่มต้น (30 วัน)",
      description: "เหมาะสำหรับการใช้งานส่วนบุคคลบนคอมพิวเตอร์เครื่องเดียว ดาวน์โหลดไฟล์และรับการปกป้องอย่างสมบูรณ์แบบ",
      price: 19.99,
      isLicense: true,
    },
    {
      id: "prod_pro_1y",
      name: "สิทธิ์เข้าใช้งานระดับมืออาชีพ (1 ปี)",
      description: "เหมาะสำหรับนักพัฒนาและมืออาชีพที่ต้องการรองรับการผูกสิทธิ์เข้ากับหลายอุปกรณ์พร้อมกัน",
      price: 99.99,
      isLicense: true,
    },
    {
      id: "prod_enterprise_life",
      name: "สิทธิ์เข้าใช้งานระดับองค์กร (ตลอดชีพ)",
      description: "อัปเดตเวอร์ชันได้ไม่จำกัด, ผูกการใช้งานได้หลายเครื่อง และบริการช่วยเหลือลูกค้าแบบเร่งด่วนเป็นพิเศษ",
      price: 249.99,
      isLicense: true,
    },
    {
      id: "prod_boilerplate_code",
      name: "เทมเพลตสคริปต์ Windows ระดับพรีเมียม (Source Code)",
      description: "เทมเพลตโปรเจกต์สำเร็จรูปในภาษา Go/C++ พร้อมฟังก์ชันตรวจสอบ HWID อย่างละเอียดและระบบป้องกันการดีบักเกอร์",
      price: 49.99,
      isLicense: false,
    },
    {
      id: "prod_settings_profile",
      name: "ไฟล์ตั้งค่า Core ประсิทธิภาพสูง (JSON Preset)",
      description: "ไฟล์โปรไฟล์พร้อมใช้งาน (JSON) สำหรับปรับจูนทรัพยากรระบบและค่าความหน่วง (Latency) ของคอมพิวเตอร์ของคุณให้เหมาะสมที่สุด",
      price: 9.99,
      isLicense: false,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        isLicense: product.isLicense,
      },
      create: product,
    });
  }

  // Seed sample releases/files for the digital products
  const sampleReleases = [
    {
      id: "rel_boilerplate_zip",
      version: "1.0.0-src",
      filename: "windows_boilerplate_source.zip",
      s3Key: "products/src/windows_boilerplate_source_v1.0.0.zip",
      checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      isPublic: false,
      productId: "prod_boilerplate_code",
      description: "รุ่นเริ่มต้นสำหรับเทมเพลตภาษา Go/C++ Windows Boilerplate",
    },
    {
      id: "rel_settings_json",
      version: "2.4.1-cfg",
      filename: "optimized_latency_settings.json",
      s3Key: "products/cfg/optimized_latency_settings_v2.4.1.json",
      checksum: "d42a98f1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855aa512",
      isPublic: false,
      productId: "prod_settings_profile",
      description: "ไฟล์ตั้งค่า JSON ปรับแต่งลดความหน่วงสำหรับการเพิ่มประสิทธิภาพระบบ",
    }
  ];

  for (const rel of sampleReleases) {
    await prisma.release.upsert({
      where: { id: rel.id },
      update: {
        version: rel.version,
        filename: rel.filename,
        s3Key: rel.s3Key,
        checksum: rel.checksum,
        isPublic: rel.isPublic,
        productId: rel.productId,
        description: rel.description,
      },
      create: rel,
    });
  }

  console.log("บันทึกข้อมูลสินค้าและไฟล์ดิจิทัลลงในฐานข้อมูลเรียบร้อยแล้ว!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
