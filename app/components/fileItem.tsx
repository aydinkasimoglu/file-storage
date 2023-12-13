import { useRef } from "react";

type FileItemProps = {
  name: string;
  lastModified: string;
  size: number;
};

export default function FileItem({ name, lastModified, size }: FileItemProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function formatFileSize(size: number) {
    const units = ["B", "KB", "MB", "GB"];

    let unitIndex = 0;

    while (size >= 1024) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  function howManyDaysAgo(date: string) {
    const currentDate = new Date();
    const providedDate = new Date(date);

    const timeDifference = currentDate.getTime() - providedDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) {
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
  }

  function shortenFileName(originalFileName: string) {
    const maxLength = 50;

    if (originalFileName.length <= maxLength) {
      return originalFileName;
    } else {
      const extension = originalFileName.split(".").pop();
      const truncatedName = originalFileName.substring(
        0,
        maxLength - extension!.length - 1
      );
      return truncatedName + "..." + extension;
    }
  }

  async function handleDownload() {
    try {
      const response = await fetch(
        `http://file-storage-project-bucket.s3.amazonaws.com/${name}`
      );
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name.substring(name.indexOf("/") + 1);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }

  function handleDelete() {
    const dialog = dialogRef.current;

    if (dialog) {
      dialog.showModal();
    }
  }

  async function handleDeleteConfirm() {
    try {
      const response = await fetch(`/api/deleteFile?key=${name}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error deleting file:", error);
    }

    const dialog = dialogRef.current;

    if (dialog) {
      dialog.close();
    }
  }

  return (
    <tr className="border-gray-800 border-b">
      <td className="py-4 pl-4 pr-3 sm:pl-0">
        <button
          type="button"
          onClick={handleDownload}
          className="text-gray-900 dark:text-white text-sm font-medium text-left whitespace-nowrap hover:underline ml-2"
          title="Download"
        >
          {shortenFileName(name.substring(name.indexOf("/") + 1))}
        </button>
      </td>
      <td
        className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 text-left"
        title={new Date(lastModified).toLocaleString()}
      >
        {howManyDaysAgo(lastModified)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 text-left">
        {formatFileSize(size)}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <button
          type="button"
          onClick={handleDelete}
          className="text-gray-900 dark:text-white hover:underline"
        >
          Delete
        </button>
        <dialog ref={dialogRef} className="rounded-md">
          <div className="flex flex-col p-4">
            <div className="flex flex-col items-center">
              <h1 className="text-xl font-medium">Delete File?</h1>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                Are you sure you want to delete this file? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => dialogRef.current?.close()}
                className="px-4 py-2 text-sm font-medium hover:bg-[rgb(244,244,244)] rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </dialog>
      </td>
    </tr>
  );
}
