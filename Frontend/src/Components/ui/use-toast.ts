import * as React from "react"

type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
}

type Toast = Omit<ToastProps, "id">

let toastCount = 0
const listeners: Array<(toasts: ToastProps[]) => void> = []
let toasts: ToastProps[] = []

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER
  return toastCount.toString()
}

function notify() {
  listeners.forEach((l) => l(toasts))
}

function toast({ title, description, variant }: Toast) {
  const id = genId()
  toasts = [{ id, title, description, variant }, ...toasts].slice(0, 1)
  notify()
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    notify()
  }, 2000)
}

function useToast() {
  const [state, setState] = React.useState<ToastProps[]>(toasts)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return { toast, toasts: state }
}

export { useToast, toast }
