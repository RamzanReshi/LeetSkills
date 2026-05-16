import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

const protectedRoutes = [
  "/dashboard",
  "/scenarios",
  "/path",
  "/quest",
  "/profile",
  "/scenario",
  "/results",
];

const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

function isRoute(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient<Database, "leetskill">(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: "leetskill",
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (!user && isRoute(pathname, protectedRoutes)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isRoute(pathname, authRoutes)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
