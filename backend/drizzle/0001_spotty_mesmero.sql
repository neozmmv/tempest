ALTER TABLE "users" ADD COLUMN "public_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "encrypted_private_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "public_signature_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "encrypted_private_signature_key" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "encryption_salt" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "encryption_nonce" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "signature_nonce" text NOT NULL;