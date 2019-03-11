/*
Navicat MySQL Data Transfer

Source Server         : blog
Source Server Version : 50550
Source Host           : 43.225.158.92:3306
Source Database       : node_blog

Target Server Type    : MYSQL
Target Server Version : 50550
File Encoding         : 65001

Date: 2019-03-11 17:27:52
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `kinds`
-- ----------------------------
DROP TABLE IF EXISTS `kinds`;
CREATE TABLE `kinds` (
  `id` int(11) NOT NULL COMMENT 'id',
  `type` int(11) NOT NULL COMMENT '类型(1-->文章；2-->标签)',
  `name` varchar(255) NOT NULL COMMENT '类别名称',
  `parent` int(11) NOT NULL COMMENT '所属帖子id',
  `time` varchar(255) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of kinds
-- ----------------------------

-- ----------------------------
-- Table structure for `messages`
-- ----------------------------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL COMMENT '留言id',
  `cid` varchar(255) NOT NULL COMMENT '所属文章id',
  `post` varchar(255) NOT NULL COMMENT '留言内容',
  `time` varchar(255) NOT NULL COMMENT '发布时间',
  `name` varchar(255) DEFAULT NULL COMMENT '留言者用户名',
  `email` varchar(255) DEFAULT NULL COMMENT '留言邮箱',
  `url` varchar(255) DEFAULT NULL COMMENT '留言者个人主页',
  `parent` varchar(255) NOT NULL COMMENT '父级评论',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of messages
-- ----------------------------

-- ----------------------------
-- Table structure for `post`
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `id` int(11) NOT NULL COMMENT '帖子ID',
  `name` varchar(255) NOT NULL COMMENT '发帖用户',
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `kind` varchar(255) NOT NULL,
  `last_time` varchar(255) DEFAULT NULL COMMENT '上次修改时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of post
-- ----------------------------

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `sex` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `introduction` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('0', 'Curtion', '563f4218f5666bd0d4141f2747893ec1', '男', 'curtion@126.com', '13540286608', '学习使人快乐');
