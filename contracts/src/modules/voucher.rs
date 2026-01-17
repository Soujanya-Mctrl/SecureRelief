use crate::state::AidDistributorState;
use crate::types::Voucher;
use crate::modules::utils::{generate_voucher_id, current_timestamp};
use weil_rs::runtime::Runtime;

impl AidDistributorState {
    
    pub fn internal_issue_voucher(
        &mut self, 
        beneficiary_id: String, 
        zone_id: String, 
        amount: u64, 
        expiry_days: u64
    ) -> Result<String, String> {
        
        // 1. Load Zone and Check Budget
        let mut zone = self.disaster_zones.get(&zone_id).ok_or("Zone not found")?;
        
        if !zone.active {
            return Err("Disaster zone is not active".to_string());
        }

        let new_spent = zone.budget_spent.checked_add(amount)
            .ok_or("Budget calculation overflow")?;

        if new_spent > zone.budget_allocated {
            return Err(format!(
                "Insufficient budget. Remaining: {}", 
                zone.budget_allocated - zone.budget_spent
            ));
        }

        // 2. Generate Voucher Data
        let voucher_id = generate_voucher_id(&zone_id, &beneficiary_id);
        
        // Double spend check (Idempotency)
        if self.vouchers.get(&voucher_id).is_some() {
            return Err("Voucher already issued for this beneficiary in this batch".to_string());
        }

        let voucher = Voucher {
            id: voucher_id.clone(),
            beneficiary_id,
            amount,
            zone_id: zone_id.clone(),
            status: "Issued".to_string(),
            expiry: current_timestamp() + (expiry_days * 86400),
        };

        // 3. Commit State
        zone.budget_spent = new_spent;
        self.disaster_zones.insert(zone_id, zone);
        self.vouchers.insert(voucher_id.clone(), voucher);

        Ok(voucher_id)
    }

    pub fn internal_redeem_voucher(&mut self, voucher_id: String) -> Result<(), String> {
        let sender = Runtime::sender();

        // 1. Check Vendor Auth
        // Note: reusing the helper from registries.rs logic would require `self` juggling,
        // so we access the map directly here for simplicity in Rust ownership.
        let vendor = self.vendors.get(&sender).ok_or("Caller is not a registered vendor")?;
        if !vendor.verified {
            return Err("Vendor is suspended or not verified".to_string());
        }

        // 2. Load Voucher
        let mut voucher = self.vouchers.get(&voucher_id).ok_or("Voucher invalid")?;

        // 3. Validate Voucher State
        if voucher.status != "Issued" {
            return Err(format!("Voucher status is {}", voucher.status));
        }
        
        if current_timestamp() > voucher.expiry {
            voucher.status = "Expired".to_string();
            self.vouchers.insert(voucher_id, voucher);
            return Err("Voucher has expired".to_string());
        }

        // 4. Perform Financial Transfer
        // The contract transfers its own USDC to the vendor
        self.usdc.transfer(sender, voucher.amount).map_err(|e| e.to_string())?;

        // 5. Update Status
        voucher.status = "Redeemed".to_string();
        self.vouchers.insert(voucher_id, voucher);

        Ok(())
    }
}