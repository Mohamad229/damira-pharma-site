import { PrismaClient, UserRole, ProductType, ProductStatus, SectionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@damirapharma.com' },
    update: {},
    create: {
      email: 'admin@damirapharma.com',
      password: hashedPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });
  console.log('Admin user created:', adminUser.email);

  // Create Therapeutic Areas
  const therapeuticAreas = [
    { slug: 'oncology', name: 'Oncology', nameAr: 'الأورام' },
    { slug: 'cardiology', name: 'Cardiology', nameAr: 'أمراض القلب' },
    { slug: 'neurology', name: 'Neurology', nameAr: 'الأعصاب' },
    { slug: 'immunology', name: 'Immunology', nameAr: 'المناعة' },
    { slug: 'respiratory', name: 'Respiratory', nameAr: 'الجهاز التنفسي' },
    { slug: 'gastroenterology', name: 'Gastroenterology', nameAr: 'الجهاز الهضمي' },
    { slug: 'dermatology', name: 'Dermatology', nameAr: 'الأمراض الجلدية' },
    { slug: 'endocrinology', name: 'Endocrinology', nameAr: 'الغدد الصماء' },
  ];

  for (const area of therapeuticAreas) {
    await prisma.therapeuticArea.upsert({
      where: { slug: area.slug },
      update: {},
      create: area,
    });
  }
  console.log('Therapeutic areas created:', therapeuticAreas.length);

  // Create Categories
  const categories = [
    { slug: 'pharmaceuticals', name: 'Pharmaceuticals', nameAr: 'الأدوية' },
    { slug: 'biologics', name: 'Biologics', nameAr: 'المستحضرات الحيوية' },
    { slug: 'vaccines', name: 'Vaccines', nameAr: 'اللقاحات' },
    { slug: 'medical-devices', name: 'Medical Devices', nameAr: 'الأجهزة الطبية' },
    { slug: 'diagnostics', name: 'Diagnostics', nameAr: 'التشخيص' },
    { slug: 'nutraceuticals', name: 'Nutraceuticals', nameAr: 'المكملات الغذائية' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log('Categories created:', categories.length);

  // Create Manufacturers
  const manufacturers = [
    { slug: 'damira-pharma', name: 'Damira Pharma', country: 'Saudi Arabia' },
    { slug: 'pfizer', name: 'Pfizer', country: 'United States' },
    { slug: 'novartis', name: 'Novartis', country: 'Switzerland' },
    { slug: 'roche', name: 'Roche', country: 'Switzerland' },
    { slug: 'sanofi', name: 'Sanofi', country: 'France' },
    { slug: 'astrazeneca', name: 'AstraZeneca', country: 'United Kingdom' },
  ];

  for (const manufacturer of manufacturers) {
    await prisma.manufacturer.upsert({
      where: { slug: manufacturer.slug },
      update: {},
      create: manufacturer,
    });
  }
  console.log('Manufacturers created:', manufacturers.length);

  // Create Site Settings
  const siteSettings = [
    { key: 'site_name', value: 'Damira Pharma' },
    { key: 'site_name_ar', value: 'داميرا فارما' },
    { key: 'contact_email', value: 'info@damirapharma.com' },
    { key: 'contact_phone', value: '+966 XX XXX XXXX' },
    { key: 'address', value: 'Riyadh, Saudi Arabia' },
    { key: 'address_ar', value: 'الرياض، المملكة العربية السعودية' },
    { key: 'default_meta_description', value: 'Damira Pharma - Leading pharmaceutical solutions in the Middle East' },
    { key: 'default_meta_description_ar', value: 'داميرا فارما - حلول صيدلانية رائدة في الشرق الأوسط' },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('Site settings created:', siteSettings.length);

  // Create Homepage
  const homepage = await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      isPublished: true,
      translations: {
        create: [
          {
            locale: 'en',
            title: 'Home',
            metaTitle: 'Damira Pharma - Healthcare Solutions',
            metaDescription: 'Leading pharmaceutical distribution and healthcare solutions in the Middle East',
          },
          {
            locale: 'ar',
            title: 'الرئيسية',
            metaTitle: 'داميرا فارما - حلول الرعاية الصحية',
            metaDescription: 'توزيع الأدوية الرائد وحلول الرعاية الصحية في الشرق الأوسط',
          },
        ],
      },
    },
  });
  console.log('Homepage created');

  // Create About Page
  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      slug: 'about',
      isPublished: true,
      translations: {
        create: [
          {
            locale: 'en',
            title: 'About Us',
            metaTitle: 'About Damira Pharma',
            metaDescription: 'Learn about our vision, mission, and values',
          },
          {
            locale: 'ar',
            title: 'من نحن',
            metaTitle: 'عن داميرا فارما',
            metaDescription: 'تعرف على رؤيتنا ورسالتنا وقيمنا',
          },
        ],
      },
    },
  });
  console.log('About page created');

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
