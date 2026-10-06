-- Missing source details should remain NULL instead of being invented or
-- replaced with placeholder text. Description is already nullable.
alter table jobs alter column location drop not null;
alter table jobs alter column summary drop not null;
alter table jobs alter column responsibilities drop not null;
alter table jobs alter column requirements drop not null;
alter table jobs alter column qualifications drop not null;
