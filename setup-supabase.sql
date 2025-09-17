-- Supabase Schema for Red Cross Executive Analytics Platform
-- Complete data warehouse for 320,000+ records

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS uuid-ossp;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS applicants CASCADE;
DROP TABLE IF EXISTS volunteers CASCADE;
DROP TABLE IF EXISTS blood_drives CASCADE;
DROP TABLE IF EXISTS donors CASCADE;
DROP TABLE IF EXISTS analytics_cache CASCADE;
DROP TABLE IF EXISTS user_queries CASCADE;
DROP TABLE IF EXISTS executive_alerts CASCADE;

-- Applicants table (76,324 records)
CREATE TABLE applicants (
    id SERIAL PRIMARY KEY,
    entry_point TEXT,
    entry_point_final_status TEXT,
    how_did_you_hear TEXT,
    other_source TEXT,
    intake_outcome TEXT,
    contact_status TEXT,
    contact_completed_date TIMESTAMP,
    current_status TEXT,
    application_dt TIMESTAMP,
    vol_start_dt TIMESTAMP,
    days_to_vol_start INTEGER,
    inactive_dt TIMESTAMP,
    days_to_inactive INTEGER,
    bg_check_cleared BOOLEAN,
    orientation_completed BOOLEAN,
    placement_made BOOLEAN,
    chapter TEXT,
    state TEXT,
    city TEXT,
    county TEXT,
    zip_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Volunteers table (48,978 records)
CREATE TABLE volunteers (
    id SERIAL PRIMARY KEY,
    saba_id TEXT UNIQUE,
    region_is_primary BOOLEAN,
    chapter_name TEXT,
    current_status TEXT,
    status_type TEXT,
    state TEXT,
    zip_code TEXT,
    county_of_residence TEXT,
    disaster_response BOOLEAN,
    primary_gap TEXT,
    second_language TEXT,
    job_type TEXT,
    volunteer_since_date DATE,
    services_of_current_positions TEXT,
    current_positions TEXT,
    last_hours_entry_date DATE,
    last_login_date DATE,
    total_hours DECIMAL(10, 2),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOGRAPHY(POINT, 4326),
    engagement_score DECIMAL(3, 2),
    retention_risk_score DECIMAL(3, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Blood Drives table (186,066 records)
CREATE TABLE blood_drives (
    id SERIAL PRIMARY KEY,
    year INTEGER,
    sponsor_ext_id TEXT,
    status TEXT,
    flag TEXT,
    account_name TEXT,
    account_type TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    drives_count INTEGER,
    rbc_product_projection INTEGER,
    rbc_products_collected INTEGER,
    efficiency_rate DECIMAL(5, 2) GENERATED ALWAYS AS 
        (CASE WHEN rbc_product_projection > 0 
         THEN (rbc_products_collected::DECIMAL / rbc_product_projection * 100) 
         ELSE 0 END) STORED,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOGRAPHY(POINT, 4326),
    drive_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Donors table (10,228 records)
CREATE TABLE donors (
    id SERIAL PRIMARY KEY,
    gift_amount DECIMAL(12, 2),
    gift_date DATE,
    donor_type TEXT,
    donor_category TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    lifetime_value DECIMAL(12, 2),
    engagement_level TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics cache for performance
CREATE TABLE analytics_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cache_key TEXT UNIQUE NOT NULL,
    cache_value JSONB NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User queries for AI learning
CREATE TABLE user_queries (
    id SERIAL PRIMARY KEY,
    query_text TEXT NOT NULL,
    query_type TEXT,
    response JSONB,
    user_id UUID,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Executive alerts
CREATE TABLE executive_alerts (
    id SERIAL PRIMARY KEY,
    alert_type TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT,
    metrics JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_applicants_status ON applicants(current_status);
CREATE INDEX idx_applicants_location ON applicants USING GIST(location);
CREATE INDEX idx_applicants_application_date ON applicants(application_dt);
CREATE INDEX idx_applicants_state ON applicants(state);

CREATE INDEX idx_volunteers_status ON volunteers(current_status);
CREATE INDEX idx_volunteers_location ON volunteers USING GIST(location);
CREATE INDEX idx_volunteers_since_date ON volunteers(volunteer_since_date);
CREATE INDEX idx_volunteers_state ON volunteers(state);
CREATE INDEX idx_volunteers_engagement ON volunteers(engagement_score);

CREATE INDEX idx_blood_drives_year ON blood_drives(year);
CREATE INDEX idx_blood_drives_location ON blood_drives USING GIST(location);
CREATE INDEX idx_blood_drives_account_type ON blood_drives(account_type);
CREATE INDEX idx_blood_drives_efficiency ON blood_drives(efficiency_rate);

CREATE INDEX idx_donors_amount ON donors(gift_amount);
CREATE INDEX idx_donors_location ON donors USING GIST(location);
CREATE INDEX idx_donors_date ON donors(gift_date);

CREATE INDEX idx_analytics_cache_key ON analytics_cache(cache_key);
CREATE INDEX idx_analytics_cache_expires ON analytics_cache(expires_at);

-- Create materialized views for dashboard performance
CREATE MATERIALIZED VIEW mv_executive_kpis AS
SELECT 
    -- Volunteer metrics
    (SELECT COUNT(*) FROM applicants) as total_applicants,
    (SELECT COUNT(*) FROM volunteers) as total_volunteers,
    (SELECT COUNT(*) FROM volunteers WHERE current_status = 'General Volunteer') as active_volunteers,
    (SELECT COUNT(*) FROM applicants WHERE intake_outcome = 'Converted to Volunteer') as converted_applicants,
    (SELECT AVG(days_to_vol_start) FROM applicants WHERE days_to_vol_start > 0) as avg_days_to_activate,
    
    -- Financial metrics
    (SELECT SUM(gift_amount) FROM donors) as total_donations,
    (SELECT AVG(gift_amount) FROM donors) as avg_donation,
    (SELECT COUNT(*) FROM donors) as total_donors,
    (SELECT COUNT(*) FROM donors WHERE gift_amount >= 100000) as major_donors,
    
    -- Operational metrics
    (SELECT COUNT(*) FROM blood_drives) as total_blood_drives,
    (SELECT SUM(rbc_products_collected) FROM blood_drives) as total_products_collected,
    (SELECT AVG(efficiency_rate) FROM blood_drives) as avg_efficiency_rate,
    
    -- Geographic distribution
    (SELECT jsonb_object_agg(state, count) FROM 
        (SELECT state, COUNT(*) as count FROM volunteers GROUP BY state ORDER BY count DESC LIMIT 10) t
    ) as top_volunteer_states,
    
    NOW() as last_updated;

-- Create refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_executive_kpis()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_executive_kpis;
END;
$$ LANGUAGE plpgsql;

-- Real-time triggers for alerts
CREATE OR REPLACE FUNCTION check_volunteer_metrics()
RETURNS TRIGGER AS $$
DECLARE
    conversion_rate DECIMAL;
BEGIN
    -- Calculate current conversion rate
    SELECT (COUNT(CASE WHEN intake_outcome = 'Converted to Volunteer' THEN 1 END)::DECIMAL / 
            NULLIF(COUNT(*), 0) * 100)
    INTO conversion_rate
    FROM applicants
    WHERE application_dt >= NOW() - INTERVAL '30 days';
    
    -- Alert if conversion rate drops below 20%
    IF conversion_rate < 20 THEN
        INSERT INTO executive_alerts (alert_type, severity, title, description, metrics)
        VALUES (
            'conversion_rate_low',
            'high',
            'Conversion Rate Alert',
            'Volunteer conversion rate has dropped below 20% in the last 30 days',
            jsonb_build_object('conversion_rate', conversion_rate)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_volunteer_metrics
AFTER INSERT OR UPDATE ON applicants
FOR EACH ROW
EXECUTE FUNCTION check_volunteer_metrics();

-- Row Level Security
ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access" ON applicants FOR SELECT USING (true);
CREATE POLICY "Public read access" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON blood_drives FOR SELECT USING (true);
CREATE POLICY "Public read access" ON donors FOR SELECT USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Create functions for advanced analytics
CREATE OR REPLACE FUNCTION get_volunteer_growth_trend(months INTEGER DEFAULT 12)
RETURNS TABLE(month DATE, applications BIGINT, conversions BIGINT, conversion_rate DECIMAL)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        date_trunc('month', application_dt)::DATE as month,
        COUNT(*) as applications,
        COUNT(CASE WHEN intake_outcome = 'Converted to Volunteer' THEN 1 END) as conversions,
        (COUNT(CASE WHEN intake_outcome = 'Converted to Volunteer' THEN 1 END)::DECIMAL / 
         NULLIF(COUNT(*), 0) * 100) as conversion_rate
    FROM applicants
    WHERE application_dt >= NOW() - INTERVAL '1 month' * months
    GROUP BY date_trunc('month', application_dt)
    ORDER BY month DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_geographic_clusters()
RETURNS TABLE(
    cluster_id INTEGER,
    center_lat DECIMAL,
    center_lon DECIMAL,
    volunteer_count BIGINT,
    donor_count BIGINT,
    blood_drive_count BIGINT
)
AS $$
BEGIN
    RETURN QUERY
    WITH clusters AS (
        SELECT 
            ST_ClusterKMeans(location::geometry, 20) OVER () as cluster_id,
            location
        FROM volunteers
        WHERE location IS NOT NULL
    )
    SELECT 
        c.cluster_id,
        AVG(ST_Y(c.location::geometry))::DECIMAL as center_lat,
        AVG(ST_X(c.location::geometry))::DECIMAL as center_lon,
        COUNT(DISTINCT v.id) as volunteer_count,
        COUNT(DISTINCT d.id) as donor_count,
        COUNT(DISTINCT b.id) as blood_drive_count
    FROM clusters c
    LEFT JOIN volunteers v ON ST_DWithin(v.location, c.location, 50000)
    LEFT JOIN donors d ON ST_DWithin(d.location, c.location, 50000)
    LEFT JOIN blood_drives b ON ST_DWithin(b.location, c.location, 50000)
    GROUP BY c.cluster_id;
END;
$$ LANGUAGE plpgsql;