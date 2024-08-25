-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Czas generowania: 25 Sie 2024, 21:51
-- Wersja serwera: 8.0.39-0ubuntu0.22.04.1
-- Wersja PHP: 8.1.29

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
-- Struktura tabeli dla tabeli `rbac_item`
--

CREATE TABLE `rbac_item` (
  `type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rule_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `refer` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `collection` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `rbac_item`
--

INSERT INTO `rbac_item` (`type`, `name`, `description`, `rule_name`, `created_at`, `updated_at`, `refer`, `collection`) VALUES
('role', 'ROLE_ADMIN_COMPANY', '', '', '2024-01-19 22:39:26.000000', '2024-08-23 06:53:53.871926', NULL, NULL),
('role', 'ROLE_ADMIN_SYSTEM', 'Grant all access', '', '2024-01-19 22:39:26.000000', '2024-08-23 06:53:56.886699', NULL, NULL),
('role', 'ROLE_USER', '', '', '2024-01-19 22:39:26.000000', '2024-08-23 06:53:58.989683', NULL, NULL),
('permission', 'ROUTE_CLIENT_CREATE', 'Create client', NULL, '2024-08-23 21:47:58.000000', '2024-08-24 20:58:47.192714', 'Route', 'Client'),
('permission', 'ROUTE_CLIENT_DELETE', 'Client delete', NULL, '2024-08-24 21:11:06.000000', '2024-08-24 21:11:06.000000', 'Route', 'Client'),
('permission', 'ROUTE_CLIENT_LIST', 'List client', NULL, '2024-08-24 21:11:44.000000', '2024-08-24 21:11:44.000000', 'Route', 'Client'),
('permission', 'ROUTE_CLIENT_READ', 'Client read', NULL, '2024-08-25 21:41:04.000000', '2024-08-25 21:41:04.000000', 'Route', 'Client'),
('permission', 'ROUTE_CLIENT_UPDATE', 'Client update', NULL, '2024-08-24 21:10:38.000000', '2024-08-24 21:10:38.000000', 'Route', 'Client'),
('permission', 'ROUTE_PERMISSION_CREATE', 'Permission create', NULL, '2024-08-24 21:14:37.000000', '2024-08-24 21:14:37.000000', 'Route', 'Permission'),
('permission', 'ROUTE_PERMISSION_DELETE', 'Delete permission', NULL, '2024-08-24 21:15:04.000000', '2024-08-24 21:15:04.000000', 'Route', 'Permission'),
('permission', 'ROUTE_PERMISSION_LIST', 'Permission list', NULL, '2024-08-24 21:15:19.000000', '2024-08-24 21:15:19.000000', 'Route', 'Permission'),
('permission', 'ROUTE_PERMISSION_READ', 'Permission read', NULL, '2024-08-25 21:41:40.000000', '2024-08-25 21:41:40.000000', 'Route', 'Permission'),
('permission', 'ROUTE_PERMISSION_UPDATE', 'Permission update', NULL, '2024-08-24 21:14:51.000000', '2024-08-24 21:14:51.000000', 'Route', 'Permission'),
('permission', 'ROUTE_ROLE_ASSIGN', 'Assign permissions or roles', NULL, '2024-08-25 21:37:49.000000', '2024-08-25 21:37:49.000000', 'Route', 'Role'),
('permission', 'ROUTE_ROLE_ASSIGNED_PERMISSIONS', 'Assigned permissions', NULL, '2024-08-25 21:36:04.000000', '2024-08-25 21:36:04.000000', 'Route', 'Role'),
('permission', 'ROUTE_ROLE_CREATE', 'Role create', NULL, '2024-08-24 21:13:40.000000', '2024-08-24 21:13:40.000000', 'Route', 'Role'),
('permission', 'ROUTE_ROLE_DELETE', 'Role delete', NULL, '2024-08-24 21:14:12.000000', '2024-08-24 21:14:12.000000', 'Route', 'Role'),
('permission', 'ROUTE_ROLE_LIST', 'List role', NULL, '2024-08-24 21:14:26.000000', '2024-08-24 21:14:26.000000', 'Route', 'Role'),
('permission', 'ROUTE_ROLE_READ', 'Role read', NULL, '2024-08-25 21:41:28.000000', '2024-08-25 21:41:28.000000', 'Route', 'Role'),
('permission', 'ROUTE_ROLE_REVOKE', 'Revoke permissions or roles', NULL, '2024-08-25 21:39:58.000000', '2024-08-25 21:39:58.000000', 'Route', 'Role'),
('permission', 'ROUTE_ROLE_UPDATE', 'Role update', NULL, '2024-08-24 21:14:00.000000', '2024-08-24 21:14:00.000000', 'Route', 'Role'),
('permission', 'ROUTE_USER_ASSIGN_ACCESS', 'Assign access', NULL, '2024-08-25 21:36:31.000000', '2024-08-25 21:36:31.000000', 'Route', 'User'),
('permission', 'ROUTE_USER_CREATE', 'User create', NULL, '2024-08-24 21:12:06.000000', '2024-08-24 21:12:06.000000', 'Route', 'User'),
('permission', 'ROUTE_USER_DELETE', 'User delete', NULL, '2024-08-24 21:12:36.000000', '2024-08-24 21:12:36.000000', 'Route', 'User'),
('permission', 'ROUTE_USER_LIST', 'List user', NULL, '2024-08-24 21:13:09.000000', '2024-08-24 21:13:09.000000', 'Route', 'User'),
('permission', 'ROUTE_USER_LOGOUT', 'Logout user', NULL, '2024-08-25 21:18:27.000000', '2024-08-25 21:18:27.000000', 'Route', 'User'),
('permission', 'ROUTE_USER_ME', 'Me', NULL, '2024-08-24 21:12:24.000000', '2024-08-25 15:26:51.000000', 'Route', 'User'),
('permission', 'ROUTE_USER_READ', 'User read', NULL, '2024-08-25 21:41:15.000000', '2024-08-25 21:41:15.000000', 'Route', 'User'),
('permission', 'ROUTE_USER_UPDATE', 'User update', NULL, '2024-08-24 21:12:24.000000', '2024-08-24 21:12:24.000000', 'Route', 'User');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `rbac_item`
--
ALTER TABLE `rbac_item`
  ADD PRIMARY KEY (`name`),
  ADD KEY `IDX_525f941e3ce38e189ef8f0c8d7` (`type`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
