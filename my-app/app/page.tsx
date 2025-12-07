"use client";

import { useState } from "react";
import { Config } from "./Config";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Background3D from "./components/Background3D";
import { headers } from "next/headers";
import api from "./axios";

export default function signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  

  const handleSignIn = async () => {
    try {
      // const url = Config.apiUrl + "/user/signin";
      const url = `/token`;
      const payload = {
        // username: username,
        // password: password,
      };

      const response = await api.post(url, payload, {
        auth: {
          username: username,
          password: password,
        },
      });

      if (response.status == 200) {
        console.log("Sign in successful");
        // localStorage.setItem("JWT_TOKEN", response.data);

        // Config.key = response.data;
        // localStorage.setItem(Config.tokenKey, response.data);
        // document.cookie = Config.tokenKey + "=" + response.data + "; path=/";

        router.push("/main/myOwnNextjsWeb");
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid username or password",
      });
    }
  };



  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      <Background3D />
      <div className="z-10">
        <div className="flex flex-col gap-6 bg-stone-700/50 rounded-2xl p-3 text-white w-64 backdrop-blur-sm">
          <h1 className="bg-gradient-to-r from-orange-400 to-yellow-200 bg-clip-text text-transparent text-4xl font-bold text-center">
            Project
          </h1>
          <h2 className="text-xl text-center">wasd</h2>
          <form className="flex flex-col gap-3">
            <div className="flex flex-col">
              <label>
                <i className="fas fa-user mr-3"></i>
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label>
                <i className="fas fa-lock mr-3"></i>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={handleSignIn}
              className="p-2 rounded-lg bg-stone-700/50 hover:bg-stone-400/50 text-white transition-colors"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
