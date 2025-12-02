"use client";

import { useEffect, useState } from "react";
import { Config } from "./Config";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/signin");
  }, []);
}
