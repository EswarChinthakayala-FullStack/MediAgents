-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 17, 2026 at 11:53 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mediagents_db`
--
CREATE DATABASE IF NOT EXISTS `mediagents_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `mediagents_db`;

-- --------------------------------------------------------

--
-- Table structure for table `agent_events`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `agent_events`;
CREATE TABLE `agent_events` (
  `id` bigint(20) NOT NULL,
  `event_name` varchar(100) NOT NULL,
  `publisher_agent` varchar(50) NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `agent_events`:
--

-- --------------------------------------------------------

--
-- Table structure for table `agent_latency`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `agent_latency`;
CREATE TABLE `agent_latency` (
  `id` bigint(20) NOT NULL,
  `agent_name` varchar(50) NOT NULL,
  `endpoint` varchar(100) DEFAULT NULL,
  `status_code` int(11) DEFAULT NULL,
  `response_ms` int(11) DEFAULT NULL,
  `triggered_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `agent_latency`:
--

-- --------------------------------------------------------

--
-- Table structure for table `alert_timeline`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `alert_timeline`;
CREATE TABLE `alert_timeline` (
  `id` bigint(20) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `alert_type` varchar(50) DEFAULT NULL,
  `severity_score` tinyint(4) DEFAULT NULL,
  `acknowledged` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `alert_timeline`:
--   `patient_id`
--       `patients` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--
-- Creation: Mar 14, 2026 at 04:24 AM
-- Last update: Mar 17, 2026 at 10:39 AM
--

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE `appointments` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `doctor_id` char(36) DEFAULT NULL,
  `triage_id` char(36) DEFAULT NULL,
  `room_id` char(36) DEFAULT NULL,
  `scheduled_at` datetime NOT NULL,
  `duration_mins` smallint(6) DEFAULT 15,
  `status` enum('scheduled','confirmed','in_progress','completed','cancelled','no_show') DEFAULT 'scheduled',
  `priority_score` decimal(5,2) DEFAULT NULL,
  `est_wait_mins` smallint(6) DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `appointments`:
--   `patient_id`
--       `patients` -> `id`
--   `doctor_id`
--       `staff` -> `id`
--   `triage_id`
--       `triage_records` -> `id`
--   `room_id`
--       `rooms` -> `id`
--

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `triage_id`, `room_id`, `scheduled_at`, `duration_mins`, `status`, `priority_score`, `est_wait_mins`, `cancellation_reason`, `notes`, `created_at`, `updated_at`) VALUES
('92c8bc92-b94e-49c9-82ff-23035cb26f84', '7df841eb-089f-4cda-ba13-1017787f2643', 'b7d127f6-4e76-4a59-8fcc-615099b0b59d', NULL, NULL, '2026-03-17 09:30:00', 15, 'scheduled', NULL, NULL, NULL, 'Patient-initiated portal booking', '2026-03-17 05:09:29', '2026-03-17 05:09:29');

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `audit_log`;
CREATE TABLE `audit_log` (
  `id` bigint(20) NOT NULL,
  `event_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` char(36) DEFAULT NULL,
  `user_role` varchar(20) DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `resource_type` varchar(50) DEFAULT NULL,
  `resource_id` char(36) DEFAULT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `is_anomalous` tinyint(1) DEFAULT 0,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `audit_log`:
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_sessions`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `chat_sessions`;
CREATE TABLE `chat_sessions` (
  `id` char(36) NOT NULL,
  `session_id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `messages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`messages`)),
  `intent_log` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`intent_log`)),
  `language` varchar(10) DEFAULT 'en',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `chat_sessions`:
--   `patient_id`
--       `patients` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `clinical_notes`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `clinical_notes`;
CREATE TABLE `clinical_notes` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `doctor_id` char(36) DEFAULT NULL,
  `appointment_id` char(36) DEFAULT NULL,
  `note_type` enum('SOAP','progress','discharge','referral') DEFAULT 'SOAP',
  `subjective` text DEFAULT NULL,
  `objective` text DEFAULT NULL,
  `assessment` text DEFAULT NULL,
  `plan` text DEFAULT NULL,
  `is_signed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `clinical_notes`:
--   `patient_id`
--       `patients` -> `id`
--   `doctor_id`
--       `staff` -> `id`
--   `appointment_id`
--       `appointments` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `diagnoses`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `diagnoses`;
CREATE TABLE `diagnoses` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `doctor_id` char(36) DEFAULT NULL,
  `icd10_code` varchar(10) DEFAULT NULL,
  `icd10_description` varchar(255) DEFAULT NULL,
  `status` enum('active','resolved','chronic','ruled_out') DEFAULT 'active',
  `onset_date` date DEFAULT NULL,
  `resolved_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `diagnoses`:
--   `patient_id`
--       `patients` -> `id`
--   `doctor_id`
--       `staff` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `doctor_leaves`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `doctor_leaves`;
CREATE TABLE `doctor_leaves` (
  `id` char(36) NOT NULL,
  `doctor_id` char(36) DEFAULT NULL,
  `leave_start` datetime NOT NULL,
  `leave_end` datetime NOT NULL,
  `reason` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `doctor_leaves`:
--   `doctor_id`
--       `staff` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `doctor_schedules`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `doctor_schedules`;
CREATE TABLE `doctor_schedules` (
  `id` char(36) NOT NULL,
  `doctor_id` char(36) DEFAULT NULL,
  `day_of_week` tinyint(4) DEFAULT NULL CHECK (`day_of_week` >= 0 and `day_of_week` <= 6),
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `doctor_schedules`:
--   `doctor_id`
--       `staff` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `imaging_reports`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `imaging_reports`;
CREATE TABLE `imaging_reports` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `modality` varchar(50) DEFAULT NULL,
  `body_part` varchar(100) DEFAULT NULL,
  `radiologist_notes` text DEFAULT NULL,
  `ai_annotation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ai_annotation`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `imaging_reports`:
--   `patient_id`
--       `patients` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `lab_documents`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `lab_documents`;
CREATE TABLE `lab_documents` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `file_url` text DEFAULT NULL,
  `ocr_text` text DEFAULT NULL,
  `extracted_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`extracted_values`)),
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `lab_documents`:
--   `patient_id`
--       `patients` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `lab_orders`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `lab_orders`;
CREATE TABLE `lab_orders` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `doctor_id` char(36) DEFAULT NULL,
  `test_name` varchar(200) NOT NULL,
  `loinc_code` varchar(20) DEFAULT NULL,
  `status` enum('ordered','collected','processing','resulted','cancelled') DEFAULT 'ordered',
  `priority` enum('routine','urgent','stat') DEFAULT 'routine',
  `ordered_at` datetime DEFAULT current_timestamp(),
  `resulted_at` datetime DEFAULT NULL,
  `result_value` decimal(10,4) DEFAULT NULL,
  `result_unit` varchar(30) DEFAULT NULL,
  `result_text` text DEFAULT NULL,
  `reference_range` varchar(50) DEFAULT NULL,
  `is_abnormal` tinyint(1) DEFAULT 0,
  `result_narrative` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `lab_orders`:
--   `patient_id`
--       `patients` -> `id`
--   `doctor_id`
--       `staff` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `medication_doses`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `medication_doses`;
CREATE TABLE `medication_doses` (
  `id` bigint(20) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `drug_code` varchar(50) DEFAULT NULL,
  `scheduled_time` datetime DEFAULT NULL,
  `dose_taken` tinyint(1) DEFAULT 0,
  `taken_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `medication_doses`:
--   `patient_id`
--       `patients` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `channel` enum('push','sms','email','in_app') NOT NULL,
  `event_type` varchar(50) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `status` enum('queued','sent','delivered','failed') DEFAULT 'queued',
  `external_id` varchar(100) DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `read_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `notifications`:
--   `patient_id`
--       `patients` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `patients`;
CREATE TABLE `patients` (
  `id` char(36) NOT NULL,
  `mrn` varchar(20) NOT NULL,
  `first_name_enc` blob NOT NULL,
  `last_name_enc` blob NOT NULL,
  `dob_enc` blob NOT NULL,
  `gender` enum('male','female','other','unknown') DEFAULT 'unknown',
  `language_pref` varchar(10) DEFAULT 'en',
  `phone_enc` blob DEFAULT NULL,
  `email_enc` blob DEFAULT NULL,
  `address_enc` blob DEFAULT NULL,
  `blood_group` varchar(5) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `patients`:
--

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `mrn`, `first_name_enc`, `last_name_enc`, `dob_enc`, `gender`, `language_pref`, `phone_enc`, `email_enc`, `address_enc`, `blood_group`, `created_at`, `updated_at`) VALUES
('6bd88640-5154-457a-bd00-6380361cb635', 'MRN-001', 0x50617469656e74, 0x54657374, 0x313939302d30312d3031, 'male', 'en', NULL, NULL, NULL, 'O+', '2026-03-16 01:41:02', '2026-03-16 01:41:02'),
('7df841eb-089f-4cda-ba13-1017787f2643', 'MRN-396D5271', 0x4573776172, 0x4368, 0x323030302d30312d3031, 'unknown', 'en', NULL, NULL, NULL, NULL, '2026-03-16 03:15:50', '2026-03-16 03:15:50');

-- --------------------------------------------------------

--
-- Table structure for table `patient_vitals`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `patient_vitals`;
CREATE TABLE `patient_vitals` (
  `id` bigint(20) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `device_id` varchar(100) DEFAULT NULL,
  `source` varchar(20) DEFAULT NULL,
  `hr` decimal(5,2) DEFAULT NULL,
  `bp_sys` decimal(5,2) DEFAULT NULL,
  `bp_dia` decimal(5,2) DEFAULT NULL,
  `spo2` decimal(5,2) DEFAULT NULL,
  `temp_c` decimal(5,2) DEFAULT NULL,
  `rr` decimal(5,2) DEFAULT NULL,
  `glucose` decimal(5,2) DEFAULT NULL,
  `measured_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `patient_vitals`:
--   `patient_id`
--       `patients` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `prescriptions`;
CREATE TABLE `prescriptions` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `doctor_id` char(36) DEFAULT NULL,
  `drug_name` varchar(200) NOT NULL,
  `drug_code` varchar(50) DEFAULT NULL,
  `dosage` varchar(100) DEFAULT NULL,
  `frequency` varchar(100) DEFAULT NULL,
  `route` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','completed','discontinued','on_hold') DEFAULT 'active',
  `adherence_score` decimal(5,2) DEFAULT 100.00,
  `refill_due_date` date DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `prescriptions`:
--   `patient_id`
--       `patients` -> `id`
--   `doctor_id`
--       `staff` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `risk_scores`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `risk_scores`;
CREATE TABLE `risk_scores` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `scored_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deterioration_pct` decimal(5,2) DEFAULT NULL,
  `readmission_pct` decimal(5,2) DEFAULT NULL,
  `emergency_pct` decimal(5,2) DEFAULT NULL,
  `risk_tier` enum('Low','Medium','High','Critical') DEFAULT NULL,
  `top_risk_factors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`top_risk_factors`)),
  `recommended_intervention` text DEFAULT NULL,
  `model_version` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `risk_scores`:
--   `patient_id`
--       `patients` -> `id`
--

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` enum('consultation','procedure','emergency','waiting') NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `equipment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`equipment`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `rooms`:
--

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--
-- Creation: Mar 16, 2026 at 07:08 AM
--

DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `id` char(36) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `role` enum('patient','doctor','nurse','admin','radiologist','dentist') NOT NULL,
  `speciality` varchar(100) DEFAULT NULL,
  `license_number` varchar(50) DEFAULT NULL,
  `is_on_duty` tinyint(1) DEFAULT 0,
  `fcm_token` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `staff`:
--

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`id`, `first_name`, `last_name`, `role`, `speciality`, `license_number`, `is_on_duty`, `fcm_token`, `phone`, `created_at`) VALUES
('7a8b2f3a-836c-4205-b2aa-bfd25633fe72', 'System', 'Admin', 'admin', 'Systems', 'LIC-ADM-001', 1, NULL, '555-0103', '2026-03-16 01:41:02'),
('841ecd67-4ba0-4f84-9b40-1160a5cd7088', 'Jane', 'Smooth', 'dentist', 'Orthodontics', 'LIC-DEN-001', 1, NULL, '555-0102', '2026-03-16 01:41:02'),
('8b9bea9a-5651-4f29-9130-6e604ca0d1ca', 'John', 'Doe', 'doctor', 'General Medicine', 'LIC-DOC-001', 1, NULL, '555-0101', '2026-03-16 01:41:02'),
('b7d127f6-4e76-4a59-8fcc-615099b0b59d', 'Eswar', 'Chinthakayala', 'doctor', NULL, NULL, 1, NULL, NULL, '2026-03-16 21:26:57');

-- --------------------------------------------------------

--
-- Table structure for table `triage_records`
--
-- Creation: Mar 17, 2026 at 09:38 AM
-- Last update: Mar 17, 2026 at 10:24 AM
--

DROP TABLE IF EXISTS `triage_records`;
CREATE TABLE `triage_records` (
  `id` varchar(36) NOT NULL,
  `patient_id` varchar(36) DEFAULT NULL,
  `session_id` varchar(36) NOT NULL,
  `symptom_text` text DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `severity_score` int(11) DEFAULT NULL,
  `urgency_tier` enum('Emergency','Urgent','Routine','Self-care') NOT NULL,
  `reasoning` text DEFAULT NULL,
  `recommended_action` text DEFAULT NULL,
  `icd10_hints` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`icd10_hints`)),
  `drug_alerts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`drug_alerts`)),
  `assigned_doctor` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `triage_records`:
