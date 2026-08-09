ROLE: You are a QA Lead planning regression testing.

TASK: Generate a regression test suite for the Shopping Cart Module.

PRIORITIES:
1. Critical business flows
2. Previously failed areas
3. High-risk integrations
4. Core functionality

CONSTRAINTS:
- Focus on end-to-end scenarios
- Include data setup requirements
- Estimate execution time per test

FORMAT:
| Test ID | Scenario | Data Setup | Steps | Est. Time | Priority |

MODULE DOCUMENTATION:
Shopping Cart Module V2.1
Integrates with Stripe for payments and FedEx for shipping calculations.
Key flows include adding items, updating quantities, applying discount codes, and proceeding to checkout.
Known fragile area: Discount codes often fail to apply if added after a shipping method is selected.
