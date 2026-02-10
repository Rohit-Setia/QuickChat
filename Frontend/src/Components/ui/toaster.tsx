import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-md px-4 py-3 text-sm shadow-lg ${
            t.variant === "destructive"
              ? "bg-red-600 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {t.title && <div className="font-semibold">{t.title}</div>}
          {t.description && (
            <div className="text-xs opacity-90">{t.description}</div>
          )}
        </div>
      ))}
    </div>
  )
}
