-- Drop old constraint and add updated one with new template keys
ALTER TABLE entries
  DROP CONSTRAINT IF EXISTS entries_template_check;

ALTER TABLE entries
  ADD CONSTRAINT entries_template_check
  CHECK (template IN ('freeform', 'morning', 'evening', 'wellbeing', 'growth', 'simple321'));
