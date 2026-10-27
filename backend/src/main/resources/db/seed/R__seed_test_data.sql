-- Prerequisites:
--   1. The database must be empty before running this script.
--
-- Contents:
--   1. Users
--   2. Organizational units
--   3. Employee-unit memberships and supervisor assignments
--   4. Competencies
--   5. Qualifications
--   6. Qualification requirements
--   7. Employee competencies and expiry scenarios
--   8. Renewal plans
--   9. Employee qualification assignments
--
-- Dates are relative to CURRENT_DATE so expiry scenarios remain
-- useful over time.
-- ============================================================


-- ============================================================
-- 1. USERS
-- ============================================================
-- The first 3 users are required for changing the user role in the application.
-- Don't change their emails or roles.

INSERT INTO app_user (first_name, last_name, email, system_role)
VALUES
    ('John',   'Employee',       'test_EMPLOYEE@email.com',      'EMPLOYEE'),
    ('Jane',   'Supervisor',     'test_SUPERVISOR@email.com',    'SUPERVISOR'),
    ('Bob',    'Administrator',  'test_ADMINISTRATOR@email.com', 'ADMINISTRATOR'),
    ('Anna',   'Korhonen',       'anna.korhonen@example.com',    'EMPLOYEE'),
    ('Mika',   'Niemi',          'mika.niemi@example.com',       'EMPLOYEE'),
    ('Laura',  'Virtanen',       'laura.virtanen@example.com',   'EMPLOYEE'),
    ('Oskari', 'Laine',          'oskari.laine@example.com',     'EMPLOYEE'),
    ('Emma',   'Heikkinen',      'emma.heikkinen@example.com',   'EMPLOYEE'),
    ('Peter',  'Makinen',        'peter.makinen@example.com',    'SUPERVISOR'),
    ('Sofia',  'Salonen',        'sofia.salonen@example.com',    'SUPERVISOR');


-- ============================================================
-- 2. ORGANIZATIONAL UNITS
-- ============================================================

INSERT INTO unit (name)
VALUES
    ('Warehouse'),
    ('Logistics'),
    ('Maintenance');


-- ============================================================
-- 3A. EMPLOYEE-UNIT MEMBERSHIPS
-- ============================================================
-- Demonstrate employees belonging to multiple units and units
-- containing multiple employees.

INSERT INTO employee_unit (employee_id, unit_id)
SELECT u.id, un.id
FROM (
    VALUES
        ('test_EMPLOYEE@email.com',    'Warehouse'),
        ('test_EMPLOYEE@email.com',    'Logistics'),
        ('anna.korhonen@example.com',  'Warehouse'),
        ('mika.niemi@example.com',     'Warehouse'),
        ('laura.virtanen@example.com', 'Logistics'),
        ('oskari.laine@example.com',   'Maintenance'),
        ('emma.heikkinen@example.com', 'Logistics'),
        ('emma.heikkinen@example.com', 'Maintenance')
) AS v(email, unit_name)
JOIN app_user u ON u.email = v.email
JOIN unit un ON un.name = v.unit_name;


-- ============================================================
-- 3B. SUPERVISOR-UNIT ASSIGNMENTS
-- ============================================================
-- Demonstrate a unit having multiple supervisors.

INSERT INTO supervisor_unit (supervisor_id, unit_id)
SELECT u.id, un.id
FROM (
    VALUES
        ('test_SUPERVISOR@email.com', 'Warehouse'),
        ('sofia.salonen@example.com', 'Warehouse'),
        ('peter.makinen@example.com', 'Logistics')

) AS v(email, unit_name)
JOIN app_user u ON u.email = v.email
JOIN unit un ON un.name = v.unit_name;


-- ============================================================
-- 4. COMPETENCIES
-- ============================================================
-- Covers every competency_type enum value.
-- NULL validity_months means the competency does not expire.

INSERT INTO competency (name, type, validity_months)
VALUES
    ('Fire Safety Training',           'TRAINING',      12),
    ('First Aid Training',             'TRAINING',      NULL),
    ('First Aid Certificate',          'CERTIFICATION', NULL),
    ('Forklift License',               'LICENSE',       36),
    ('Electrical Safety Training',     'TRAINING',      12),
    ('Maintenance Safety Certificate', 'CERTIFICATION', 36),
    ('Equipment Inspection Skill',     'SKILL',         24),
    ('Incident Reporting',             'OTHER',         24);


-- ============================================================
-- 5. QUALIFICATIONS
-- ============================================================

