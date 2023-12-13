"use client";

import { useContext, useEffect, useState } from "react";
import { SessionContext } from "./components/session";
import Pool from "./userPool";
import FileTable from "./components/fileTable";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [ID, setID] = useState("");
  const { getSession } = useContext(SessionContext);

  useEffect(() => {
    getSession()
      .then(() => {
        const user = Pool.getCurrentUser();

        setID(user!.getUsername());
        setLoggedIn(true);
      })
      .catch((error) => {
        console.error("Failed to get session!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  return (
    <main className="flex flex-col justify-center items-center flex-1">
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
            <div className="w-full flex flex-col gap-4">
              <FileTable id={ID} />
            </div>
          ) : (
            <h1 className="text-3xl font-semibold mb-4 dark:text-white">
              Please login to continue
            </h1>
          )}
        </>
      )}
    </main>
  );
}
