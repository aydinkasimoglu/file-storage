"use client";

import { useEffect, useState } from "react";
import FileItem from "./fileItem";
import UploadDialog from "./uploadDialog";

type ObjectListProps = {
  id: string;
};

type Content = {
  name: string;
  lastModified: string;
  size: number;
};

export default function FileTable({ id }: ObjectListProps) {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<Content[]>();

  function openDialog() {
    const dialog = document.querySelector("dialog");

    if (dialog) {
      dialog.showModal();
    }
  }

  useEffect(() => {
    async function getFiles() {
      try {
        const response = await fetch(`/api/getFiles?id=${id}`);

        const { contents }: { contents: Content[] } = await response.json();

        setFiles(contents);
      } catch (error) {
        console.error(error);
      }
    }

    const interval = setInterval(() => {
      getFiles().finally(() => {
        setLoading(false);
      });
    }, 5000);

    return () => clearInterval(interval);
  });

  return (
    <>
      {loading ? (
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 animate-spin self-center"
        >
          <path
            d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
            fill="white"
          />
        </svg>
      ) : (
        <>
          {files && files.length > 0 ? (
            <div className="py-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-md dark:bg-gray-900">
              <div className="sm:items-center sm:flex">
                <div className="sm:flex-auto">
                  <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    Files
                  </h1>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {files.length} file{files.length !== 1 ? "s" : ""} found.
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                  <button
                    type="button"
                    onClick={openDialog}
                    className="block rounded-md bg-primary px-3 py-2 text-center text-sm font-semibold text-white shadow-sm"
                  >
                    Add file
                  </button>

                  <UploadDialog id={id} />
                </div>
              </div>
              <div className="mt-8 flow-root">
                <div className="mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3 pl-4 pr-3 sm:pl-0 text-gray-900 dark:text-white text-sm font-semibold text-left"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            className="py-3 pl-4 pr-3 sm:pl-0 text-gray-900 dark:text-white text-sm font-semibold text-left"
                          >
                            Last Modified
                          </th>
                          <th
                            scope="col"
                            className="py-3 pl-4 pr-3 sm:pl-0 text-gray-900 dark:text-white text-sm font-semibold text-left"
                          >
                            Size
                          </th>
                          <th scope="col" className="relative py-3 pl-3 pr-4 sm:pr-0">
                            <span className="sr-only">Delete</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className=" border-gray-700 border-t">
                        {files.map((file) => (
                          <FileItem
                            key={file.name}
                            name={file.name}
                            lastModified={file.lastModified}
                            size={file.size}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center dark:text-white">No files found.</p>
          )}
        </>
      )}
    </>
  );
}
