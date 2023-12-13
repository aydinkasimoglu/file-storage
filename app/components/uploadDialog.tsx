"use client";

import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Image from "next/image";
import SubmitButton from "./submitButton";

type FormValues = {
  file: FileList;
};

enum Status {
  SAVING = "SAVING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  PENDING = "PENDING",
}

export default function UploadDialog({ id }: { id: string }) {
  const [file, setFile] = useState<File>();
  const [status, setStatus] = useState(Status.PENDING);
  const [fileUrl, setFileUrl] = useState("");
  const ref = useRef<HTMLDialogElement>(null);
  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async ({ file }) => {
    try {
      if (!file[0]) {
        setStatus(Status.ERROR);
        return;
      }

      setFile(file[0]);

      setStatus(Status.SAVING);

      const fileName = file[0].name;

      const response = await fetch(
        `/api/presigned-url?file=${fileName}&id=${id}`
      );

      const { url }: { url: string } = await response.json();

      const fileUpload = await fetch(url, {
        method: "PUT",
        body: file[0],
      });

      if (!fileUpload.ok) {
        setStatus(Status.ERROR);
        return;
      }

      setFileUrl(
        `http://file-storage-project-bucket.s3.amazonaws.com/${fileName}`
      );
      console.log(fileUrl);
      setStatus(Status.SUCCESS);
    } catch (error) {
      console.error(error);
    }
  };

  function closeDialog(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    setStatus(Status.PENDING);
    setFileUrl("");
    ref.current?.close();
  }

  return (
    <dialog ref={ref}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm mx-auto pb-10 mt-10 px-10 border rounded-lg drop-shadow-md bg-white text-gray-600 flex flex-col gap-6"
      >
        <div className="flex flex-row justify-between">
          <h1 className="text-2xl select-none">File Upload</h1>

          <button onClick={closeDialog} className="text-2xl">
            &times;
          </button>
        </div>
        <p className="text-md select-none">
          STATUS: <span className="font-bold">{status}</span>
        </p>
        <input
          type="file"
          {...register("file")}
          className="w-full text-gray-600 rounded border-gray-300 focus:ring-gray-500 dark:focus:ring-gray-600 border py-2 px-2"
        />
        <SubmitButton isSubmitting={status === Status.SAVING}>
          Upload
        </SubmitButton>

        {status === Status.SUCCESS && (
          <>
            {file && file.type.startsWith("image") ? (
              <>
                <div className="flex flex-col gap-2">
                  <p className="text-md">File uploaded successfully!</p>
                  <Image
                    src={fileUrl}
                    width={500}
                    height={500}
                    alt="Uploaded image"
                    loader={() => fileUrl}
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-md">File uploaded successfully!</p>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-500"
                >
                  {fileUrl}
                </a>
              </>
            )}
          </>
        )}
      </form>
    </dialog>
  );
}
