/**
 * Button used to submit forms
 * 
 * @param isSubmitting Used to disable the button when the form is submitting
 * @param children The content of the button
 */
export default function SubmitButton({
  isSubmitting,
  children,
}: {
  isSubmitting: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className="flex justify-center rounded-md bg-primary px-4 py-2 font-semibold text-white no-underline shadow-sm transition-all hover:bg-primary-hover hover:shadow-md disabled:cursor-not-allowed disabled:bg-primary-disabled dark:shadow-md dark:hover:shadow-sm"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
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
        <>{children}</>
      )}
    </button>
  );
}
