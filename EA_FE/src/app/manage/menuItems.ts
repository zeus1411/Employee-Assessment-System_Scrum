"use client";
import { Role } from "@/constants/type";
import {
  Home,
  LineChart,
  ShoppingCart,
  Users2,
  Salad,
  Table,
  Caravan,
  TrainFront,
  BellElectric,
  BadgeCent,
  Newspaper,
  LockKeyholeOpen,
  UserRoundPen,
  UserCog,
  TrainFrontTunnel,
  Album,
  ShieldHalf,
} from "lucide-react";

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