INSERT INTO qualification (name)
VALUES
    ('Warehouse Operator'),
    ('First Aid Responder'),
    ('Maintenance Technician'),
    ('Logistics Coordinator');


-- ============================================================
-- 6. QUALIFICATION REQUIREMENTS
-- ============================================================
-- A qualification requires ALL listed competencies to be valid
-- for an employee to satisfy its requirements.

INSERT INTO qualification_requirement
    (qualification_id, competency_id)
SELECT q.id, c.id
FROM (
    VALUES
        ('Warehouse Operator',     'Fire Safety Training'),
        ('Warehouse Operator',     'Forklift License'),

        ('First Aid Responder',    'First Aid Training'),
        ('First Aid Responder',    'First Aid Certificate'),

        ('Maintenance Technician', 'Electrical Safety Training'),
        ('Maintenance Technician', 'Maintenance Safety Certificate'),

        ('Logistics Coordinator',  'Incident Reporting'),
        ('Logistics Coordinator',  'Equipment Inspection Skill')
) AS v(qualification_name, competency_name)
JOIN qualification q ON q.name = v.qualification_name
JOIN competency c ON c.name = v.competency_name;


-- ============================================================
-- 7. EMPLOYEE COMPETENCIES
-- ============================================================
-- expiration_offset_days is the desired number of days from
-- CURRENT_DATE until expiration:
--   Negative = already expired
--   Positive = expires in the future
--   NULL     = no expiry (only used with non-expiring competencies)
--
-- For expiring competencies, expiration_date is set directly
-- from the desired offset. issue_date is calculated backwards
-- using the competency's validity_months.
--
-- Scenario overview:
--   John (test_EMPLOYEE@email.com): employee frontend test account;
--       valid, expiring soon, expired, and non-expiring competencies.
--       Meets Warehouse Operator requirements but has an expired
--       competency unrelated to that qualification.
--   Anna: meets Warehouse Operator and First Aid Responder requirements;
--       one competency expires soon.
--   Mika: expired safety training and an upcoming license expiry.
--   Laura: meets Maintenance Technician requirements.
--   Oskari: expired electrical safety training.
--   Emma: expired first-aid certificate and logistics competencies.


-- WITH scenarios creates a temporary table about the data to be inserted.
WITH scenarios(email, competency_name, expiration_offset_days) AS (
    VALUES
        -- John Employee: cover multiple employee frontend scenarios

        -- Warehouse Operator: valid with expiring soon competencies
        ('test_EMPLOYEE@email.com',
         'Fire Safety Training', 30),
        ('test_EMPLOYEE@email.com',
         'Forklift License', 90),

        -- First Aid Responder: valid with competencies without expiry
        ('test_EMPLOYEE@email.com',
         'First Aid Training', NULL),
         ('test_EMPLOYEE@email.com',
         'First Aid Certificate', NULL),

        -- Maintenance Technician: invalid due to expired competency
        ('test_EMPLOYEE@email.com',
         'Electrical Safety Training', -30),
        ('test_EMPLOYEE@email.com',
         'Maintenance Safety Certificate', 150),

        -- Logistics Coordinator: Invalid due to missing competency (incident reporting)
        ('test_EMPLOYEE@email.com',
         'Equipment Inspection Skill', 150),


        -- Anna Korhonen: qualified for Warehouse Operator
        -- and First Aid Responder; some expiry dates are approaching
        ('anna.korhonen@example.com',
         'Fire Safety Training', 30),
        ('anna.korhonen@example.com',
         'Forklift License', 90),
        ('anna.korhonen@example.com',
         'First Aid Training', NULL),
        ('anna.korhonen@example.com',
         'First Aid Certificate', NULL),

        -- Mika Niemi: expired training and upcoming license expiry
        ('mika.niemi@example.com',
         'Fire Safety Training', -30),
        ('mika.niemi@example.com',
         'Forklift License', 30),
        ('mika.niemi@example.com',
         'Incident Reporting', 90),

        -- Laura Virtanen: meets Maintenance Technician requirements
        ('laura.virtanen@example.com',
         'Electrical Safety Training', 75),
        ('laura.virtanen@example.com',
         'Maintenance Safety Certificate', 75),
        ('laura.virtanen@example.com',
         'Equipment Inspection Skill', 75),

        -- Oskari Laine: expired and expiring competencies for maintenance technician
        ('oskari.laine@example.com',
         'Electrical Safety Training', -30),
        ('oskari.laine@example.com',
         'Maintenance Safety Certificate', 45),

        -- Emma Heikkinen: expired certificate and logistics competencies
        ('emma.heikkinen@example.com',
         'First Aid Training', NULL),
        ('emma.heikkinen@example.com',
         'First Aid Certificate', NULL),
        ('emma.heikkinen@example.com',
         'Incident Reporting', -90),
        ('emma.heikkinen@example.com',
         'Equipment Inspection Skill', 90)
),
-- resolved is another temporary table, but with the user_id and competency_id values resolved from the email and competency_name.
resolved AS (
    SELECT
        u.id AS user_id,
        c.id AS competency_id,
        c.validity_months,
        s.expiration_offset_days,
        -- expiration_offset_days is used to calculate the desired expiration date for expiring competencies.
        CASE
            WHEN s.expiration_offset_days IS NULL THEN NULL
            ELSE CURRENT_DATE + s.expiration_offset_days
        END AS desired_expiration_date
    FROM scenarios s
    JOIN app_user u ON u.email = s.email
    JOIN competency c ON c.name = s.competency_name
),
-- dated is another temporary table that calculates the issue_date based on the desired expiration_date and the competency's validity_months.
-- If validity_months is NULL, the issue_date is set to 180 days before the current date.
dated AS (
    SELECT
        user_id,
        competency_id,
        validity_months,
        desired_expiration_date,
        CASE
            WHEN validity_months IS NULL
                THEN CURRENT_DATE - 180
            ELSE (
                desired_expiration_date
                -- make_interval creates an interval (which is a unit of time). Issue date = desired expiration date - validity_months.
                - make_interval(months => validity_months)
            )::date
        END AS issue_date
    FROM resolved
)
-- Here the actual insert is done.
INSERT INTO employee_competency
    (user_id, competency_id, issue_date, expiration_date)
