-- Create delivery_areas table
CREATE TABLE delivery_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE delivery_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_delivery_areas ON delivery_areas 
  FOR ALL USING (tenant_id = auth.jwt() ->> 'tenant_id'::uuid);

-- Index
CREATE INDEX idx_delivery_areas_tenant_id ON delivery_areas(tenant_id);
