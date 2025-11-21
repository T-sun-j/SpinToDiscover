import * as React from "react"
import { classNames } from "../../lib/utils/classNames"

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    radius?: string
  }
>(({ className, radius, style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={classNames(
        "flex items-center overflow-hidden border border-gray-300 rounded-full bg-gray-100",
        className
      )}
      style={{
        ...style,
        borderRadius: radius ? `var(--radius, ${radius})` : undefined,
      }}
      {...props}
    />
  )
})
InputGroup.displayName = "InputGroup"

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={classNames(
        "flex-1 px-3 py-2 bg-transparent border-0 focus:outline-none focus:ring-0 text-[#11295b] placeholder:text-gray-500",
        className
      )}
      {...props}
    />
  )
})
InputGroupInput.displayName = "InputGroupInput"

const InputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "inline-start" | "inline-end"
  }
>(({ className, align = "inline-end", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={classNames(
        "flex items-center",
        align === "inline-start" && "order-first",
        align === "inline-end" && "order-last",
        className
      )}
      {...props}
    />
  )
})
InputGroupAddon.displayName = "InputGroupAddon"

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={classNames(
        "px-3 py-2 h-full flex items-center gap-1 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer",
        className
      )}
      {...props}
    />
  )
})
InputGroupButton.displayName = "InputGroupButton"

export { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton }

