-- This file defines the test data for the application.

-- Add the test users for changing the role in the frontend.
INSERT INTO app_user (first_name, last_name, email, role) VALUES
  ('John', 'Doe', 'test_EMPLOYEE@email.com', 'EMPLOYEE'),
  ('Jane', 'Smith', 'test_SUPERVISOR@email.com', 'SUPERVISOR'),
  ('Bob', 'Johnson', 'test_ADMINISTRATOR@email.com', 'ADMINISTRATOR');

