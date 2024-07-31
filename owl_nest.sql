-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Czas generowania: 31 Lip 2024, 14:28
-- Wersja serwera: 8.0.37-0ubuntu0.22.04.3
-- Wersja PHP: 8.1.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `owl_nest`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `client`
--

CREATE TABLE `client` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `company_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `client`
--

INSERT INTO `client` (`id`, `name`, `company_id`, `email`, `address`, `description`) VALUES
('a703b668-ab2d-47eb-875d-15d90c3655d8', 'test client', NULL, '', '', '');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `company`
--

CREATE TABLE `company` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `company`
--

INSERT INTO `company` (`id`, `name`, `email`, `address`) VALUES
('8e07ceb8-44f3-4c11-8213-569d06fad4c6', 'Admin company', '', ''),
('e719aa5f-af2c-44a8-817d-47fa1bc820eb', 'string', '', '');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `rbac_assigment`
--

CREATE TABLE `rbac_assigment` (
  `item_name` varchar(355) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `rbac_assigment`
--

INSERT INTO `rbac_assigment` (`item_name`, `user_id`, `created_at`) VALUES
('ROLE_ADMIN_COMPANY', '436befa7-d08c-4b94-906e-03381c0fca18', '2024-07-23 01:14:47');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `rbac_item`
--

CREATE TABLE `rbac_item` (
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('role','permission') COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `rule_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `rbac_item`
--

INSERT INTO `rbac_item` (`name`, `type`, `description`, `rule_name`, `created_at`, `updated_at`) VALUES
('ROLE_ADMIN_COMPANY', 'role', 'Admin company', NULL, '2024-01-19 22:39:26', '2024-01-19 22:39:26'),
('ROLE_ADMIN_SYSTEM', 'role', 'Admin system', NULL, '2024-01-19 22:39:26', '2024-01-19 22:39:26'),
('ROLE_USER', 'role', 'User', NULL, '2024-01-19 22:39:26', '2024-01-19 22:39:26'),
('string', 'role', 'string', 'string', '2024-07-21 22:06:59', '2024-07-21 22:06:59');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `rbac_item_child`
--

CREATE TABLE `rbac_item_child` (
  `parent` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `child` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tenant`
--

CREATE TABLE `tenant` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `tenant`
--

INSERT INTO `tenant` (`id`, `name`, `created_at`, `updated_at`) VALUES
('7197772a-8a89-44dc-8585-f557cc1dac9c', 'register@wp.pl', '2024-07-23 01:20:04.468420', '2024-07-23 01:20:04.468420'),
('a03bab1e-dc65-4985-bf8a-66831fad4846', 'register@wp.pl', '2024-07-23 00:10:00.283762', '2024-07-23 00:10:00.283762');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user`
--

CREATE TABLE `user` (
  `id` varchar(36) COLLATE utf8mb4_general_ci NOT NULL,
  `tenant_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_active` tinyint NOT NULL DEFAULT '0',
  `hash_refresh_token` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `user`
--

INSERT INTO `user` (`id`, `tenant_id`, `company_id`, `email`, `username`, `first_name`, `last_name`, `phone_number`, `password_hash`, `is_active`, `hash_refresh_token`, `last_login`, `created_at`, `updated_at`) VALUES
('3f6152eb-fe6f-4c5d-8910-437fb6971ee6', 'a03bab1e-dc65-4985-bf8a-66831fad4846', NULL, 'test@fajny.pl', NULL, 'string', 'string', 'string', '$2b$12$1gdDB0ydkIly.oKyGEO1RujfvcUR4zZ0ni/B1HDtOpo6Bny7MIPaK', 0, NULL, NULL, '2024-07-23 03:33:14.554600', '2024-07-23 03:33:14.554600'),
('436befa7-d08c-4b94-906e-03381c0fca18', 'a03bab1e-dc65-4985-bf8a-66831fad4846', NULL, 'role_admin@wp.pl', NULL, NULL, NULL, '515-953-612', '$2b$12$QfeL1n5bOKuVIPYWvvvs9Oa.BiCkEgmLA6NDyitfs5dR.vzhk9XQ.', 0, '$2b$10$61qTtZSVpQFNU6aauZfC2u7tII.tP.xw1LenKKs31M73E40DAhJq.', '2024-07-30 15:50:37', '2024-07-23 00:10:00.280211', '2024-07-30 15:50:37.000000'),
('710020ca-b92d-4115-8652-44bd698ad360', 'a03bab1e-dc65-4985-bf8a-66831fad4846', NULL, 'test@fajny.pl', NULL, 'string', 'string', 'string', '$2b$12$qn.hgFMiTVYZjRQsJ4ERduF69R1J.F5OTyzIIpqOWbvgGEMZcHKLa', 0, NULL, NULL, '2024-07-23 03:36:02.204200', '2024-07-23 03:36:02.204200'),
('d2f4b0dc-589a-40a1-a7e0-b1b7dfdcd99b', 'a03bab1e-dc65-4985-bf8a-66831fad4846', NULL, 'test@fajny.pl', NULL, 'string', 'string', 'string', '$2b$12$USaluC6RtJUmZH55QKAb9eVjo2EJ.JuyzXJ.fQf4IK9NMO9uuVxGW', 0, NULL, NULL, '2024-07-23 03:34:48.135396', '2024-07-23 03:34:48.135396');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_75fffe092dc8bb594720f9b7598` (`company_id`);

--
-- Indeksy dla tabeli `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `rbac_assigment`
--
ALTER TABLE `rbac_assigment`
  ADD PRIMARY KEY (`item_name`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeksy dla tabeli `rbac_item`
--
ALTER TABLE `rbac_item`
  ADD PRIMARY KEY (`name`),
  ADD KEY `type` (`type`);

--
-- Indeksy dla tabeli `rbac_item_child`
--
ALTER TABLE `rbac_item_child`
  ADD PRIMARY KEY (`parent`,`child`),
  ADD KEY `child` (`child`);

--
-- Indeksy dla tabeli `tenant`
--
ALTER TABLE `tenant`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_9e70b5f9d7095018e86970c7874` (`company_id`),
  ADD KEY `FK_ae07d48a61ca20ab3586d397a71` (`tenant_id`);

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `FK_75fffe092dc8bb594720f9b7598` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`);

--
-- Ograniczenia dla tabeli `rbac_assigment`
--
ALTER TABLE `rbac_assigment`
  ADD CONSTRAINT `rbac_assigment_ibfk_1` FOREIGN KEY (`item_name`) REFERENCES `rbac_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rbac_assigment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_9e70b5f9d7095018e86970c7874` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
  ADD CONSTRAINT `FK_ae07d48a61ca20ab3586d397a71` FOREIGN KEY (`tenant_id`) REFERENCES `tenant` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
