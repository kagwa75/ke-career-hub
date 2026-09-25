-- Keep job list fields compatible with databases where these columns are
-- PostgreSQL text arrays. Existing JSONB arrays are converted without data loss.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = current_schema()
      and table_name = 'jobs'
      and column_name = 'responsibilities'
      and udt_name = 'jsonb'
  ) then
    alter table jobs alter column responsibilities drop default;
    alter table jobs
      alter column responsibilities type text[]
      using array(select jsonb_array_elements_text(responsibilities));
    alter table jobs alter column responsibilities set default '{}'::text[];
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = current_schema()
      and table_name = 'jobs'
      and column_name = 'requirements'
      and udt_name = 'jsonb'
  ) then
    alter table jobs alter column requirements drop default;
    alter table jobs
      alter column requirements type text[]
      using array(select jsonb_array_elements_text(requirements));
    alter table jobs alter column requirements set default '{}'::text[];
  end if;
end $$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = current_schema()
      and table_name = 'jobs'
      and column_name = 'qualifications'
      and udt_name = 'text'
  ) then
    alter table jobs alter column qualifications drop default;
    alter table jobs
      alter column qualifications type text[]
      using case
        when qualifications is null or qualifications = '' then '{}'::text[]
        else array[qualifications]
      end;
  end if;

  update jobs set qualifications = '{}'::text[] where qualifications is null;
  alter table jobs alter column qualifications set default '{}'::text[];
  alter table jobs alter column qualifications set not null;
end $$;
