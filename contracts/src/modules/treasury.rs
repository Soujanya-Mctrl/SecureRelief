use crate::state::AidDistributorState;
// use weil_rs::runtime::Runtime; // Uncomment if we add reserve checks later

impl AidDistributorState {
    /// Allocates USDC budget to a specific zone.
    /// Moved here from registries.rs to separate Money from Metadata.
    pub fn internal_allocate_budget(&mut self, zone_id: String, amount: u64) -> Result<(), String> {
        let mut zone = self.disaster_zones.get(&zone_id).ok_or("Zone not found")?;
        
        // 1. Safety Check: Integer Overflow
        // This prevents a hack where adding a massive number wraps around to 0.
        zone.budget_allocated = zone.budget_allocated.checked_add(amount)
            .ok_or("Budget overflow: Amount too large")?;

        // 2. (Optional Future Feature) Reserve Check
        // In a production V2, we would check if the Contract's own USDC balance 
        // is >= the total allocated budget across all zones.
        // let current_reserves = self.usdc.balance_of(Runtime::contract_address());
        // if zone.budget_allocated > current_reserves { ... }

        // 3. Commit State
        self.disaster_zones.insert(zone_id, zone);
        
        Ok(())
    }
}