SELECT
    user_id,
    competency_id,
    issue_date,
    desired_expiration_date
FROM dated;


-- ============================================================
-- 8. RENEWAL PLANS
-- ============================================================

INSERT INTO renewal_plan
    (employee_competency_id, renewal_date, renewal_comment)
SELECT
    ec.id,
    CURRENT_DATE + v.days_until_renewal,
    v.renewal_comment
FROM (
    VALUES
        ('test_EMPLOYEE@email.com',
         'Fire Safety Training',
         10,
         'Book the next fire safety training session.'),

        ('mika.niemi@example.com',
         'Forklift License',
         12,
         'Arrange license renewal before expiry.'),

        ('oskari.laine@example.com',
         'Electrical Safety Training',
         10,
         'Renew electrical safety training before assigning electrical work.')
) AS v(email, competency_name, days_until_renewal, renewal_comment)
JOIN app_user u ON u.email = v.email
JOIN competency c ON c.name = v.competency_name
JOIN employee_competency ec
    ON ec.user_id = u.id
   AND ec.competency_id = c.id;


-- ============================================================
-- 9. EMPLOYEE QUALIFICATION ASSIGNMENTS
-- ============================================================
-- These rows assign qualifications to employees; they do not
-- grant the required competencies.
--
-- The application should calculate qualification status based
-- on the employee's current competencies and their expiry dates.
--
-- favourite and critical flags vary to support filtering tests.

INSERT INTO employee_qualification
    (user_id, qualification_id, favourite, critical)
SELECT
    u.id,
    q.id,
    v.favourite,
    v.critical
FROM (
    VALUES
        ('test_EMPLOYEE@email.com',
         'Warehouse Operator', TRUE, TRUE),
        ('test_EMPLOYEE@email.com',
         'First Aid Responder', FALSE, TRUE),
         ('test_EMPLOYEE@email.com', 'Maintenance Technician', TRUE, FALSE),
         ('test_EMPLOYEE@email.com', 'Logistics Coordinator', FALSE, TRUE),

        ('anna.korhonen@example.com',
         'Warehouse Operator', FALSE, TRUE),
        ('anna.korhonen@example.com',
         'First Aid Responder', FALSE, TRUE),

        ('mika.niemi@example.com',
         'Warehouse Operator', FALSE, TRUE),

        ('laura.virtanen@example.com',
         'Maintenance Technician', FALSE, TRUE),

        ('oskari.laine@example.com',
         'Maintenance Technician', FALSE, TRUE),

        ('emma.heikkinen@example.com',
         'First Aid Responder', FALSE, TRUE),
        ('emma.heikkinen@example.com',
         'Logistics Coordinator', FALSE, TRUE)
) AS v(email, qualification_name, favourite, critical)
JOIN app_user u ON u.email = v.email
JOIN qualification q ON q.name = v.qualification_name;
