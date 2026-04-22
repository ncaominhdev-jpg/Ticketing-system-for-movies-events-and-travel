-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 03, 2025 at 06:49 AM
-- Server version: 8.0.36
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `event_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `artist_images`
--

CREATE TABLE `artist_images` (
  `id` int NOT NULL,
  `artist_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `concert_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `artist_images`
--

INSERT INTO `artist_images` (`id`, `artist_name`, `image_url`, `createdAt`, `updatedAt`, `concert_id`) VALUES
(1, 'Đen Vâu', 'denvau_artist.jpg', '2025-02-19 20:21:26', '2025-02-21 20:29:23', 3),
(2, 'Sơn Tùng M-TP', 'sontung_artist.jpg', '2025-02-19 20:21:26', '2025-02-21 20:29:29', 4),
(3, 'Hoàng Thùy Linh', 'hoangthuylinh.jpg', '2025-02-21 20:39:29', '2025-02-21 20:39:29', 3),
(4, 'MIN', 'min.jpg', '2025-02-21 20:39:29', '2025-02-21 20:39:29', 3),
(5, 'Erik', 'erik.jpg', '2025-02-21 20:39:29', '2025-02-21 20:39:29', 3),
(6, 'Noo Phước Thịnh', 'noo.jpg', '2025-02-21 20:39:29', '2025-02-21 20:39:29', 4),
(7, 'Bích Phương', 'bichphuong.jpg', '2025-02-21 20:39:29', '2025-02-21 20:39:29', 4),
(9, 'Hòa Minzy', 'hoaminzy.jpg', '2025-02-21 20:39:29', '2025-02-21 20:39:29', 4),
(10, 'Isaac', 'isaac.png', '2025-02-21 20:39:29', '2025-02-21 21:02:45', 4),
(11, 'Isaac', 'isaac.png', '2025-02-21 20:45:23', '2025-02-21 20:55:12', 3),
(12, 'Tóc Tiên', 'toctien.jpg', '2025-02-21 20:45:23', '2025-02-21 20:45:23', 3),
(13, 'Karik', 'karik.jpg', '2025-02-21 20:45:23', '2025-02-21 20:45:23', 3),
(15, 'Soobin Hoàng Sơn', 'soobin.jpg', '2025-02-21 20:45:23', '2025-02-21 20:45:23', 4),
(16, 'Ngô Kiến Huy', 'ngokienhuy.jpg', '2025-02-21 20:45:23', '2025-02-21 20:45:23', 4),
(17, 'Đông Nhi', 'dongnhi.jpg', '2025-02-21 20:45:23', '2025-02-21 20:45:23', 4),
(18, '12341231', '1740333098174-CGV Cinemas.png', '2025-02-23 17:51:38', '2025-02-23 19:10:15', 6),
(19, '1234123', '1740336648583-allkpop_1706195914_20240125-babymonster.jpg', '2025-02-23 17:59:55', '2025-02-23 18:50:48', 6),
(20, '123', '1740421847335-1740333581559-isaac.png', '2025-02-24 18:30:47', '2025-02-24 18:30:47', 3);

-- --------------------------------------------------------

--
-- Table structure for table `concerts`
--

CREATE TABLE `concerts` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `event_date` date NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `start_time` time NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `vip_price` decimal(10,0) NOT NULL,
  `normal_price` decimal(10,0) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `concerts`
--

INSERT INTO `concerts` (`id`, `name`, `event_date`, `location`, `start_time`, `image_url`, `description`, `vip_price`, `normal_price`, `createdAt`, `updatedAt`) VALUES
(3, 'Đen Vâu Live Concert', '2025-03-05', 'Hà Nội', '20:00:00', 'denvau.jpg', 'Đêm nhạc đặc biệt của Đen Vâu123', 500000, 300000, '2025-02-19 20:21:26', '2025-03-03 06:26:08'),
(4, 'Sơn Tùng M-TP Sky Tour', '2025-12-31', 'TP. Hồ Chí Minh', '19:30:00', 'sontung.jpg', 'Chuyến lưu diễn lớn nhất của Sơn Tùng M-TP', 800000, 500000, '2025-02-19 20:21:26', '2025-02-23 13:39:10'),
(5, 'BABYMONSTER First Fan Concert in Vietnam', '2025-07-15', 'TP. Hồ Chí Minh (địa điểm cụ thể chưa công bố)', '19:00:00', '1740320415408-allkpop_1706195914_20240125-babymonster.jpg', 'BABYMONSTER - Nhóm nhạc nữ nhà YG lần đầu tổ chức concert tại Việt Nam, hứa hẹn mang đến những màn trình diễn bùng nổ.', 3500000, 1500000, '2025-02-23 14:20:15', '2025-02-24 18:16:48'),
(6, 'Cao Minh 1', '2025-03-05', 'TP. Hồ Chí Minh', '14:05:00', '1740425402046-1740419419838-1740351597197-1740241959606-nhatrangdalat.jpg', '123123', 3500000, 1500000, '2025-02-23 16:02:57', '2025-03-03 06:39:15');

-- --------------------------------------------------------

--
-- Table structure for table `customer_reviews`
--

CREATE TABLE `customer_reviews` (
  `id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text COLLATE utf8mb4_general_ci,
  `user_id` int NOT NULL,
  `movie_id` int DEFAULT NULL,
  `tour_id` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `customer_reviews`
