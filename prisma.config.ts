// prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // TRICK: Kita berikan DIRECT_URL (Port 5432) ke sini
    // Karena CLI butuh koneksi langsung untuk migrasi.
    url: process.env.DIRECT_URL!, 
  },
});