--   `patient_id`
--       `patients` -> `id`
--

--
-- Dumping data for table `triage_records`
--

INSERT INTO `triage_records` (`id`, `patient_id`, `session_id`, `symptom_text`, `duration`, `severity_score`, `urgency_tier`, `reasoning`, `recommended_action`, `icd10_hints`, `drug_alerts`, `assigned_doctor`, `created_at`) VALUES
('42a4f57e-2274-45dc-9733-690d58f1bd7c', '7df841eb-089f-4cda-ba13-1017787f2643', '94957f39-19a6-4d78-a58b-9d5f0b120d63', 'dull ache in my left knee for 3 days', '3', 5, 'Emergency', 'Symptoms: dull ache in my left knee for 3 days\nSeverity: 5/10, Age: 30, Conditions: []\n\nThis patient presents with a dull ache in their left knee for 3 days. The severity is rated as 5/10, indicating ', 'Seek medical evaluation.', '[]', '[]', NULL, '2026-03-17 09:41:25'),
('67fd052c-d73b-4d14-b937-01807ee6065a', '7df841eb-089f-4cda-ba13-1017787f2643', '1d590cc7-68c7-4673-b8b4-d239ad8bc079', 'dull knee ache in my left leg for 3 days', '3', 5, 'Routine', 'Symptoms: dull knee ache in my left leg for 3 days\nSeverity: 5/10, Age: 30, Conditions: []\n\nThis patient has a history of knee pain in the left leg for three days. The severity is rated as 5/10, indic', 'Seek medical evaluation.', '[]', '[]', NULL, '2026-03-17 10:24:00'),
('703fff9b-6d5e-4e47-ad1a-208ab4c94250', '7df841eb-089f-4cda-ba13-1017787f2643', '1344f76e-e45c-4402-afe2-61f39352a518', 'Checking database save with aligned schema', '3', 5, 'Routine', 'Symptoms: Checking database save with aligned schema\nSeverity: 5/10, Age: 30, Conditions: []\n\nSymptoms: Checking database save with aligned schema\nSeverity: 5/10, Age: 30, Conditions: []\n\nSymptoms: Ch', 'Seek medical evaluation.', '[]', '[]', NULL, '2026-03-17 09:40:08'),
('89897440-b302-44a0-84ed-e3a99ed72740', '7df841eb-089f-4cda-ba13-1017787f2643', '15bf7821-6e9d-46bf-b5d5-09f0327e3d6b', 'dull ache in my left knee for 3 days', '3', 5, 'Emergency', 'Symptoms: dull ache in my left knee for 3 days\nSeverity: 5/10, Age: 30, Conditions: []\n\nThis patient presents with a dull ache in their left knee for 3 days. The severity is rated as 5/10, indicating ', 'Seek medical evaluation.', '[]', '[]', NULL, '2026-03-17 10:03:11'),
('dabd94ee-a72f-476c-8bca-48b93c4507b2', '7df841eb-089f-4cda-ba13-1017787f2643', '3d8dd1ba-10aa-42d7-ab98-492a517bff69', 'testing event bus stability', '2', 4, 'Routine', 'Symptoms:\n- Severe headache\n- Difficulty concentrating\n- Nausea or vomiting\n- Fatigue\n- Dizziness\n- Blurred vision\n- Sweating\n- Increased heart rate\n\nSeverity:\n- Severe: indicates a serious or life-th', 'Seek medical evaluation.', '[]', '[]', NULL, '2026-03-17 09:52:35');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--
-- Creation: Mar 16, 2026 at 07:08 AM
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `staff_id` char(36) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `keycloak_id` varchar(64) DEFAULT NULL,
  `role` enum('patient','doctor','nurse','admin','radiologist','dentist') NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `users`:
