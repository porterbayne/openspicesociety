create table shopify_customers (
  id uuid references auth.users primary key,
  shopify_customer_id text not null,
  access_token text not null,
  email text,
  first_name text,
  last_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
