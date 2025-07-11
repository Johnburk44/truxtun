import { IconAlertCircle } from "@tabler/icons-react"

interface ErrorMessageProps {
  title?: string
  message: string
  retry?: () => void
}

export function ErrorMessage({ title = "Error", message, retry }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <IconAlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {retry && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  onClick={retry}
                  className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
