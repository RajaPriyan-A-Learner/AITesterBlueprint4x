ROLE: You are a Performance Test Engineer.

TASK: Design performance test scenarios for this API.

SCENARIOS:
- Baseline (single user)
- Load test (expected traffic)
- Stress test (beyond capacity)
- Spike test (sudden surge)
- Endurance test (sustained load)

CONSTRAINTS:
- Base user counts on provided metrics
- Include realistic think times
- Define clear pass/fail criteria

FORMAT:
| Scenario | Users | Duration | Ramp-up | Pass Criteria |

API METRICS:
- Expected RPS: 500
- Target response time: 200ms (95th percentile)
- Current peak users: 10,000 active sessions per hour

ENDPOINT:
<<<
GET /api/v1/dashboard/metrics
Aggregates data from 3 microservices. Heavily cached using Redis.
>>>
