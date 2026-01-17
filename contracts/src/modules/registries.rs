use crate::state::AidDistributorState;
use crate::types::{DisasterZone, Vendor};

impl AidDistributorState {
    
    // --- Vendor Logic ---
    
    pub fn internal_register_vendor(&mut self, vendor_addr: String, category: String) -> Result<(), String> {
        // Validation: Don't overwrite existing verified vendors without explicit logic
        if let Some(existing) = self.vendors.get(&vendor_addr) {
            if existing.verified {
                return Err("Vendor already registered and verified".to_string());
            }
        }

        let vendor = Vendor {
            id: vendor_addr.clone(),
            category,
            verified: true,
        };
        self.vendors.insert(vendor_addr, vendor);
        Ok(())
    }

    pub fn internal_is_verified_vendor(&self, vendor_addr: &String) -> bool {
        match self.vendors.get(vendor_addr) {
            Some(v) => v.verified,
            None => false,
        }
    }

    // --- Disaster Zone Logic ---

    pub fn internal_add_zone(&mut self, zone_id: String, name: String, initial_budget: u64) -> Result<(), String> {
        if self.disaster_zones.get(&zone_id).is_some() {
            return Err("Zone ID already exists".to_string());
        }

        let zone = DisasterZone {
            name,
            active: true,
            budget_allocated: initial_budget,
            budget_spent: 0,
        };
        self.disaster_zones.insert(zone_id, zone);
        Ok(())
    }

    // [DELETED] internal_allocate_budget -> This is now in src/modules/treasury.rs
}