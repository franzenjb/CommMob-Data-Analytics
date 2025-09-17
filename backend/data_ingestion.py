#!/usr/bin/env python3
"""
Advanced Data Ingestion Pipeline for Supabase
Processes all CSV files with validation, transformation, and real-time updates
"""

import pandas as pd
import numpy as np
from supabase import create_client, Client
import os
from datetime import datetime
import asyncio
import aiofiles
import json
from typing import List, Dict, Any
import logging
from tqdm import tqdm
import hashlib

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataIngestionPipeline:
    """Enterprise-grade data ingestion for Red Cross analytics"""
    
    def __init__(self):
        self.supabase_url = os.getenv('SUPABASE_URL', '')
        self.supabase_key = os.getenv('SUPABASE_ANON_KEY', '')
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key) if self.supabase_url else None
        self.batch_size = 1000
        self.data_path = "../data"
        
    async def process_applicants(self):
        """Process and ingest applicants data with advanced transformations"""
        logger.info("Processing Applicants data...")
        
        df = pd.read_csv(f"{self.data_path}/Applicants 2025.csv", low_memory=False)
        
        # Data cleaning and transformation
        df['Application Dt'] = pd.to_datetime(df['Application Dt'], errors='coerce')
        df['Vol Start Dt'] = pd.to_datetime(df['Vol Start Dt'], errors='coerce')
        df['Inactive Dt'] = pd.to_datetime(df['Inactive Dt'], errors='coerce')
        
        # Extract geographic data
        if 'X' in df.columns and 'Y' in df.columns:
            df['longitude'] = pd.to_numeric(df['X'], errors='coerce')
            df['latitude'] = pd.to_numeric(df['Y'], errors='coerce')
            
        # Calculate derived metrics
        df['conversion_success'] = df['Intake Outcome'] == 'Converted to Volunteer'
        df['is_active'] = df['Current Status'].isin(['General Volunteer', 'Event Based Volunteer'])
        
        # Prepare for database
        records = []
        for _, row in tqdm(df.iterrows(), total=len(df), desc="Preparing applicants"):
            record = {
                'entry_point': row.get('Entry Point'),
                'entry_point_final_status': row.get('Entry Point Final Status'),
                'how_did_you_hear': row.get('How Did You Hear'),
                'intake_outcome': row.get('Intake Outcome'),
                'current_status': row.get('Current Status'),
                'application_dt': row.get('Application Dt').isoformat() if pd.notna(row.get('Application Dt')) else None,
                'vol_start_dt': row.get('Vol Start Dt').isoformat() if pd.notna(row.get('Vol Start Dt')) else None,
                'days_to_vol_start': int(row.get('Days To Vol Start')) if pd.notna(row.get('Days To Vol Start')) else None,
                'state': row.get('State'),
                'city': row.get('City'),
                'county': row.get('County'),
                'latitude': float(row.get('latitude')) if pd.notna(row.get('latitude')) else None,
                'longitude': float(row.get('longitude')) if pd.notna(row.get('longitude')) else None
            }
            records.append(record)
            
        # Batch insert to Supabase
        if self.supabase:
            for i in range(0, len(records), self.batch_size):
                batch = records[i:i + self.batch_size]
                try:
                    self.supabase.table('applicants').insert(batch).execute()
                    logger.info(f"Inserted batch {i//self.batch_size + 1} of applicants")
                except Exception as e:
                    logger.error(f"Error inserting applicants batch: {e}")
                    
        return len(records)
    
    async def process_volunteers(self):
        """Process volunteers with engagement scoring"""
        logger.info("Processing Volunteers data...")
        
        df = pd.read_csv(f"{self.data_path}/Volunteer 2025.csv", low_memory=False)
        
        # Calculate engagement score
        df['last_login_date'] = pd.to_datetime(df.get('Last Login Date'), errors='coerce')
        df['volunteer_since_date'] = pd.to_datetime(df.get('Volunteer Since Date'), errors='coerce')
        
        # Engagement scoring algorithm
        def calculate_engagement(row):
            score = 0.5  # Base score
            
            # Recent login bonus
            if pd.notna(row.get('last_login_date')):
                days_since_login = (datetime.now() - row['last_login_date']).days
                if days_since_login < 30:
                    score += 0.3
                elif days_since_login < 90:
                    score += 0.1
                    
            # Tenure bonus
            if pd.notna(row.get('volunteer_since_date')):
                years_active = (datetime.now() - row['volunteer_since_date']).days / 365
                score += min(0.2, years_active * 0.02)
                
            return min(1.0, score)
        
        df['engagement_score'] = df.apply(calculate_engagement, axis=1)
        
        # Calculate retention risk
        df['retention_risk_score'] = 1.0 - df['engagement_score']
        
        records = []
        for _, row in tqdm(df.iterrows(), total=len(df), desc="Preparing volunteers"):
            record = {
                'saba_id': row.get('SABA ID'),
                'chapter_name': row.get('Chapter Name'),
                'current_status': row.get('Current Status'),
                'status_type': row.get('Status Type'),
                'state': row.get('State'),
                'disaster_response': row.get('Dis Resp') == 'Yes',
                'second_language': row.get('2nd Language'),
                'volunteer_since_date': row.get('volunteer_since_date').isoformat() if pd.notna(row.get('volunteer_since_date')) else None,
                'engagement_score': float(row.get('engagement_score')),
                'retention_risk_score': float(row.get('retention_risk_score')),
                'latitude': float(row.get('Y')) if pd.notna(row.get('Y')) else None,
                'longitude': float(row.get('X')) if pd.notna(row.get('X')) else None
            }
            records.append(record)
            
        # Batch insert
        if self.supabase:
            for i in range(0, len(records), self.batch_size):
                batch = records[i:i + self.batch_size]
                try:
                    self.supabase.table('volunteers').insert(batch).execute()
                    logger.info(f"Inserted batch {i//self.batch_size + 1} of volunteers")
                except Exception as e:
                    logger.error(f"Error inserting volunteers batch: {e}")
                    
        return len(records)
    
    async def process_blood_drives(self):
        """Process blood drives with efficiency analysis"""
        logger.info("Processing Blood Drives data...")
        
        df = pd.read_csv(f"{self.data_path}/Biomed.csv", encoding='utf-8-sig', low_memory=False)
        
        records = []
        for _, row in tqdm(df.iterrows(), total=len(df), desc="Preparing blood drives"):
            record = {
                'year': int(row.get('Year')) if pd.notna(row.get('Year')) else None,
                'sponsor_ext_id': row.get('Sponsor Ext ID'),
                'status': row.get('Status'),
                'account_name': row.get('Account Name'),
                'account_type': row.get('Account Type'),
                'address': row.get('Address'),
                'city': row.get('City'),
                'state': row.get('St'),
                'zip_code': row.get('Zip'),
                'drives_count': int(row.get('Drives')) if pd.notna(row.get('Drives')) else 1,
                'rbc_product_projection': int(row.get('RBC Product Projection')) if pd.notna(row.get('RBC Product Projection')) else 0,
                'rbc_products_collected': int(row.get('RBC Products Collected')) if pd.notna(row.get('RBC Products Collected')) else 0,
                'latitude': float(row.get('Lat')) if pd.notna(row.get('Lat')) else None,
                'longitude': float(row.get('Long')) if pd.notna(row.get('Long')) else None
            }
            records.append(record)
            
        # Batch insert
        if self.supabase:
            for i in range(0, len(records), self.batch_size):
                batch = records[i:i + self.batch_size]
                try:
                    self.supabase.table('blood_drives').insert(batch).execute()
                    logger.info(f"Inserted batch {i//self.batch_size + 1} of blood drives")
                except Exception as e:
                    logger.error(f"Error inserting blood drives batch: {e}")
                    
        return len(records)
    
    async def process_donors(self):
        """Process donors with lifetime value calculation"""
        logger.info("Processing Donors data...")
        
        df = pd.read_csv(f"{self.data_path}/>\$5K donors past 12 months.csv", encoding='utf-8-sig')
        
        # Clean gift amounts
        df['Gift $'] = df[' Gift $ '].str.replace('$', '').str.replace(',', '').str.strip()
        df['Gift $'] = pd.to_numeric(df['Gift $'], errors='coerce')
        
        # Categorize donors
        def categorize_donor(amount):
            if amount >= 1000000:
                return 'Mega Donor'
            elif amount >= 100000:
                return 'Major Donor'
            elif amount >= 25000:
                return 'Leadership Donor'
            elif amount >= 10000:
                return 'Sustaining Donor'
            else:
                return 'Annual Donor'
                
        df['donor_category'] = df['Gift $'].apply(categorize_donor)
        
        records = []
        for _, row in tqdm(df.iterrows(), total=len(df), desc="Preparing donors"):
            record = {
                'gift_amount': float(row.get('Gift $')) if pd.notna(row.get('Gift $')) else 0,
                'donor_category': row.get('donor_category'),
                'lifetime_value': float(row.get('Gift $')) * 3,  # Estimated 3-year value
                'latitude': float(row.get('Y')) if pd.notna(row.get('Y')) else None,
                'longitude': float(row.get('X')) if pd.notna(row.get('X')) else None
            }
            records.append(record)
            
        # Batch insert
        if self.supabase:
            for i in range(0, len(records), self.batch_size):
                batch = records[i:i + self.batch_size]
                try:
                    self.supabase.table('donors').insert(batch).execute()
                    logger.info(f"Inserted batch {i//self.batch_size + 1} of donors")
                except Exception as e:
                    logger.error(f"Error inserting donors batch: {e}")
                    
        return len(records)
    
    async def run_full_pipeline(self):
        """Execute complete data ingestion pipeline"""
        logger.info("Starting full data ingestion pipeline...")
        
        results = {
            'applicants': await self.process_applicants(),
            'volunteers': await self.process_volunteers(),
            'blood_drives': await self.process_blood_drives(),
            'donors': await self.process_donors()
        }
        
        # Refresh materialized views
        if self.supabase:
            try:
                self.supabase.rpc('refresh_executive_kpis').execute()
                logger.info("Refreshed executive KPIs materialized view")
            except Exception as e:
                logger.error(f"Error refreshing materialized view: {e}")
                
        # Generate executive alert
        total_records = sum(results.values())
        if self.supabase:
            self.supabase.table('executive_alerts').insert({
                'alert_type': 'data_ingestion_complete',
                'severity': 'low',
                'title': 'Data Ingestion Complete',
                'description': f'Successfully processed {total_records:,} records',
                'metrics': results
            }).execute()
            
        logger.info(f"Pipeline complete: {results}")
        return results

if __name__ == "__main__":
    pipeline = DataIngestionPipeline()
    asyncio.run(pipeline.run_full_pipeline())