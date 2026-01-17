#[cfg(test)]
mod tests {
    use crate::state::AidDistributorState;
    use crate::AidDistributor; // Import the trait to call constructor
    use crate::modules::utils;
    use weil_rs::testing::{MockRuntime, set_sender, set_block_timestamp}; // Hypothetical testing utils
    use weil_rs::collections::WeilId;
    
    // Helper to setup the contract
    fn setup_contract() -> AidDistributorState {
        // 1. Initialize Mock Runtime (Simulates the blockchain)
        let mut runtime = MockRuntime::new();
        runtime.set_sender("admin_account".to_string());
        
        // 2. Call the constructor
        let contract = AidDistributorState::new().unwrap();
        
        contract
    }

    #[test]
    fn test_initialization() {
        let contract = setup_contract();
        
        // Verify USDC supply (1M tokens)
        assert_eq!(contract.usdc.total_supply(), 1_000_000_000_000);
        
        // Verify Maps are empty but initialized
        assert!(contract.disaster_zones.is_empty());
    }

    #[test]
    fn test_full_voucher_lifecycle() {
        let mut contract = setup_contract();
        let zone_id = "ZONE_01".to_string();
        let vendor_id = "vendor_bob".to_string();
        let beneficiary = "user_alice".to_string();
        let amount = 50_000_000; // 50 USDC

        // --- Step 1: Admin setup ---
        set_sender("admin_account".to_string());
        
        // Add Zone
        contract.internal_add_zone(zone_id.clone(), "Flood Zone A".to_string(), 100_000_000).unwrap();
        
        // Register Vendor
        contract.internal_register_vendor(vendor_id.clone(), "Food".to_string()).unwrap();

        // --- Step 2: Issue Voucher ---
        // Assume current time is 1000
        set_block_timestamp(1000);
        
        let voucher_id = contract.internal_issue_voucher(
            beneficiary, 
            zone_id.clone(), 
            amount, 
            30 // 30 days expiry
        ).unwrap();

        // Verify state after issuance
        let zone = contract.disaster_zones.get(&zone_id).unwrap();
        assert_eq!(zone.budget_spent, amount);
        
        let voucher = contract.vouchers.get(&voucher_id).unwrap();
        assert_eq!(voucher.status, "Issued");

        // --- Step 3: Redeem Voucher ---
        // Switch context: The VENDOR is now calling the function
        set_sender(vendor_id.clone());

        // Vendor redeems
        let res = contract.internal_redeem_voucher(voucher_id.clone());
        assert!(res.is_ok());

        // Verify final state
        let voucher_updated = contract.vouchers.get(&voucher_id).unwrap();
        assert_eq!(voucher_updated.status, "Redeemed");
        
        // Check USDC transfer (Vendor should have balance)
        assert_eq!(contract.usdc.balance_of(vendor_id), amount);
    }

    #[test]
    fn test_security_unverified_vendor() {
        let mut contract = setup_contract();
        let zone_id = "ZONE_01".to_string();
        let thief_id = "thief_dave".to_string();
        
        // Setup Zone & Voucher
        contract.internal_add_zone(zone_id.clone(), "Test".to_string(), 100_000_000).unwrap();
        let voucher_id = contract.internal_issue_voucher(
            "alice".to_string(), zone_id, 100, 30
        ).unwrap();

        // --- Security Check ---
        // Set sender to someone NOT in the vendor registry
        set_sender(thief_id);

        let res = contract.internal_redeem_voucher(voucher_id);
        
        // MUST fail
        assert!(res.is_err());
        assert_eq!(res.err().unwrap(), "Caller is not a registered vendor");
    }

    #[test]
    fn test_budget_overflow_protection() {
        let mut contract = setup_contract();
        let zone_id = "ZONE_MAX".to_string();
        
        // Create a zone with 100 budget
        contract.internal_add_zone(zone_id.clone(), "Small Budget".to_string(), 100).unwrap();

        // Try to issue a voucher for 101
        let res = contract.internal_issue_voucher(
            "alice".to_string(), 
            zone_id, 
            101, 
            30
        );

        // MUST fail
        assert!(res.is_err());
        assert!(res.err().unwrap().contains("Insufficient budget"));
    }
}