"use client";

import { CognitoUserSession } from "amazon-cognito-identity-js";
import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { SessionContext } from "./session";

/**
 * This component displays a status message based on whether the user is logged
 * in or not. If the user is logged in, it displays their email address and a
 * logout button. If the user is not logged in, it displays a login button.
 */
export default function Status() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const { getSession, logout } = useContext(SessionContext);

  useEffect(() => {
    async function loadSession() {
      try {
        const session = (await getSession()) as CognitoUserSession;

        setLoggedIn(true);
        setEmail(session.getIdToken().payload["email"]);
      } catch (error) {
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }

    if (loading) {
      loadSession();
    }
  }, [loading, getSession]);

  return (
    <>
      {loading ? (
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 animate-spin"
        >
          <path
            d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
            fill="white"
          />
        </svg>
      ) : (
        <>
          {loggedIn ? (
            <div className="inline-block">
              <span className="dark:text-white mr-3 text-sm">{email}</span>

              <button
                type="button"
                className="rounded-md bg-primary px-4 py-2 font-semibold text-white no-underline shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:bg-primary-disabled dark:shadow-md dark:hover:shadow-sm"
                onClick={() => logout()}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-primary px-4 py-2 font-semibold text-white no-underline shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:bg-primary-disabled dark:shadow-md dark:hover:shadow-sm"
            >
              Login
            </Link>
          )}
        </>
      )}
    </>
  );
}
