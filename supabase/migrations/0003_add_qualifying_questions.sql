-- Add install-qualifying intake questions and computed flags
-- Idempotent: safe to run multiple times

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'power_within_12ft') THEN
    ALTER TABLE leads ADD COLUMN power_within_12ft TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'fire_sprinkler_system') THEN
    ALTER TABLE leads ADD COLUMN fire_sprinkler_system TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'wifi_at_install_location') THEN
    ALTER TABLE leads ADD COLUMN wifi_at_install_location TEXT;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'qualifying_flags') THEN
    ALTER TABLE leads ADD COLUMN qualifying_flags JSONB;
  END IF;
END $$;
