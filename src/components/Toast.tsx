interface Props {
  message?: string
  onDismiss: () => void
}

export default function Toast({ message, onDismiss }: Props) {
  return (
    <div
      role="status"
      aria-atomic="true"
      className="fixed right-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:right-6 sm:bottom-6"
    >
      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-navy shadow-lg">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mt-0.5 size-5 shrink-0 text-primary"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
          </svg>
          <p className="min-w-0 flex-1 break-words text-sm leading-6">{message}</p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={onDismiss}
            className="shrink-0 rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-navy"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="size-4"
            >
              <path strokeLinecap="round" d="m6 6 12 12M6 18 18 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
