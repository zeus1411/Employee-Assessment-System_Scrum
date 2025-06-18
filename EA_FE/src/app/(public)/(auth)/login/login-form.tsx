"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/app-provider";
import envConfig from "@/config";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LoaderCircle } from "lucide-react";
import { useLoginMutation } from "@/queries/useAuth";

const getOauthGoogleUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

const googleOauthUrl = getOauthGoogleUrl();

export default function LoginForm() {
  const t = useTranslations("Login");
  const errorMessageT = useTranslations("ErrorMessage");
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const { setIsAuth, setRole, setPermissions } = useAppContext();

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) {
      return;
    }
    try {
      const result = await loginMutation.mutateAsync(data);
      console.log("Login result:--------------", result);

      localStorage.setItem("accessToken", result.payload.data.access_token);
      localStorage.setItem("refreshToken", result.payload.data.refreshToken);
      setIsAuth(true);
      router.push("/");
      toast({
        description: result.payload.message,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>
          {t("description") ||
            "Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.warn("Form validation errors:", err);
            })}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="username">{t("email") || "Email"}</Label>
                      <Input
                        id="username"
                        type="email"
                        placeholder="example@railskylines.com"
                        required
                        {...field}
                      />
                      <FormMessage>
                        {errors.email?.message &&
                          errorMessageT(errors.email.message as any)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">
                          {t("password") || "Password"}
                        </Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                      <FormMessage>
                        {errors.password?.message &&
                          errorMessageT(errors.password.message as any)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending && (
                  <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
                )}
                {t("title") || "Đăng nhập"}
              </Button>
              <div className="text-center text-sm">
                {t("noAlreadyHaveAccount") || "Chưa có tài khoản?"}{" "}
                <Link href="/register" className="underline">
                  {t("Register") || "Đăng ký"}
                </Link>
              </div>
              <div className="text-center text-sm">
                <Link href="/resend-code" className="underline">
                  {"Forgot Password"}
                </Link>
              </div>
              <Link href={googleOauthUrl}>
                <Button variant="outline" className="w-full" type="button">
                  {t("googleLogin") || "Đăng nhập bằng Google"}
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useForm } from "react-hook-form";
// import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
// import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "@/components/ui/use-toast";
// import { handleErrorApi } from "@/lib/utils";
// import { useRouter } from "next/navigation";
// import { useAppContext } from "@/components/app-provider";
// import envConfig from "@/config";
// import Link from "next/link";
// import { useTranslations } from "next-intl";
// import { LoaderCircle } from "lucide-react";
// import { useLoginMutation } from "@/queries/useAuth";

// const getOauthGoogleUrl = () => {
//   const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
//   const options = {
//     redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
//     client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//     access_type: "offline",
//     response_type: "code",
//     prompt: "consent",
//     scope: [
//       "https://www.googleapis.com/auth/userinfo.profile",
//       "https://www.googleapis.com/auth/userinfo.email",
//     ].join(" "),
//   };
//   const qs = new URLSearchParams(options);
//   return `${rootUrl}?${qs.toString()}`;
// };

// const googleOauthUrl = getOauthGoogleUrl();

// export default function LoginForm() {
//   const t = useTranslations("Login");
//   const errorMessageT = useTranslations("ErrorMessage");
//   const loginMutation = useLoginMutation();
//   const router = useRouter();
//   const { setIsAuth, setRole, setPermissions } = useAppContext();

//   const form = useForm<LoginBodyType>({
//     resolver: zodResolver(LoginBody),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: LoginBodyType) => {
//     if (loginMutation.isPending) {
//       return;
//     }
//     try {
//       const result = await loginMutation.mutateAsync(data);

//       console.log(">>>>>>>Login result:", result);

//       // Store access_token in localStorage
//       localStorage.setItem("accessToken", result.access_token);

//       // Set auth state and role
//       setIsAuth(true);
//       setRole(result.user.role.roleName);
//       // Set permissions if needed (not provided in BE response, assuming empty for now)
//       setPermissions(result.user.role.permissions || []);

//       router.push("/");
//       toast({
//         description: t("loginSuccess") || "Login successful",
//       });
//     } catch (error: any) {
//       console.error("Login error:", error);
//       handleErrorApi({
//         error,
//         setError: form.setError,
//       });
//     }
//   };

//   return (
//     <Card className="mx-auto max-w-sm w-[400px]">
//       <CardHeader>
//         <CardTitle className="text-2xl">{t("title")}</CardTitle>
//         <CardDescription>
//           {t("description") ||
//             "Enter your email and password to log in to the system"}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form
//             className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
//             noValidate
//             onSubmit={form.handleSubmit(onSubmit, (err) => {
//               console.warn("Form validation errors:", err);
//             })}
//           >
//             <div className="grid gap-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field, formState: { errors } }) => (
//                   <FormItem>
//                     <div className="grid gap-2">
//                       <Label htmlFor="username">{t("email") || "Email"}</Label>
//                       <Input
//                         id="username"
//                         type="email"
//                         placeholder="example@railskylines.com"
//                         required
//                         {...field}
//                       />
//                       <FormMessage>
//                         {errors.email?.message &&
//                           errorMessageT(errors.email.message as any)}
//                       </FormMessage>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field, formState: { errors } }) => (
//                   <FormItem>
//                     <div className="grid gap-2">
//                       <div className="flex items-center">
//                         <Label htmlFor="password">
//                           {t("password") || "Password"}
//                         </Label>
//                       </div>
//                       <Input
//                         id="password"
//                         type="password"
//                         required
//                         {...field}
//                       />
//                       <FormMessage>
//                         {errors.password?.message &&
//                           errorMessageT(errors.password.message as any)}
//                       </FormMessage>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//               <Button
//                 type="submit"
//                 className="w-full bg-blue-500 text-white"
//                 disabled={loginMutation.isPending}
//               >
//                 {loginMutation.isPending && (
//                   <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
//                 )}
//                 {t("title") || "Log in"}
//               </Button>
//               <div className="text-center text-sm">
//                 {t("noAlreadyHaveAccount") || "Don't have an account?"}{" "}
//                 <Link href="/register" className="underline">
//                   {t("Register") || "Register"}
//                 </Link>
//               </div>
//               <div className="text-center text-sm">
//                 <Link href="/resend-code" className="underline">
//                   {t("forgotPassword") || "Forgot Password"}
//                 </Link>
//               </div>
//               <Link href={googleOauthUrl}>
//                 <Button variant="outline" className="w-full" type="button">
//                   {t("googleLogin") || "Log in with Google"}
//                 </Button>
//               </Link>
//             </div>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }
