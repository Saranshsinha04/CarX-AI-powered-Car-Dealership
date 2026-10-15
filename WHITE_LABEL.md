# White-Label Customization Guide

The platform is engineered so that a new dealership can be launched or customized without touching application source code or duplicating repositories.

---

## 1. How White-Label Works

A single deployed instance can serve multiple dealerships or adapt dynamically to any brand identity.

Branding, location, contact, financing defaults, and SEO are stored in the database:

```
                  POSTGRESQL
                      │
        ┌─────────────┴─────────────┐
        │                           │
  DEALERSHIP RECORD          DEALERSHIP SETTINGS
  (Name, Slug, Address,      (Theme Colors, Logo,
   Phone, Email, WhatsApp)    Hero Banner, Opening Hours,
                              Loan Rates, Down Payment %,
                              SEO Metadata)
```

---

## 2. Dynamic Theming & Configuration
All customer pages dynamically retrieve settings from `getDealership()` and `getDealershipSettings()`:
- Showroom Name (e.g., "Northstar Motors")
- Tagline (e.g., "Drive what moves you.")
- Physical Address (e.g., "Plot 42-B, Rajpur Road, Dehradun")
- Sales Desk Phone & WhatsApp number
- Primary & Secondary Color Palettes
- Operating Hours for Showroom & Service
- Partner Bank Interest Rates & Loan Durations
- Dynamic LocalBusiness JSON-LD Schema

---

## 3. Launching a New Dealership via Database

To onboard a second dealership (e.g., "Apex Auto" in Chandigarh):

1. **Insert New Dealership Record**:
   ```sql
   INSERT INTO "Dealership" ("id", "name", "slug", "tagline", "email", "phone", "address", "city", "state", "currency")
   VALUES (
     'dealership-apex-002',
     'Apex Auto Hub',
     'apex-auto-hub',
     'Precision engineering on your terms.',
     'contact@apexauto.in',
     '+91 172 250 9999',
     'Phase 7, Industrial Area',
     'Chandigarh',
     'Punjab',
     'INR'
   );
   ```

2. **Insert Settings**:
   ```sql
   INSERT INTO "DealershipSettings" ("id", "dealershipId", "primaryColor", "aboutText", "openingHours")
   VALUES (
     'settings-apex-002',
     'dealership-apex-002',
     '#e11d48',
     'Chandigarh premier automotive showroom.',
     '{"mon_fri": "9:30 AM - 7:30 PM", "sat": "9:30 AM - 8:00 PM", "sun": "Closed"}'
   );
   ```

3. **Associate Inventory & Users**:
   Add vehicles and staff accounts with `dealershipId: 'dealership-apex-002'`.

The same Next.js codebase seamlessly serves each dealership with complete data isolation!
