"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface CustomAlertDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  isDarkMode: boolean
}

export function CustomAlertDialog({
  isOpen,
  onClose,
  title,
  description,
  isDarkMode,
}: CustomAlertDialogProps) {
  if (!isOpen) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent
        className={
          isDarkMode
            ? "bg-slate-900 border-slate-700 text-white"
            : "bg-white border-rose-200 text-gray-900"
        }
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription
            className={isDarkMode ? "text-slate-400" : "text-slate-600"}
          >
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onClose}
            className={
              isDarkMode
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-rose-500 hover:bg-rose-600"
            }
          >
            확인
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
