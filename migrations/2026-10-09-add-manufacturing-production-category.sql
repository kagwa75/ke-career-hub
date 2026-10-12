insert into categories (id, name, slug)
values (gen_random_uuid(), 'Manufacturing & Production', 'manufacturing-production')
on conflict (slug) do nothing;