--   `patient_id`
--       `patients` -> `id`
--   `staff_id`
--       `staff` -> `id`
--

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `patient_id`, `staff_id`, `email`, `password_hash`, `keycloak_id`, `role`, `is_active`, `last_login`, `created_at`) VALUES
('178e70b6-0e3d-42e4-8d25-19c0110c837d', NULL, '841ecd67-4ba0-4f84-9b40-1160a5cd7088', 'dentist@clinic.ai', '$2b$12$Ja6BA98kLrS.pF.kRKXwT.Lf68AKJF5il0GDQvB.tr2QBs4monbEi', NULL, 'dentist', 1, NULL, '2026-03-16 01:41:02'),
('36b712c7-1913-4e9f-ba61-3001336c060a', NULL, '7a8b2f3a-836c-4205-b2aa-bfd25633fe72', 'admin@clinic.ai', '$2b$12$eews2C6SyHF7mFlEPHUXmeyUe4t/oGL8u8FH907b5MXaGHrK52HIy', NULL, 'admin', 1, NULL, '2026-03-16 01:33:40'),
('638146c2-b7d5-4057-8fbd-bd951f1bef75', '6bd88640-5154-457a-bd00-6380361cb635', NULL, 'patient@clinic.ai', '$2b$12$UMn.otuqu7B7RQywVTtmnOs/Awk01brVgiSvfXryrEYPvQY8PoRp.', NULL, 'patient', 1, NULL, '2026-03-16 01:33:40'),
('6c8a861c-2a7c-44be-9e75-4ded3704f93a', NULL, 'b7d127f6-4e76-4a59-8fcc-615099b0b59d', 'eswarchinthakayala2005@gmail.com', '$2b$12$yDEfYa7.Tntt7S0XPUSTeOzEJ/d.g9Iti0tp3K1adS5egukeo6NJO', NULL, 'doctor', 1, NULL, '2026-03-16 21:26:57'),
('77241567-9d72-4363-8fc3-3fb9ff5fe3b8', NULL, '8b9bea9a-5651-4f29-9130-6e604ca0d1ca', 'doctor@clinic.ai', '$2b$12$XWJ.ABY4eghMJvC.TGBhlukq7v7obFTtGuUFPy.3UazXRr/KM5Kg2', NULL, 'doctor', 1, NULL, '2026-03-16 01:33:40'),
('7862a0bb-b2f1-4c20-b870-3c543aaa8f4e', '7df841eb-089f-4cda-ba13-1017787f2643', NULL, 'eswarchinthakayala2004@gmail.com', '$2b$12$EmhAuWbsIBGofP9h7Lc7iueljh.ZzmjZyT9wws5Fh5byA5k.GATES', NULL, 'patient', 1, NULL, '2026-03-16 03:15:50');

