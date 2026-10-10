# Educational USDT Fraud Detection Repo

This repository is for educational purposes only. It demonstrates the difference between:
- a real USDT-like ERC-20 contract
- a deliberately malicious/fake token contract
- a detection script that flags suspicious contract behavior

The goal is to help wallet developers and security researchers build detection logic, not to reproduce fraud for profit or abuse.

## Contents

- `contracts/RealToken.sol` - simplified real ERC-20 implementation
- `contracts/FakeToken.sol` - intentionally suspicious token with red flags
- `scripts/detect-fake-token.js` - static scanner for suspicious patterns
- `README.md` - explanation of differences

## Important note

This repository is intentionally educational and demonstrates how malicious contracts can be identified through code analysis. It is not a production token, not a scam tool, and not meant to be used for fraud.
