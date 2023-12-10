"use client";

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import React, { createContext } from "react";
import Pool from "../userPool";

type SessionContextType = {
  /**
   * Authenticate a user with Cognito
   * 
   * @param Username Username data from the form
   * @param Password Password data from the form
   * @returns Session data of authenticated user if successful, otherwise an error
   */
  authenticate: (Username: string, Password: string) => Promise<unknown>;
  /**
   * Get session data of current user
   * 
   * @returns Session data of current user if successful, otherwise an error
   */
  getSession: () => Promise<unknown>;
  /**
   * Log out current user
   */
  logout: () => void;
};

/**
 * Context for session data
 */
export const SessionContext = createContext({} as SessionContextType);

export function Session({ children }: { children: React.ReactNode }) {
  /**
   * Get session data of current user
   * 
   * @returns Session data of current user if successful, otherwise an error
   */
  async function getSession() {
    return await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();

      if (user) {
        user.getSession((error: null, session: CognitoUserSession) => {
          if (error) {
            reject(error);
          } else {
            resolve(session);
          }
        });
      } else {
        reject("No user");
      }
    });
  }

  /**
   * Authenticate a user with Cognito
   * 
   * @param Username Username data from the form
   * @param Password Password data from the form
   * @returns Session data of authenticated user if successful, otherwise an error
   */
  async function authenticate(Username: string, Password: string) {
    return await new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username,
        Pool,
      });

      const authDetails = new AuthenticationDetails({
        Username,
        Password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          console.log("onSuccess:", data);
          resolve(data);
        },
        onFailure: (error) => {
          console.error("onFailure:", error);
          reject(error);
        },
        newPasswordRequired: (data) => {
          console.log("newPasswordRequired:", data);
          resolve(data);
        },
      });
    });
  }

  /**
   * Log out current user
   */
  function logout() {
    const user = Pool.getCurrentUser();

    if (user) {
      user.signOut();
    }
  }

  return (
    <SessionContext.Provider value={{ authenticate, getSession, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
