import { PrismaClient, ItemCategory } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

/**
 * Item types matching the frontend form options
 */
const itemTypes: { name: string; category: ItemCategory }[] = [
  // Clothing types
  { name: "Shirts", category: "CLOTHING" },
  { name: "Pants", category: "CLOTHING" },
  { name: "Dresses", category: "CLOTHING" },
  { name: "Coats", category: "CLOTHING" },
  { name: "Warm", category: "CLOTHING" },
  { name: "Sweaters", category: "CLOTHING" },
  { name: "Shoes", category: "CLOTHING" },
  // Gear types
  { name: "Crib", category: "GEAR" },
  { name: "Carrier", category: "GEAR" },
  { name: "Pack-n-play", category: "GEAR" },
  { name: "Boppy", category: "GEAR" },
];

async function seedItemTypes() {
  console.log("Seeding item types...");

  for (const item of itemTypes) {
    await prisma.itemType.upsert({
      where: { name: item.name },
      update: { category: item.category, isDeleted: false },
      create: { name: item.name, category: item.category },
    });
  }

  const count = await prisma.itemType.count({ where: { isDeleted: false } });
  console.log(`✅ Seeded ${count} item types`);
}

async function seedAdminUser() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log(
      "⚠️  Skipping admin user seed — SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required."
    );
    console.log(
      "   Add SUPABASE_SERVICE_ROLE_KEY to your .env (found in Supabase Dashboard > Project Settings > API > service_role)"
    );
    return;
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@kbkcommunity.org";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  console.log(`Creating admin user: ${adminEmail}...`);

  // Use Supabase Admin API (service role key) to create the auth user
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === adminEmail);

  let supabaseUserId: string;

  if (existing) {
    console.log("  Auth user already exists, skipping creation");
    supabaseUserId = existing.id;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
    });

    if (error) {
      console.error("❌ Failed to create auth user:", error.message);
      return;
    }
    supabaseUserId = data.user.id;
    console.log("  ✅ Auth user created");
  }

  // Create or update UserProfile
  const userProfile = await prisma.userProfile.upsert({
    where: { supabaseUserId },
    update: { role: "SUPER_ADMIN", isDeleted: false },
    create: { supabaseUserId, role: "SUPER_ADMIN" },
  });

  // Create or update Contact for this admin
  await prisma.contact.upsert({
    where: { userProfileId: userProfile.id },
    update: { name: "Admin", isDeleted: false },
    create: {
      name: "Admin",
      phone: "",
      email: adminEmail,
      userProfileId: userProfile.id,
    },
  });

  console.log(`✅ Admin user profile created (role: SUPER_ADMIN)`);
  console.log(`   Email: ${adminEmail}`);
  if (!existing) {
    console.log(`   Password: ${adminPassword}`);
    console.log(`   ⚠️  Change this password after first login!`);
  }
}

async function main() {
  try {
    await seedItemTypes();
    await seedAdminUser();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
