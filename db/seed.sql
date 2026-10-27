-- Run after schema.sql. Idempotent.
-- Skips names that already exist, so re-running after schema.sql's backfill makes no duplicates.
INSERT INTO customers (id, name, contact, suburb)
SELECT v.id, v.name, v.contact, v.suburb FROM (VALUES
  ('customer-001', 'Miller Family Home', 'miller@example.com', 'Richmond'),
  ('customer-002', 'Olivia Hart', 'olivia@example.com', 'Fitzroy'),
  ('customer-003', 'Northside Bakery', 'hello@northside.example', 'Brunswick'),
  ('customer-004', 'James & Co', 'office@jamesco.example', 'Collingwood'),
  ('customer-005', 'Harper Street Clinic', 'reception@harper.example', 'Prahran'),
  ('customer-006', 'Daniel Nguyen', NULL, 'Richmond'),
  ('customer-007', 'Easton Property Group', NULL, 'South Yarra'),
  ('customer-008', 'Sofia Romano', NULL, 'Abbotsford'),
  ('customer-009', 'Wattle & Vine Cafe', NULL, 'Hawthorn'),
  ('customer-010', 'Mia Thompson', NULL, 'Kew'),
  ('customer-011', 'Parkview Apartments', NULL, 'Southbank'),
  ('customer-012', 'Liam Wilson', NULL, 'Carlton'),
  ('customer-013', 'Bayside Montessori', NULL, 'Port Melbourne'),
  ('customer-014', 'Chloe Bennett', NULL, 'Malvern'),
  ('customer-015', 'The Garden Room', NULL, 'Hampton'),
  ('customer-016', 'Lucas Martin', NULL, 'Glen Iris'),
  ('customer-017', 'Beacon Legal', NULL, 'Melbourne CBD'),
  ('customer-018', 'Ava Patel', NULL, 'Coburg'),
  ('customer-019', 'Cedar Lane Retail', NULL, 'Yarraville'),
  ('customer-020', 'Ethan Brooks', NULL, 'Footscray')
) AS v(id, name, contact, suburb)
WHERE NOT EXISTS (SELECT 1 FROM customers c WHERE c.id = v.id OR lower(c.name) = lower(v.name));

-- Directory entries only: these employees have no login until an admin sets an email and password.
INSERT INTO employees (id, name, role, contact) VALUES
  ('employee-001', 'Cody', 'Lead electrician', 'cody@ampy.com.au'),
  ('employee-002', 'Ryan', 'Electrician', 'ryan@ampy.com.au'),
  ('employee-003', 'Ben', 'Electrician', 'ben@ampy.com.au'),
  ('employee-004', 'Alex', 'Apprentice electrician', 'alex@ampy.com.au')
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (id, customer_id, customer, suburb, job_type, status, value, created_at)
SELECT v.id, c.id, c.name, v.suburb, v.job_type, v.status, v.value, v.created_at::timestamptz FROM (VALUES
  ('job-001', 'Miller Family Home', 'Richmond', 'Electrical inspection', 'new', 485, '2026-10-24T08:30:00Z'),
  ('job-002', 'Olivia Hart', 'Fitzroy', 'Switchboard upgrade', 'scheduled', 1820, '2026-10-23T13:15:00Z'),
  ('job-003', 'Northside Bakery', 'Brunswick', 'Commercial lighting', 'in_progress', 2740, '2026-10-22T09:00:00Z'),
  ('job-004', 'James & Co', 'Collingwood', 'Power point installation', 'completed', 690, '2026-10-21T16:45:00Z'),
  ('job-005', 'Harper Street Clinic', 'Prahran', 'Safety compliance check', 'scheduled', 950, '2026-10-21T11:30:00Z'),
  ('job-006', 'Daniel Nguyen', 'Richmond', 'EV charger install', 'new', 2480, '2026-10-20T10:20:00Z'),
  ('job-007', 'Easton Property Group', 'South Yarra', 'Smoke alarm replacement', 'completed', 760, '2026-10-19T14:10:00Z'),
  ('job-008', 'Sofia Romano', 'Abbotsford', 'Outdoor power and lighting', 'in_progress', 1380, '2026-10-18T08:10:00Z'),
  ('job-009', 'Wattle & Vine Cafe', 'Hawthorn', 'Appliance circuit', 'scheduled', 1120, '2026-10-17T12:40:00Z'),
  ('job-010', 'Mia Thompson', 'Kew', 'Ceiling fan installation', 'completed', 540, '2026-10-16T15:05:00Z'),
  ('job-011', 'Parkview Apartments', 'Southbank', 'Emergency callout', 'new', 320, '2026-10-15T18:20:00Z'),
  ('job-012', 'Liam Wilson', 'Carlton', 'Recessed lighting', 'in_progress', 1660, '2026-10-14T09:35:00Z'),
  ('job-013', 'Bayside Montessori', 'Port Melbourne', 'Electrical maintenance', 'scheduled', 2040, '2026-10-13T10:50:00Z'),
  ('job-014', 'Chloe Bennett', 'Malvern', 'Home rewiring consult', 'new', 360, '2026-10-12T11:25:00Z'),
  ('job-015', 'The Garden Room', 'Hampton', 'Garden studio wiring', 'in_progress', 3250, '2026-10-11T07:55:00Z'),
  ('job-016', 'Lucas Martin', 'Glen Iris', 'Data cabling', 'completed', 880, '2026-10-10T13:40:00Z'),
  ('job-017', 'Beacon Legal', 'Melbourne CBD', 'Office fit-out', 'scheduled', 4160, '2026-10-09T08:45:00Z'),
  ('job-018', 'Ava Patel', 'Coburg', 'Hot water connection', 'completed', 730, '2026-10-08T16:10:00Z'),
  ('job-019', 'Cedar Lane Retail', 'Yarraville', 'Security lighting', 'new', 1290, '2026-10-07T09:15:00Z'),
  ('job-020', 'Ethan Brooks', 'Footscray', 'Renovation rough-in', 'in_progress', 2950, '2026-10-06T10:05:00Z')
) AS v(id, customer_name, suburb, job_type, status, value, created_at)
JOIN customers c ON lower(c.name) = lower(v.customer_name)
ON CONFLICT (id) DO NOTHING;

INSERT INTO job_notes (id, job_id, content, created_at)
SELECT v.id::uuid, v.job_id, v.content, v.created_at::timestamptz FROM (VALUES
  ('00000000-0000-4000-8000-000000000001', 'job-003', 'Site access confirmed with Priya for Thursday morning.', '2026-10-23T07:30:00Z'),
  ('00000000-0000-4000-8000-000000000002', 'job-003', 'Waiting on the final fixture count before ordering materials.', '2026-10-24T06:15:00Z'),
  ('00000000-0000-4000-8000-000000000003', 'job-008', 'Customer prefers the garden lights on a separate timer.', '2026-10-20T04:40:00Z')
) AS v(id, job_id, content, created_at)
WHERE NOT EXISTS (SELECT 1 FROM job_notes n WHERE n.id = v.id::uuid OR (n.job_id = v.job_id AND n.content = v.content));
