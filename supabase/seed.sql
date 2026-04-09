-- Sample seed data for development
-- Note: This requires a user to exist in auth.users first.
-- Run after creating a test user via Supabase Auth.

-- Insert sample subscriptions for a test user
-- Replace 'YOUR_USER_ID' with an actual user UUID after signup

/*
INSERT INTO public.subscriptions (user_id, name, description, amount, billing_cycle, billing_day, next_billing_date, start_date, category_id, website_url, is_active) VALUES
  ('YOUR_USER_ID', 'Netflix', 'Premium plan', 22.99, 'monthly', 15, CURRENT_DATE + INTERVAL '5 days', '2023-06-15', (SELECT id FROM public.categories WHERE name = 'Streaming' LIMIT 1), 'https://netflix.com', true),
  ('YOUR_USER_ID', 'Spotify', 'Family plan', 16.99, 'monthly', 1, CURRENT_DATE + INTERVAL '12 days', '2023-03-01', (SELECT id FROM public.categories WHERE name = 'Music' LIMIT 1), 'https://spotify.com', true),
  ('YOUR_USER_ID', 'iCloud+', '200GB storage', 2.99, 'monthly', 10, CURRENT_DATE + INTERVAL '8 days', '2022-01-10', (SELECT id FROM public.categories WHERE name = 'Cloud Storage' LIMIT 1), null, true),
  ('YOUR_USER_ID', 'ChatGPT Plus', null, 20.00, 'monthly', 20, CURRENT_DATE + INTERVAL '2 days', '2023-11-20', (SELECT id FROM public.categories WHERE name = 'Productivity' LIMIT 1), 'https://openai.com', true),
  ('YOUR_USER_ID', 'Xbox Game Pass', 'Ultimate', 17.99, 'monthly', 5, CURRENT_DATE + INTERVAL '18 days', '2023-08-05', (SELECT id FROM public.categories WHERE name = 'Gaming' LIMIT 1), null, true),
  ('YOUR_USER_ID', 'NYT Digital', 'All access', 25.00, 'monthly', 18, CURRENT_DATE + INTERVAL '22 days', '2024-01-18', (SELECT id FROM public.categories WHERE name = 'News & Reading' LIMIT 1), 'https://nytimes.com', true),
  ('YOUR_USER_ID', 'Peloton', 'App membership', 13.99, 'monthly', 22, CURRENT_DATE + INTERVAL '25 days', '2023-09-22', (SELECT id FROM public.categories WHERE name = 'Fitness' LIMIT 1), null, true),
  ('YOUR_USER_ID', 'YouTube Premium', null, 13.99, 'monthly', 8, CURRENT_DATE + INTERVAL '15 days', '2023-04-08', (SELECT id FROM public.categories WHERE name = 'Streaming' LIMIT 1), null, false);
*/
