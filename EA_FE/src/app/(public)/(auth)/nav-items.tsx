"use client";
import { useAppContext } from "@/components/app-provider";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useLogoutMutation } from "@/queries/useAuth";
export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations("NavItem");
  const loginT = useTranslations("Login");
  const { isAuth, role, setIsAuth, setRole } = useAppContext();
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  const menuItems = [
    { title: t("FindTicket"), href: "/manage/accounts" },
    { title: t("BookingInfo"), href: "/manage/assessment" },
    { title: t("Promotion"), href: "/promotion" },
    { title: t("Term&Conditions"), href: "/term-of-service" },
    { title: t("Contact"), href: "/about" },
  ];

  return (
    <>
      {menuItems.map((item) => {
        const canShow =
          item.role === undefined || (role && item.role.includes(role));
        if (canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          );
        }
        return null;
      })}
    </>
  );
}
