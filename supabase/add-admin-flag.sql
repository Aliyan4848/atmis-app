-- Run this in Supabase SQL Editor AFTER schema.sql has already been applied.
-- Adds a real admin flag so /admin can be properly gated.

alter table profiles add column if not exists is_admin boolean not null default false;

-- Grant yourself admin access — replace the email with your actual registered account.
update profiles
set is_admin = true
where id = (select id from auth.users where email = 'YOUR-EMAIL-HERE@example.com');
