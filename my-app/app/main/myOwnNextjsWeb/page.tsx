"use client";
import { useEffect, useMemo, useState } from "react";
import { myOwnNextjsWebInterface } from "../../interface/myOwnNextjsWebInterface";
import Swal from "sweetalert2";
import axios from "axios";
import React from "react";
import { Config } from "../../Config";
import { useRouter } from "next/navigation";
import api from "@/app/axios";

export default function myOwnNextjsWeb() {
  const [data, setData] = useState<myOwnNextjsWebInterface[]>([]);

  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const [keysForThead, setKeysForThead] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();

  // axios.defaults.withCredentials = true;

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  const currentTableData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, data]);

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const url = `/myOwnNextjsWeb`;

      const response = await api.get(url);
      // const response = await axios.get(url, {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("JWT_TOKEN")}`,
      //   },
      // });

      if (response.status == 200) {
        setData(response.data);
        setKeysForThead(response.data[0]);
      }
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err,
        icon: "error",
      });
    }
  };
  //  number|string  number|string
  const realtimeUpdatingData = (id: number, field: any, newValue: any) => {
    const updatedArray = currentTableData.map((item) => {
      if (item.id === id && item.name === field) {
        return { ...item, name: newValue, isEdited: true };
      }
      if (item.id === id && item.region === field) {
        return { ...item, region: newValue, isEdited: true };
      }
      if (item.id === id && item.element === field) {
        return { ...item, element: newValue, isEdited: true };
      }
      if (item.id === id && item.gender === field) {
        return { ...item, gender: newValue, isEdited: true };
      }
      if (item.id === id && item.rarity === field) {
        return { ...item, rarity: newValue, isEdited: true };
      }
      return item;
    });
    setData(updatedArray);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = `/myOwnNextjsWeb`;
      await api.put(url, data);

      fetchData();

      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "บันทึกข้อมูลเรียบร้อยแล้ว",
        timer: 1000,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "error " + err,
      });
    }
  };

  // const filteredByKey = (b: boolean, k: string | number) => {
  const filteredByKey = (b: boolean, k: string) => {
    setIsFiltered(!isFiltered);
    if (isFiltered === true) {
      // ASC
      currentTableData.sort((a, b) => {
        if (a[k as keyof typeof a] < b[k as keyof typeof b]) return -1;
        if (a[k as keyof typeof a] > b[k as keyof typeof b]) return 1;
        return 0;
      });
    } else {
      // DESC
      currentTableData.sort((a, b) => {
        if (b[k as keyof typeof b] < a[k as keyof typeof a]) return -1;
        if (b[k as keyof typeof b] > a[k as keyof typeof a]) return 1;
        return 0;
      });
    }
  };

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  return (
    // <div className="">
    <div className="flex flex-col w-full">
      <div className="overflow-auto shadow-xl rounded-xl">
        <table className="text-white">
          <thead>
            <tr>
              {Object.keys(keysForThead).map((key) => (
                <th
                  key={key}
                  className="py-3 bg-stone-800/75 hover:bg-stone-400/75"
                  onClick={
                    () => filteredByKey(isFiltered, key)
                    // filteredByKey(isFiltered, key == "id" ? 1 : key)
                  }
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentTableData.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-stone-400/75 ${
                  item.isEdited == true ? "bg-red-500/50" : "bg-stone-500/75"
                }`}
                // style={isEditedWarning(item.isEdited)}
              >
                <td className="px-3 py-3 flex justify-center">{item.id}</td>
                <td className="px-3 py-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      realtimeUpdatingData(item.id, item.name, e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    type="text"
                    value={item.region}
                    onChange={(e) =>
                      realtimeUpdatingData(item.id, item.region, e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    type="text"
                    value={item.element}
                    onChange={(e) =>
                      realtimeUpdatingData(
                        item.id,
                        item.element,
                        e.target.value
                      )
                    }
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    type="text"
                    value={item.gender}
                    onChange={(e) =>
                      realtimeUpdatingData(item.id, item.gender, e.target.value)
                    }
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    type="text"
                    value={item.rarity}
                    onChange={(e) =>
                      realtimeUpdatingData(item.id, item.rarity, e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex justify-end">
        <button
          type="submit"
          className="px-3 py-1 border rounded-xl bg-teal-600/75 text-white hover:bg-teal-400/75"
        >
          <i className="fas fa-check mr-2"></i>
          บันทึก
        </button>
      </form>

      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded-xl bg-stone-500/75 text-white hover:bg-stone-200/50"
        >
          Previous
        </button>

        {/* Render page numbers (optional, but good UX) */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`px-3 py-1 border rounded-xl ${
                pageNumber === currentPage
                  ? "bg-stone-500/75 text-white hover:bg-stone-200/50"
                  : "bg-stone-200/75 hover:bg-stone-200/50"
              }`}
            >
              {pageNumber}
            </button>
          )
        )}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded-xl bg-stone-500/75 text-white hover:bg-stone-200/50"
        >
          Next
        </button>

        <button
          className={`px-3 py-1 border rounded-xl bg-stone-500/75 text-white hover:bg-stone-200/50`}
          onClick={() => setItemsPerPage(5)}
        >
          5
        </button>
        <button
          className={`px-3 py-1 border rounded-xl bg-stone-500/75 text-white hover:bg-stone-200/50`}
          onClick={() => setItemsPerPage(10)}
        >
          10
        </button>
        <button
          className={`px-3 py-1 border rounded-xl bg-stone-500/75 text-white hover:bg-stone-200/50`}
          onClick={() => setItemsPerPage(15)}
        >
          15
        </button>
        <button
          className={`px-3 py-1 border rounded-xl bg-stone-500/75 text-white hover:bg-stone-200/50`}
          onClick={() => setItemsPerPage(30)}
        >
          30
        </button>
      </div>
    </div>
    // </div>
  );
}
