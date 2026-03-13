// seed.mjs - Run with: node seed.mjs
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load .env.local manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
for (const line of envContent.split('\n')) {
  const idx = line.indexOf('=');
  if (idx > 0) {
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key) process.env[key] = val;
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('No MONGODB_URI found'); process.exit(1); }

await mongoose.connect(MONGODB_URI);
console.log('Connected to MongoDB');

// Simple User model
const UserSchema = new mongoose.Schema({ name: String, email: String, password: String }, { timestamps: true });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Simple Product model
const ProductSchema = new mongoose.Schema({
  name: String, brand: String, category: String, batchNo: String,
  mfgDate: Date, expiryDate: Date, quantity: Number, mrp: Number,
  purchasePrice: Number, supplier: String, supplierPhone: String,
  notes: String, isReturned: { type: Boolean, default: false },
  alertsSent: { type: Array, default: [] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Find first user
const firstUser = await User.findOne().sort({ createdAt: 1 });
if (!firstUser) { console.error('No users found. Please sign up first at http://localhost:3000/signup'); await mongoose.disconnect(); process.exit(1); }
console.log(`Seeding for user: ${firstUser.name} (${firstUser.email})`);

const products = [
  { name: 'Paracetamol 500mg Tablets', brand: 'Cipla', category: 'Medicine', batchNo: 'PCM24A118', mfgDate: new Date('2024-08-15'), expiryDate: new Date('2026-07-15'), quantity: 200, mrp: 35, purchasePrice: 22.50, supplier: 'MedPlus Distributors', supplierPhone: '+919876543210', notes: 'Fever relief tablets' },
  { name: 'Amoxicillin 250mg Capsules', brand: 'Sun Pharma', category: 'Medicine', batchNo: 'AMX25B091', mfgDate: new Date('2025-01-10'), expiryDate: new Date('2026-12-31'), quantity: 150, mrp: 89, purchasePrice: 61, supplier: 'Apollo Pharma Supplies', supplierPhone: '+919812345678', notes: 'Antibiotic capsules' },
  { name: 'Cetirizine 10mg Tablets', brand: "Dr. Reddy's", category: 'Medicine', batchNo: 'CTZ23D442', mfgDate: new Date('2024-03-05'), expiryDate: new Date('2026-04-05'), quantity: 120, mrp: 48, purchasePrice: 30, supplier: 'HealthCare Wholesale', supplierPhone: '+919900112233', notes: 'Anti-allergy tablets' },
  { name: 'Basmati Rice 5kg', brand: 'India Gate', category: 'Grocery', batchNo: 'RICE25B019', mfgDate: new Date('2025-02-01'), expiryDate: new Date('2027-02-01'), quantity: 80, mrp: 850, purchasePrice: 720, supplier: 'Reliance Wholesale', supplierPhone: '+919812345678', notes: 'Premium rice' },
  { name: 'Wheat Flour (Atta) 5kg', brand: 'Aashirvaad', category: 'Grocery', batchNo: 'ATT25A701', mfgDate: new Date('2025-01-12'), expiryDate: new Date('2026-01-12'), quantity: 90, mrp: 310, purchasePrice: 260, supplier: 'ITC Distributor', supplierPhone: '+919855667744', notes: 'Whole wheat flour' },
  { name: 'Sunflower Oil 1L', brand: 'Fortune', category: 'Grocery', batchNo: 'OIL25C552', mfgDate: new Date('2025-01-10'), expiryDate: new Date('2026-01-10'), quantity: 120, mrp: 180, purchasePrice: 150, supplier: 'Adani Wilmar Distribution', supplierPhone: '+919933445566', notes: 'Cooking oil' },
  { name: 'Sugar 1kg', brand: 'Madhur', category: 'Grocery', batchNo: 'SGR25D118', mfgDate: new Date('2025-02-15'), expiryDate: new Date('2027-02-15'), quantity: 150, mrp: 50, purchasePrice: 42, supplier: 'Local Wholesale Market', supplierPhone: '+919944556677', notes: 'Refined sugar' },
  { name: 'Toothpaste 150g', brand: 'Colgate', category: 'FMCG', batchNo: 'FMCG24X220', mfgDate: new Date('2024-09-05'), expiryDate: new Date('2026-09-05'), quantity: 100, mrp: 120, purchasePrice: 88, supplier: 'Metro Cash & Carry', supplierPhone: '+919811223344', notes: 'Oral care product' },
  { name: 'Bath Soap 125g', brand: 'Lux', category: 'FMCG', batchNo: 'SOAP24L991', mfgDate: new Date('2024-11-20'), expiryDate: new Date('2027-11-20'), quantity: 150, mrp: 40, purchasePrice: 28, supplier: 'HUL Distributor', supplierPhone: '+919845667788', notes: 'Bathing soap' },
  { name: 'Shampoo 180ml', brand: 'Head & Shoulders', category: 'FMCG', batchNo: 'SHP25K112', mfgDate: new Date('2025-02-03'), expiryDate: new Date('2028-02-03'), quantity: 70, mrp: 210, purchasePrice: 165, supplier: 'P&G Distributor', supplierPhone: '+919877665511', notes: 'Anti-dandruff shampoo' },
  { name: 'Toned Milk 1L', brand: 'Amul', category: 'Dairy', batchNo: 'MLK250314', mfgDate: new Date('2026-03-12'), expiryDate: new Date('2026-03-15'), quantity: 60, mrp: 58, purchasePrice: 52, supplier: 'Amul Dairy Supplier', supplierPhone: '+919800112244', notes: 'Refrigerated product' },
  { name: 'Butter 500g', brand: 'Amul', category: 'Dairy', batchNo: 'BTR25K102', mfgDate: new Date('2026-02-01'), expiryDate: new Date('2026-08-01'), quantity: 40, mrp: 285, purchasePrice: 250, supplier: 'Amul Distribution Center', supplierPhone: '+919822334455', notes: 'Keep refrigerated' },
  { name: 'Paneer 200g', brand: 'Mother Dairy', category: 'Dairy', batchNo: 'PNR26M001', mfgDate: new Date('2026-03-10'), expiryDate: new Date('2026-03-20'), quantity: 50, mrp: 95, purchasePrice: 80, supplier: 'Mother Dairy Distributor', supplierPhone: '+919811556677', notes: 'Fresh dairy product' },
  { name: 'Coca Cola 750ml', brand: 'Coca-Cola', category: 'Beverage', batchNo: 'BEV25A501', mfgDate: new Date('2025-01-15'), expiryDate: new Date('2026-01-15'), quantity: 90, mrp: 40, purchasePrice: 30, supplier: 'Coca Cola Bottling Partner', supplierPhone: '+919877665544', notes: 'Soft drink' },
  { name: 'Pepsi 500ml', brand: 'PepsiCo', category: 'Beverage', batchNo: 'BEV25P441', mfgDate: new Date('2025-02-12'), expiryDate: new Date('2026-02-12'), quantity: 110, mrp: 38, purchasePrice: 29, supplier: 'Pepsi Distribution', supplierPhone: '+919811998877', notes: 'Carbonated beverage' },
  { name: 'Tropicana Orange Juice 1L', brand: 'Tropicana', category: 'Beverage', batchNo: 'JCE25T331', mfgDate: new Date('2025-01-01'), expiryDate: new Date('2025-10-01'), quantity: 65, mrp: 120, purchasePrice: 95, supplier: 'PepsiCo Supplier', supplierPhone: '+919822112233', notes: 'Fruit juice' },
  { name: 'Face Wash 100ml', brand: 'Garnier', category: 'Cosmetics', batchNo: 'COS24P781', mfgDate: new Date('2024-10-10'), expiryDate: new Date('2027-10-10'), quantity: 75, mrp: 199, purchasePrice: 150, supplier: "L'Oréal Distributor", supplierPhone: '+919844556677', notes: 'Oil control face wash' },
  { name: 'Body Lotion 200ml', brand: 'Nivea', category: 'Cosmetics', batchNo: 'COS25M450', mfgDate: new Date('2025-01-05'), expiryDate: new Date('2028-01-05'), quantity: 60, mrp: 299, purchasePrice: 230, supplier: 'Nivea India Distribution', supplierPhone: '+919811334455', notes: 'Skin moisturizer' },
  { name: 'Lip Balm', brand: 'Himalaya', category: 'Cosmetics', batchNo: 'COS25H332', mfgDate: new Date('2025-02-15'), expiryDate: new Date('2027-02-15'), quantity: 120, mrp: 45, purchasePrice: 32, supplier: 'Himalaya Distributor', supplierPhone: '+919844221199', notes: 'Herbal lip care' },
  { name: 'Detergent Powder 1kg', brand: 'Surf Excel', category: 'Other', batchNo: 'OTH25S119', mfgDate: new Date('2025-02-15'), expiryDate: new Date('2027-02-15'), quantity: 70, mrp: 210, purchasePrice: 170, supplier: 'HUL Distributor', supplierPhone: '+919866554433', notes: 'Laundry detergent' },
];

const toInsert = products.map(p => ({ ...p, user: firstUser._id }));
const result = await Product.insertMany(toInsert);
console.log(`✅ Successfully inserted ${result.length} products for ${firstUser.name}`);

await mongoose.disconnect();
console.log('Done!');