-- --------------------------------------------------------

--
-- Table structure for table `vital_alerts`
--
-- Creation: Mar 14, 2026 at 04:24 AM
--

DROP TABLE IF EXISTS `vital_alerts`;
CREATE TABLE `vital_alerts` (
  `id` char(36) NOT NULL,
  `patient_id` char(36) DEFAULT NULL,
  `alert_type` enum('vital_critical','triage_emergency','risk_critical','chat_emergency','medication_missed') NOT NULL,
  `severity` enum('URGENT','CRITICAL') NOT NULL,
  `message_doctor` varchar(280) DEFAULT NULL,
  `message_patient` text DEFAULT NULL,
  `vital_name` varchar(50) DEFAULT NULL,
  `vital_value` decimal(10,4) DEFAULT NULL,
  `assigned_doctor_id` char(36) DEFAULT NULL,
  `acknowledged_at` datetime DEFAULT NULL,
  `escalated_at` datetime DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- RELATIONSHIPS FOR TABLE `vital_alerts`:
--   `patient_id`
--       `patients` -> `id`
--   `assigned_doctor_id`
--       `staff` -> `id`
--

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agent_events`
--
ALTER TABLE `agent_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `agent_latency`
--
ALTER TABLE `agent_latency`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `alert_timeline`
--
ALTER TABLE `alert_timeline`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `triage_id` (`triage_id`),
  ADD KEY `room_id` (`room_id`);

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_audit_patient` (`patient_id`);

--
-- Indexes for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `session_id` (`session_id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `clinical_notes`
--
ALTER TABLE `clinical_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `appointment_id` (`appointment_id`);

--
-- Indexes for table `diagnoses`
--
ALTER TABLE `diagnoses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `doctor_leaves`
--
ALTER TABLE `doctor_leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `imaging_reports`
--
ALTER TABLE `imaging_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `lab_documents`
--
ALTER TABLE `lab_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `lab_orders`
--
ALTER TABLE `lab_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `medication_doses`
--
ALTER TABLE `medication_doses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mrn` (`mrn`),
  ADD KEY `idx_patients_mrn` (`mrn`);

--
-- Indexes for table `patient_vitals`
--
ALTER TABLE `patient_vitals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`,`measured_at`),
  ADD KEY `idx_vitals_patient_time` (`patient_id`,`measured_at`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `risk_scores`
--
ALTER TABLE `risk_scores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `triage_records`
--
ALTER TABLE `triage_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `keycloak_id` (`keycloak_id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `vital_alerts`
--
ALTER TABLE `vital_alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `assigned_doctor_id` (`assigned_doctor_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agent_events`
--
ALTER TABLE `agent_events`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `agent_latency`
--
ALTER TABLE `agent_latency`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `alert_timeline`
--
ALTER TABLE `alert_timeline`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medication_doses`
--
ALTER TABLE `medication_doses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patient_vitals`
--
ALTER TABLE `patient_vitals`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alert_timeline`
--
ALTER TABLE `alert_timeline`
  ADD CONSTRAINT `alert_timeline_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`triage_id`) REFERENCES `triage_records` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `appointments_ibfk_4` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD CONSTRAINT `chat_sessions_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `clinical_notes`
--
ALTER TABLE `clinical_notes`
  ADD CONSTRAINT `clinical_notes_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `clinical_notes_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `clinical_notes_ibfk_3` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`);

--
-- Constraints for table `diagnoses`
--
ALTER TABLE `diagnoses`
  ADD CONSTRAINT `diagnoses_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `diagnoses_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `staff` (`id`);

--
-- Constraints for table `doctor_leaves`
--
ALTER TABLE `doctor_leaves`
  ADD CONSTRAINT `doctor_leaves_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD CONSTRAINT `doctor_schedules_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `imaging_reports`
--
ALTER TABLE `imaging_reports`
  ADD CONSTRAINT `imaging_reports_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lab_documents`
--
ALTER TABLE `lab_documents`
  ADD CONSTRAINT `lab_documents_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `lab_orders`
--
ALTER TABLE `lab_orders`
  ADD CONSTRAINT `lab_orders_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `lab_orders_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `staff` (`id`);

--
-- Constraints for table `medication_doses`
--
ALTER TABLE `medication_doses`
  ADD CONSTRAINT `medication_doses_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `patient_vitals`
--
ALTER TABLE `patient_vitals`
  ADD CONSTRAINT `patient_vitals_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prescriptions_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `staff` (`id`);

--
-- Constraints for table `risk_scores`
--
ALTER TABLE `risk_scores`
  ADD CONSTRAINT `risk_scores_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `triage_records`
--
ALTER TABLE `triage_records`
  ADD CONSTRAINT `triage_records_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `vital_alerts`
--
ALTER TABLE `vital_alerts`
  ADD CONSTRAINT `vital_alerts_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `vital_alerts_ibfk_2` FOREIGN KEY (`assigned_doctor_id`) REFERENCES `staff` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
