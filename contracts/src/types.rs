// src/types.rs
use serde::{Deserialize, Serialize};
use weil_macros::WeilType;

/// Represents a value voucher issued to a specific beneficiary.
#[derive(Serialize, Deserialize, WeilType, Clone, Debug)]
pub struct Voucher {
    pub id: String,
    pub beneficiary_id: String,
    pub amount: u64,
    pub zone_id: String,
    pub status: String, // "Issued", "Redeemed", "Expired"
    pub expiry: u64,    // Unix timestamp
}

/// Metadata for a specific disaster zone (budgeting).
#[derive(Serialize, Deserialize, WeilType, Clone, Default)]
pub struct DisasterZone {
    pub name: String,
    pub active: bool,
    pub budget_allocated: u64,
    pub budget_spent: u64,
}

/// Vendor profile for the registry.
#[derive(Serialize, Deserialize, WeilType, Clone)]
pub struct Vendor {
    pub id: String,
    pub category: String, // e.g., "Food", "Medical"
    pub verified: bool,
}