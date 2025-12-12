-- AlterTable
ALTER TABLE "Scan" ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "shortcode" TEXT;

-- CreateIndex
CREATE INDEX "Scan_shortcode_idx" ON "Scan"("shortcode");
