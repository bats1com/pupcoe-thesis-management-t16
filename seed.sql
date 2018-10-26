CREATE TYPE user_type AS ENUM ('student', 'faculty', 'guest');

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(80) NOT NULL,
  "password" VARCHAR(80) NOT NULL,
  "first_name" VARCHAR(80),
  "last_name" VARCHAR(80) NOT NULL,
  "student_number" VARCHAR(20),
  "phone" VARCHAR(80),
  "user_type" user_type default 'student' NOT NULL,
  "is_admin" boolean default 'f' NOT NULL
);

-- INSERT INTO users(first_name, last_name, email, password, phone, user_type, is_admin)
--   VALUES (
--     'Jomar',
--     'Vista',
--     'jdvista96@gmail.com',
--     '123',
--     '09123456789',
--     'faculty',
--     't'
--   );

CREATE TABLE "classes" (
  "id" SERIAL PRIMARY KEY,
  "batch" VARCHAR(4) NOT NULL,
  "section" VARCHAR(2) NOT NULL,
  "adviser" INT REFERENCES users(id)
);

CREATE TABLE "classStudents" (
  "id" SERIAL PRIMARY KEY,
  "class_id" INT REFERENCES classes(id),
  "student_id" INT REFERENCES users(id)
);

CREATE TABLE "groups" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(80) NOT NULL,
  "section" VARCHAR(2) NOT NULL,
  "adviser" INT REFERENCES users(id),
  "thesis_id" INT REFERENCES thesis(id)
);

CREATE TABLE "group_members" (
  "id" SERIAL PRIMARY KEY,
  "group_id" INT REFERENCES groups(id),
  "student_id" INT REFERENCES users(id)
);

-- add committee table

CREATE TABLE "committee_members" (
  "id" SERIAL PRIMARY KEY,
  "faculty_id" INT REFERENCES users(id)
);

-- add thesis table

CREATE TYPE current_stage AS ENUM ('none', 'mor', 'dp1', 'dp2');

CREATE TABLE "thesis" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(200) NOT NULL,
  "abstract" VARCHAR(1000) NOT NULL,
  "group_id" INT REFERENCES groups(id),
  "year" VARCHAR(4) NOT NULL,
  "adviser_id" INT REFERENCES users(id),
  "adviser_approved" boolean default 'f' NOT NULL,
  "adviser_rejected" boolean default 'f' NOT NULL,
  "committee_approved" boolean default 'f' NOT NULL,
  "current_stage" current_stage default 'none' NOT NULL,
  "final_verdict" boolean default 'f' NOT NULL
);

CREATE TABLE "committee_approval" (
  "id" SERIAL PRIMARY KEY,
  "thesis_id" INT REFERENCES thesis(id),
  "member_approval" INT default 0 NOT NULL
);

CREATE TABLE "members_done" (
  "id" SERIAL PRIMARY KEY,
  "thesis_id" INT REFERENCES thesis(id),
  "committee_id" INT REFERENCES users(id)
);

-- DROP TABLE committee_approval CASCADE;
-- DROP TABLE members_done CASCADE;
-- CREATE TYPE defense_type AS ENUM ('MOR', 'DP1', 'DP2');
-- CREATE TYPE status AS ENUM ('failed, passed')
-- CREATE TABLE "defense" (
--   "id" SERIAL PRIMARY KEY
--   "thesis_id" INT REFERENCES thesis(id),
--   "defense_type" defense_type default 'MOR' NOT NULL
--   "status"
-- );
-- ALTER TABLE thesis DROP COLUMN for_defense;
-- CREATE TYPE current_stage AS ENUM ('none', 'mor', 'dp1', 'dp2');
-- ALTER TABLE thesis ADD COLUMN current_stage current_stage default 'none' NOT NULL;
-- ALTER TABLE groups ADD COLUMN thesis_id INT REFERENCES thesis(id);

