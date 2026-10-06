insert into categories (id, name, slug)
values
  ('human-resources', 'Human Resources', 'human-resources'),
  ('beauty-personal-care', 'Beauty & Personal Care', 'beauty-personal-care')
on conflict (id) do nothing;
