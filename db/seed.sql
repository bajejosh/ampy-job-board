INSERT INTO jobs (id, customer, suburb, job_type, status, value, created_at) VALUES
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
ON CONFLICT (id) DO NOTHING;

INSERT INTO job_notes (job_id, content, created_at) VALUES
  ('job-003', 'Site access confirmed with Priya for Thursday morning.', '2026-10-23T07:30:00Z'),
  ('job-003', 'Waiting on the final fixture count before ordering materials.', '2026-10-24T06:15:00Z'),
  ('job-008', 'Customer prefers the garden lights on a separate timer.', '2026-10-20T04:40:00Z');
