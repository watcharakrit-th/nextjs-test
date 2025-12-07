"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Config } from "../Config";
import Link from "next/link";
import api from "../axios";

export default function Sidebar() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    // fetchData();
    setCurrentPath(localStorage.getItem("currentPath") || "");
    setDefaultSidebar();
  }, []);

  const setDefaultSidebar = () => {
    const sidebar = localStorage.getItem("sidebar");
    const sidebarElement = document.querySelector(".sidebar") as HTMLElement;

    if (sidebar == "true") {
      sidebarElement.classList.add("hidden");
    } else {
      sidebarElement.classList.remove("hidden");
    }
  };

   const handleLogout = async () => {
    try {
      const url = `/logout`;
      // kill the cookie
      await api.post(url);
      
      router.push('/');
      
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  

  const navigateAndSetCurrentPath = (path: string) => {
    router.push(path);
    setCurrentPath(path);
    localStorage.setItem("currentPath", path);
  };

  const isActive = (path: string) => {
    return currentPath == path ? "sidebar-nav-link-active" : "sidebar-nav-link";
  };

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar") as HTMLElement;

    // console.log(sidebar)

    if (sidebar) {
      if (sidebar.classList.contains("hidden")) {
        sidebar.classList.remove("hidden");
        localStorage.setItem("sidebar", "false");
      } else {
        sidebar.classList.add("hidden");
        localStorage.setItem("sidebar", "true");
      }
    }
  };

  return (
    <div className="flex items-start">
      <div className="sidebar">
        <div className="flex flex-col gap-4">
          <div className="sidebar-title">
            <h1>
              <i className="fas fa-leaf mr-3"></i>
              Sidebar
            </h1>
            <div className="text-lg font-normal mt-3 mb-4">
              <i className="fas fa-user mr-3"></i>
              {username} ({role})
            </div>
            <div className="flex gap-2 m-3 justify-center">
              <Link href="/erp/user/edit" className="btn-edit">
                <i className="fas fa-edit mr-2"></i>
                Edit
              </Link>
              <button className="btn-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>

          <nav>
            <ul className="sidebar-nav-list">
              {
                /*role == "admin"*/ true && (
                  <li className="sidebar-nav-item">
                    <a
                      onClick={() =>
                        navigateAndSetCurrentPath("/erp/dashboard")
                      }
                      className={isActive("/erp/dashboard")}
                    >
                      <i className="fa fa-dashboard mr-2"></i>
                      <span>Page 1</span>
                    </a>
                  </li>
                )
              }

              <li className="sidebar-nav-item">
                <a
                  onClick={() => navigateAndSetCurrentPath("/erp/stock")}
                  className={isActive("/erp/stock")}
                >
                  <i className="fas fa-box-open mr-2"></i>
                  <span>Page 2</span>
                </a>
              </li>
              <li className="sidebar-nav-item">
                <a
                  onClick={() => navigateAndSetCurrentPath("/erp/production")}
                  className={isActive("/erp/production")}
                >
                  <i className="fas fa-cogs mr-2"></i>
                  <span>Page 3</span>
                </a>
              </li>
              <li className="sidebar-nav-item">
                <a
                  onClick={() => navigateAndSetCurrentPath("/erp/sale")}
                  className={isActive("/erp/sale")}
                >
                  <i className="fas fa-money-bill-trend-up mr-2"></i>
                  <span>Page 4</span>
                </a>
              </li>
              {
                /*role == "admin"*/ true && (
                  <>
                    <li className="sidebar-nav-item">
                      <a
                        onClick={() =>
                          navigateAndSetCurrentPath("/erp/bill-sale")
                        }
                        className={isActive("/erp/bill-sale")}
                      >
                        <i className="fas fa-file-invoice-dollar mr-2"></i>
                        <span>Page 5</span>
                      </a>
                    </li>
                    <li className="sidebar-nav-item">
                      <a
                        onClick={() =>
                          navigateAndSetCurrentPath("/erp/account")
                        }
                        className={isActive("/erp/account")}
                      >
                        <i className="fas fa-file-invoice-dollar mr-2"></i>
                        <span>Page 6</span>
                      </a>
                    </li>
                    <li className="sidebar-nav-item">
                      <a
                        onClick={() => navigateAndSetCurrentPath("/erp/report")}
                        className={isActive("/erp/report")}
                      >
                        <i className="fas fa-chart-line mr-2"></i>
                        <span>Page 7</span>
                      </a>
                    </li>
                    <li className="sidebar-nav-item">
                      <a
                        onClick={() => navigateAndSetCurrentPath("/erp/user")}
                        className={isActive("/erp/user")}
                      >
                        <i className="fas fa-user-alt mr-2"></i>
                        <span>Page 8</span>
                      </a>
                    </li>
                  </>
                )
              }
            </ul>
          </nav>
        </div>
      </div>

      <button
        className="text-white ms-3 cursor-pointer"
        onClick={toggleSidebar}
      >
        <i className="fa fa-bars"></i>
      </button>
      <button
        className="text-white ms-3 cursor-pointer"
        
      >
        <i className="fa fa-bars"></i>
      </button>
    </div>
  );
}