--

INSERT INTO `customer_reviews` (`id`, `rating`, `comment`, `user_id`, `movie_id`, `tour_id`, `createdAt`, `updatedAt`) VALUES
(1, 5, 'Phim rất hay và ý nghĩa!', 1, 1, NULL, '2025-02-19 20:26:23', '2025-02-19 20:26:23'),
(2, 4, 'Concert tuyệt vời, Đen Vâu quá đỉnh!', 2, NULL, NULL, '2025-02-19 20:26:23', '2025-02-19 20:26:23'),
(3, 5, 'Tour du lịch rất tuyệt vời, hướng dẫn viên nhiệt tình!', 3, NULL, 1, '2025-02-19 20:26:23', '2025-02-19 20:26:23');

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `genre` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `director` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `actors` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci,
  `release_date` date NOT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '1: Hiển thị, 2: Ẩn',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`id`, `name`, `genre`, `director`, `actors`, `image_url`, `description`, `release_date`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Bố Già', 'Hài, Gia đình', 'Trấn Thành', 'Trấn Thành, Tuấn Trần, Ngân Chi', 'bogia.jpg', 'Phim về gia đình và tình cha con', '2025-02-24', 1, '2025-02-19 20:20:09', '2025-02-23 19:33:45'),
(2, '578: Phát Đạn Của Kẻ Điên', 'Hành động, Tâm lý', 'Lương Đình Dũng', 'Hồng Ánh, Tiến Luật, Kaity Nguyễn', '578phatdan.jpg', 'Phim hành động đầy kịch tính', '2025-02-24', 1, '2025-02-19 20:20:09', '2025-02-24 16:59:44'),
(3, 'Mắt Biếc', 'Tình cảm, Lãng mạn', 'Victor Vũ', 'Trúc Anh, Trần Nghĩa, Khả Ngân', 'matbiec.jpg', 'Phim chuyển thể từ tiểu thuyết cùng tên', '2019-12-20', 1, '2025-02-19 20:20:09', '2025-02-19 20:20:09'),
(4, 'Avengers: Endgame', 'Hành động, Khoa học viễn tưởng', 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Chris Evans, Mark Ruffalo', 'avengers-endgame.jpg', 'Phim kết thúc cuộc chiến chống lại Thanos và cứu vũ trụ.', '2019-04-26', 1, '2025-02-19 23:51:05', '2025-02-19 23:51:05'),
(5, 'Spider-Man: No Way Home', 'Hành động, Phiêu lưu', 'Jon Watts', 'Tom Holland, Zendaya, Benedict Cumberbatch', 'spiderman-nowayhome.jpg', 'Phim kể về hành trình của Spider-Man đối mặt với đa vũ trụ.', '2025-02-28', 1, '2025-02-19 23:51:05', '2025-02-26 10:04:49'),
(8, 'Thiết kế web xe hơi', '123', '123', '123', 'matbiec.jpg', 'sdjkljmsakldjlas', '2025-03-02', 2, '2025-02-22 15:48:49', '2025-02-23 19:30:41'),
(9, 'Cao Minh123', '123', '123', '123', '1740424309834-1740337251509-1740337202514-1740254922968-578phatdan.jpg', 'sadasd', '2025-03-09', 2, '2025-02-22 16:31:34', '2025-02-24 19:11:49'),
(10, 'ahihi', '123123', 'ádasdasd', 'sadasdsadas', '1740241959606-nhatrangdalat.jpg', 'ewqeqwe', '2025-03-08', 2, '2025-02-22 16:32:39', '2025-02-23 19:45:31'),
(11, '123123', 'abc123123', 'abc123123', 'sadasdsadas', '1740423438962-1740422843266-1740419419838-1740351597197-1740241959606-nhatrangdalat.jpg', 'dsadsad', '2025-03-29', 2, '2025-02-22 16:36:37', '2025-02-24 18:57:18'),
(13, 'Cao Minh', '123', '213', '213', '1740564447345-1740242197397-spiderman-nowayhome.jpg', '213', '2025-03-08', 2, '2025-02-26 10:07:27', '2025-02-26 10:07:27');

-- --------------------------------------------------------

--
-- Table structure for table `movie_date`
--

CREATE TABLE `movie_date` (
  `id` int NOT NULL,
  `date_show` date NOT NULL,
  `movie_id` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movie_date`
--

INSERT INTO `movie_date` (`id`, `date_show`, `movie_id`, `createdAt`, `updatedAt`) VALUES
(1, '2025-02-22', 1, '2025-02-22 09:58:41', '2025-02-22 09:58:41'),
(2, '2025-02-08', 1, '2025-02-22 10:13:38', '2025-02-22 10:13:38'),
(3, '2025-02-13', 1, '2025-02-22 17:34:01', '2025-02-22 17:34:01'),
(7, '2025-03-09', 1, '2025-02-22 22:19:10', '2025-02-22 22:19:10'),
(14, '2025-03-08', 1, '2025-02-22 22:35:14', '2025-02-22 22:35:14'),
(18, '2025-03-07', 1, '2025-02-22 22:51:38', '2025-02-22 22:51:38'),
(23, '2025-03-06', 1, '2025-02-22 23:02:39', '2025-02-22 23:02:39'),
(24, '2025-04-06', 1, '2025-02-22 23:48:32', '2025-02-22 23:48:32'),
(25, '2025-03-01', 1, '2025-02-22 23:48:42', '2025-02-22 23:48:42'),
(34, '2025-03-02', 1, '2025-02-23 00:21:05', '2025-02-23 00:21:05'),
(35, '2025-02-26', 1, '2025-02-23 00:29:36', '2025-02-23 00:29:36'),
(36, '2025-03-09', 2, '2025-02-23 06:26:10', '2025-02-23 06:26:10'),
(37, '2025-03-08', 2, '2025-02-23 06:26:27', '2025-02-23 06:26:27'),
(38, '2025-03-05', 3, '2025-02-23 06:26:53', '2025-02-23 06:26:53'),
(39, '2025-03-01', 4, '2025-02-23 13:11:42', '2025-02-23 13:11:42'),
(40, '2025-03-02', 10, '2025-02-23 13:12:57', '2025-02-23 13:12:57'),
(41, '2025-03-01', 10, '2025-02-23 13:17:03', '2025-02-23 13:17:03'),
(42, '2025-02-25', 2, '2025-02-24 16:59:56', '2025-02-24 16:59:56');

-- --------------------------------------------------------

--
-- Table structure for table `movie_showtimes`
--

CREATE TABLE `movie_showtimes` (
  `id` int NOT NULL,
  `show_time` time NOT NULL,
  `vip_price` decimal(10,0) NOT NULL,
  `normal_price` decimal(10,0) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `movie_date_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movie_showtimes`
--

INSERT INTO `movie_showtimes` (`id`, `show_time`, `vip_price`, `normal_price`, `createdAt`, `updatedAt`, `movie_date_id`) VALUES
(1, '10:00:00', 150000, 100000, '2025-02-19 20:21:04', '2025-02-22 03:01:18', 1),
(7, '15:00:00', 150000, 100000, '2025-02-22 03:03:54', '2025-02-22 03:03:54', 1),
(11, '19:25:00', 70000, 55000, '2025-02-23 07:16:39', '2025-02-23 07:16:39', 37),
(12, '08:50:00', 70000, 55000, '2025-02-23 07:21:08', '2025-02-23 07:21:08', 2),
(13, '22:15:00', 70000, 55000, '2025-02-23 13:12:37', '2025-02-23 13:12:37', 37),
(14, '10:15:00', 70000, 55000, '2025-02-23 13:13:08', '2025-02-23 13:13:08', 40),
(15, '09:15:00', 70000, 55000, '2025-02-23 13:13:45', '2025-02-23 13:13:45', 40),
(16, '22:20:00', 70000, 55000, '2025-02-23 13:17:24', '2025-02-23 13:17:24', 41),
(17, '12:20:00', 70000, 55000, '2025-02-23 13:18:03', '2025-02-23 13:18:03', 41),
(18, '13:05:00', 70000, 55000, '2025-02-24 17:00:18', '2025-02-24 17:00:18', 42),
(19, '08:40:00', 70000, 55000, '2025-02-25 18:10:18', '2025-02-25 18:10:18', 35),
(20, '13:00:00', 150000, 100000, '2025-03-01 22:55:35', '2025-03-01 22:55:35', 34),
(21, '09:10:00', 70000, 55000, '2025-03-01 23:07:26', '2025-03-01 23:07:26', 23),
(22, '10:10:00', 70000, 55000, '2025-03-01 23:07:47', '2025-03-01 23:07:47', 23),
(23, '12:10:00', 70000, 55000, '2025-03-01 23:07:55', '2025-03-01 23:07:55', 23);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `selected_seats` text COLLATE utf8mb4_general_ci NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `user_id` int NOT NULL,
  `movie_showtimes_id` int DEFAULT NULL,
  `concert_id` int DEFAULT NULL,
  `tour_id` int DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('pending','paid','cancelled') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `selected_seats`, `total_price`, `user_id`, `movie_showtimes_id`, `concert_id`, `tour_id`, `createdAt`, `updatedAt`, `status`) VALUES
(13, 'A1, A2', 200000.00, 3, 20, NULL, NULL, '2025-02-19 20:32:08', '2025-03-02 00:11:02', 'pending'),
(14, 'A3, A4', 360000.00, 1, NULL, 3, NULL, '2025-02-19 20:32:58', '2025-03-02 08:58:05', 'pending'),
(15, 'C1, C2', 7000000.00, 3, NULL, NULL, 2, '2025-02-19 20:33:41', '2025-03-03 01:35:19', 'pending'),
(16, 'D5, D6', 300000.00, 4, 20, NULL, NULL, '2025-03-02 01:25:33', '2025-03-02 01:25:33', 'pending'),
(17, 'C5, C6', 300000.00, 4, 20, NULL, NULL, '2025-03-02 01:32:24', '2025-03-02 01:32:24', 'pending'),
(18, 'G5, G6', 110000.00, 4, 11, NULL, NULL, '2025-03-02 01:37:48', '2025-03-02 01:37:48', 'pending'),
(19, 'B5, B6', 200000.00, 4, 20, NULL, NULL, '2025-03-02 02:19:44', '2025-03-02 02:19:44', 'pending'),
(20, 'D5, D6', 140000.00, 4, 11, NULL, NULL, '2025-03-02 06:53:46', '2025-03-02 06:53:46', 'pending'),
(21, 'G5, G6', 110000.00, 4, 21, NULL, NULL, '2025-03-02 07:02:41', '2025-03-02 07:02:41', 'pending'),
(22, 'G5, G6', 110000.00, 4, 23, NULL, NULL, '2025-03-02 07:03:19', '2025-03-02 07:03:19', 'pending'),
(23, 'G5, G6', 110000.00, 4, 22, NULL, NULL, '2025-03-02 07:12:25', '2025-03-02 07:12:25', 'pending'),
(24, 'G7', 55000.00, 4, 22, NULL, NULL, '2025-03-02 07:13:30', '2025-03-02 07:13:30', 'pending'),
(25, 'E5', 70000.00, 4, 11, NULL, NULL, '2025-03-02 07:32:16', '2025-03-02 07:37:58', 'pending'),
(26, 'F7', 55000.00, 4, 11, NULL, NULL, '2025-03-02 07:38:06', '2025-03-02 07:41:28', 'pending'),
(27, 'E6', 70000.00, 4, 11, NULL, NULL, '2025-03-02 07:41:52', '2025-03-02 07:41:52', 'pending'),
(37, 'G6,G5', 200000.00, 4, 20, NULL, NULL, '2025-03-02 09:51:38', '2025-03-02 09:51:38', 'pending'),
(39, 'C8, C9', 600000.00, 4, NULL, 3, NULL, '2025-03-02 09:57:25', '2025-03-02 09:58:03', 'pending'),
(41, 'A8, A9', 1600000.00, 4, NULL, 4, NULL, '2025-03-02 09:59:29', '2025-03-02 09:59:29', 'pending'),
(42, 'F5, F6', 110000.00, 4, 21, NULL, NULL, '2025-03-03 00:45:01', '2025-03-03 00:45:01', 'pending'),
(43, 'C5, C6', 140000.00, 4, 22, NULL, NULL, '2025-03-03 00:46:00', '2025-03-03 00:46:00', 'pending'),
(44, 'C10, C11', 600000.00, 4, NULL, 3, NULL, '2025-03-03 00:47:06', '2025-03-03 00:47:06', 'pending'),
(45, 'F1, F2', 7000000.00, 4, NULL, NULL, 2, '2025-03-03 02:03:55', '2025-03-03 02:03:55', 'pending'),
(46, 'G1, G2', 7000000.00, 4, NULL, NULL, 2, '2025-03-03 02:05:29', '2025-03-03 02:05:29', 'pending'),
(47, 'F1, F2', 5000000.00, 4, NULL, NULL, 1, '2025-03-03 05:21:33', '2025-03-03 05:21:33', 'pending'),
(48, 'F1, F2', 5000000.00, 4, NULL, NULL, 1, '2025-03-03 05:22:29', '2025-03-03 05:22:29', 'pending'),
(49, 'G1, G2', 5000000.00, 4, NULL, NULL, 1, '2025-03-03 05:27:56', '2025-03-03 05:27:56', 'pending'),
(50, 'E1, E2', 7000000.00, 4, NULL, NULL, 2, '2025-03-03 05:34:25', '2025-03-03 05:34:25', 'pending'),
(51, 'E1, E2', 7000000.00, 4, NULL, NULL, 2, '2025-03-03 05:35:37', '2025-03-03 05:35:37', 'pending'),
(52, 'E1, E2', 7000000.00, 4, NULL, NULL, 2, '2025-03-03 05:35:40', '2025-03-03 05:35:40', 'pending'),
(53, 'A9, A8', 7000000.00, 4, NULL, 6, NULL, '2025-03-03 06:39:23', '2025-03-03 06:39:23', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `tours`
--

CREATE TABLE `tours` (
  `id` int NOT NULL,
  `departure_point` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `destination` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `departure_date` date NOT NULL,
  `end_date` date NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tours`
--

INSERT INTO `tours` (`id`, `departure_point`, `destination`, `image_url`, `departure_date`, `end_date`, `location`, `price`, `createdAt`, `updatedAt`) VALUES
(1, 'Đà Nẵng', 'Hội An', 'dananghoian.jpg', '2025-02-25', '2025-02-28', 'Đà Nẵng, Hội An', 2500000, '2025-02-19 20:25:05', '2025-02-24 19:40:32'),
(2, 'Nha Trang', 'Đà Lạt', 'nhatrangdalat.jpg', '2025-02-26', '2025-03-01', 'Nha Trang, Đà Lạt', 3500000, '2025-02-19 20:25:05', '2025-02-25 10:24:15'),
(3, 'Cần Thơ', 'Vũng Tàu', '1740351597197-1740241959606-nhatrangdalat.jpg', '2025-02-25', '2025-03-01', 'TP. Hồ Chí Minh', 2400000, '2025-02-23 20:40:09', '2025-02-24 19:43:07'),
(4, 'Cần Thơ', 'TP. Hồ Chí Minh ', '1740419419838-1740351597197-1740241959606-nhatrangdalat.jpg', '2025-02-26', '2025-02-28', 'TP. Hồ Chí Minh ', 2400000, '2025-02-24 17:50:19', '2025-02-24 17:50:19');

-- --------------------------------------------------------

--
-- Table structure for table `travel_itinerary`
--

CREATE TABLE `travel_itinerary` (
  `id` int NOT NULL,
  `travel_date` date NOT NULL,
  `itinerary` text COLLATE utf8mb4_general_ci NOT NULL,
  `tour_id` int NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `travel_itinerary`
--

INSERT INTO `travel_itinerary` (`id`, `travel_date`, `itinerary`, `tour_id`, `createdAt`, `updatedAt`) VALUES
(1, '2023-11-01', '<p><strong>08:00 - 11:00:</strong> Xuất ph&aacute;t đến Hội An, nhận ph&ograve;ng kh&aacute;ch sạn.</p>\r\n<p><strong>12:00 - 14:00:</strong> Ăn trưa tại nh&agrave; h&agrave;ng đặc sản Hội An.</p>\r\n<p><strong>15:00 - 18:00:</strong> Tham quan Phố Cổ Hội An, Ch&ugrave;a Cầu, Nh&agrave; Cổ Tấn K&yacute;.</p>\r\n<p><strong>19:00 - 21:00:</strong> Thưởng thức đ&egrave;n lồng Hội An, ăn tối với Cao Lầu, M&igrave; Quảng.</p>\r\n<p><strong>21:30:</strong> Về kh&aacute;ch sạn nghỉ ngơi.</p>', 1, '2025-02-19 20:37:25', '2025-02-24 18:50:31'),
(2, '2023-11-02', '<p><strong>07:00 - 08:00:</strong> Ăn sáng tại khách sạn.</p>\n                    <p><strong>08:30 - 09:30:</strong> Di chuyển đến Cảng Cửa Đại, lên tàu đi Cù Lao Chàm.</p>\n                    <p><strong>10:00 - 12:00:</strong> Lặn ngắm san hô, tham quan Bãi Chồng, Bãi Xếp.</p>\n                    <p><strong>12:30 - 14:00:</strong> Ăn trưa hải sản tại nhà hàng địa phương.</p>\n                    <p><strong>15:00 - 17:00:</strong> Quay về Hội An, nghỉ ngơi tại khách sạn.</p>\n                    <p><strong>19:00 - 21:00:</strong> Dạo phố, tham gia làm đèn lồng, chụp ảnh.</p>', 1, '2025-02-19 20:37:25', '2025-02-20 22:03:42'),
(5, '2023-11-03', '<p><strong>07:00 - 08:00:</strong> Ăn sáng, trả phòng khách sạn.</p>\r\n                    <p><strong>08:30 - 10:30:</strong> Tham quan Làng Gốm Thanh Hà, trải nghiệm làm gốm.</p>\r\n                    <p><strong>11:00 - 12:30:</strong> Mua sắm đặc sản Hội An (bánh đậu xanh, lụa tơ tằm).</p>\r\n                    <p><strong>13:00:</strong> Lên xe trở về điểm xuất phát, kết thúc chuyến đi.</p>', 1, '2025-02-20 22:05:20', '2025-02-20 22:05:20'),
(8, '2025-02-25', '<p>123123</p>', 3, '2025-02-23 22:46:32', '2025-02-24 17:40:51'),
(9, '2025-02-26', '<p>213</p>', 3, '2025-02-24 11:12:37', '2025-02-24 11:12:37'),
(14, '2025-02-27', '<p>123</p>', 3, '2025-02-24 17:02:48', '2025-02-24 17:02:48'),
(15, '2025-02-28', '<p>123</p>', 3, '2025-02-24 17:02:55', '2025-02-24 17:02:55'),
(16, '2025-03-01', '<p>123</p>', 3, '2025-02-24 17:13:35', '2025-02-24 17:13:35'),
(18, '2025-02-25', '<p><strong>08:00 - 11:00:</strong> Xuất ph&aacute;t đến Hội An, nhận ph&ograve;ng kh&aacute;ch sạn.</p>\r\n<p><strong>12:00 - 14:00:</strong> Ăn trưa tại nh&agrave; h&agrave;ng đặc sản Hội An.</p>\r\n<p><strong>15:00 - 18:00:</strong> Tham quan Phố Cổ Hội An, Ch&ugrave;a Cầu, Nh&agrave; Cổ Tấn K&yacute;.</p>\r\n<p><strong>19:00 - 21:00:</strong> Thưởng thức đ&egrave;n lồng Hội An, ăn tối với Cao Lầu, M&igrave; Quảng.</p>\r\n<p><strong>21:30:</strong> Về kh&aacute;ch sạn nghỉ ngơi.</p>', 1, '2025-02-24 19:41:44', '2025-02-24 19:41:44'),
(19, '2025-02-26', '<p><strong>07:00 - 08:00:</strong>&nbsp;Xe đ&oacute;n kh&aacute;ch tại Nha Trang, khởi h&agrave;nh đi Đ&agrave; Lạt qua đ&egrave;o Kh&aacute;nh L&ecirc;.</p>\r\n<p><strong>09:30 - 10:00:</strong>&nbsp;Nghỉ ch&acirc;n, ngắm cảnh đ&egrave;o, chụp ảnh tại điểm cao nhất của đ&egrave;o.</p>\r\n<p><strong>11:30 - 12:30:</strong>&nbsp;Đến Đ&agrave; Lạt, nhận ph&ograve;ng kh&aacute;ch sạn, nghỉ ngơi.</p>\r\n<p><strong>13:00 - 14:00:</strong>&nbsp;Ăn trưa tại nh&agrave; h&agrave;ng địa phương.</p>\r\n<p><strong>15:00 - 17:00:</strong>&nbsp;Tham quan Quảng Trường L&acirc;m Vi&ecirc;n, check-in Hồ Xu&acirc;n Hương.</p>\r\n<p><strong>18:30 - 20:00:</strong>&nbsp;Ăn tối, kh&aacute;m ph&aacute; chợ đ&ecirc;m Đ&agrave; Lạt, thưởng thức c&aacute;c m&oacute;n nướng.</p>\r\n<p><strong>21:00:</strong> Về kh&aacute;ch sạn nghỉ ngơi.</p>', 2, '2025-02-25 10:25:07', '2025-02-25 10:25:07'),
(20, '2025-02-27', '<p><strong>07:00 - 08:00:</strong>&nbsp;Ăn s&aacute;ng tại kh&aacute;ch sạn.</p>\r\n<p><strong>08:30 - 10:00:</strong>&nbsp;Tham quan Thung Lũng T&igrave;nh Y&ecirc;u, chụp ảnh check-in.</p>\r\n<p><strong>10:30 - 12:00:</strong>&nbsp;Kh&aacute;m ph&aacute; L&agrave;ng C&ugrave; Lần, ngắm cảnh rừng th&ocirc;ng.</p>\r\n<p><strong>12:30 - 14:00:</strong>&nbsp;Ăn trưa với c&aacute;c m&oacute;n đặc sản Đ&agrave; Lạt.</p>\r\n<p><strong>14:30 - 16:30:</strong>&nbsp;Tham quan Ch&ugrave;a Linh Phước (Ch&ugrave;a Ve Chai).</p>\r\n<p><strong>17:00 - 19:00:</strong>&nbsp;Ăn tối, tham gia giao lưu cồng chi&ecirc;ng T&acirc;y Nguy&ecirc;n.</p>\r\n<p><strong>20:00:</strong> Tự do dạo phố, thưởng thức kem bơ v&agrave; sữa đậu n&agrave;nh Đ&agrave; Lạt.</p>', 2, '2025-02-25 10:26:09', '2025-02-25 10:26:09'),
(21, '2025-02-28', '<p><strong>07:00 - 08:00:</strong>&nbsp;Ăn s&aacute;ng tại kh&aacute;ch sạn.</p>\r\n<p><strong>08:30 - 10:00:</strong>&nbsp;Check-in Đồi Ch&egrave; Cầu Đất, ngắm to&agrave;n cảnh Đ&agrave; Lạt từ tr&ecirc;n cao.</p>\r\n<p><strong>10:30 - 12:00:</strong>&nbsp;Tham quan Đỉnh Lang Biang, đi xe jeep l&ecirc;n đỉnh.</p>\r\n<p><strong>12:30 - 14:00:</strong>&nbsp;Ăn trưa tại nh&agrave; h&agrave;ng gần Lang Biang.</p>\r\n<p><strong>14:30 - 16:00:</strong>&nbsp;Tham quan Nh&agrave; Ga Đ&agrave; Lạt - ga cổ nhất Đ&ocirc;ng Dương.</p>\r\n<p><strong>17:00 - 19:00:</strong> Ăn tối, tự do kh&aacute;m ph&aacute; chợ đ&ecirc;m Đ&agrave; Lạt.</p>', 2, '2025-02-25 10:26:38', '2025-02-25 10:26:38'),
(22, '2025-03-01', '<p><strong>07:00 - 08:00:</strong>&nbsp;Ăn s&aacute;ng, trả ph&ograve;ng kh&aacute;ch sạn.</p>\r\n<p><strong>08:30 - 10:00:</strong>&nbsp;Tham quan v&agrave; mua sắm tại Chợ Đ&agrave; Lạt.</p>\r\n<p><strong>10:30 - 12:00:</strong>&nbsp;Gh&eacute; vườn d&acirc;u t&acirc;y Đ&agrave; Lạt, trải nghiệm h&aacute;i d&acirc;u.</p>\r\n<p><strong>12:30 - 14:00:</strong>&nbsp;Ăn trưa tại Đ&agrave; Lạt.</p>\r\n<p><strong>14:30:</strong> L&ecirc;n xe về lại Nha Trang, kết th&uacute;c h&agrave;nh tr&igrave;nh.</p>', 2, '2025-02-25 10:27:03', '2025-02-25 10:27:03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '1: Hoạt động, 2: Khóa',
  `role` tinyint NOT NULL DEFAULT '2' COMMENT '1: Admin, 2: Người dùng'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `avatar`, `createdAt`, `updatedAt`, `status`, `role`) VALUES
(1, 'NguyenVanA', 'nguyenvana@gmail.com', 'password123', 'avatar1.jpg', '2025-02-19 20:20:03', '2025-02-24 22:02:47', 2, 2),
(2, 'TranThiB', 'tranthib@gmail.com', 'password123', 'avatar2.jpg', '2025-02-19 20:20:03', '2025-02-19 20:20:03', 1, 2),
(3, 'LeVanC', 'levanc@gmail.com', 'password123', 'avatar3.jpg', '2025-02-19 20:20:03', '2025-02-19 20:20:03', 1, 2),
(4, 'minhncpc05371', 'minhncpc05371@gmail.com', '$2b$10$1YoW2pGGEvZs.045IhBBEeLPmirn5dIM1cc/Vrs4xSOhWayjBUXPu', 'soobin.jpg', '2025-02-24 21:05:44', '2025-02-24 22:23:38', 1, 1),
(5, 'Cao Minh', 'caominh@gmail.com', '$2b$10$4kbTQWGrgfSux1ivgcIxgO4ed4VTaJN5opxMYItZw/9fWzb06Os0W', NULL, '2025-02-24 23:00:39', '2025-02-24 23:13:20', 1, 2),
(6, 'Cao Minh1', 'cminh8822@gmail.com', '$2b$10$LoBv6BghsZi3rbCbNqnCxOZi9wueMw1WVThw/KLjcAozniZr39uw2', NULL, '2025-02-24 23:24:22', '2025-02-24 23:24:22', 1, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `artist_images`
--
ALTER TABLE `artist_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `concerts`
--
ALTER TABLE `concerts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer_reviews`
--
ALTER TABLE `customer_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `movie_id` (`movie_id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `movie_date`
--
ALTER TABLE `movie_date`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_movie_date_movie` (`movie_id`);

--
-- Indexes for table `movie_showtimes`
--
ALTER TABLE `movie_showtimes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_movie_showtimes_movie_date` (`movie_date_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `movie_showtimes_id` (`movie_showtimes_id`),
  ADD KEY `concert_id` (`concert_id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `travel_itinerary`
--
ALTER TABLE `travel_itinerary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tour_id` (`tour_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artist_images`
--
ALTER TABLE `artist_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `concerts`
--
ALTER TABLE `concerts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `customer_reviews`
--
ALTER TABLE `customer_reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `movie_date`
--
ALTER TABLE `movie_date`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `movie_showtimes`
--
ALTER TABLE `movie_showtimes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `tours`
--
ALTER TABLE `tours`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `travel_itinerary`
--
ALTER TABLE `travel_itinerary`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer_reviews`
--
ALTER TABLE `customer_reviews`
  ADD CONSTRAINT `customer_reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `customer_reviews_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  ADD CONSTRAINT `customer_reviews_ibfk_3` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);

--
-- Constraints for table `movie_date`
--
ALTER TABLE `movie_date`
  ADD CONSTRAINT `fk_movie_date_movie` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `movie_showtimes`
--
ALTER TABLE `movie_showtimes`
  ADD CONSTRAINT `fk_movie_showtimes_movie_date` FOREIGN KEY (`movie_date_id`) REFERENCES `movie_date` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`movie_showtimes_id`) REFERENCES `movie_showtimes` (`id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`concert_id`) REFERENCES `concerts` (`id`),
  ADD CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);

--
-- Constraints for table `travel_itinerary`
--
ALTER TABLE `travel_itinerary`
  ADD CONSTRAINT `travel_itinerary_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
