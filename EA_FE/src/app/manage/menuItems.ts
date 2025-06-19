"use client";
import { Role } from "@/constants/type";
import { Users2, Album, ShieldHalf } from "lucide-react";

const menuItems = [
  {
    title: "Assessment",
    Icon: Album,
    href: "/manage/assessment",
  },
  {
    title: "Nhân viên",
    Icon: Users2,
    href: "/manage/accounts",
  },
  {
    title: "Team",
    Icon: ShieldHalf,
    href: "/manage/teams",
  },
];

export default menuItems;
