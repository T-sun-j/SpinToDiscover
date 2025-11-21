"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { classNames } from "../../lib/utils/classNames"

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined)

const DropdownMenu = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    if (!open) return
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false)
      }
    }
    
    // 使用 setTimeout 确保在下一个事件循环中添加监听器，延迟足够长以避免立即关闭
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 200)
    
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} data-dropdown-menu className="relative" {...props}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
  }
>(({ className, asChild, children, onClick, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu")

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    // 直接切换状态
    const newOpen = !context.open
    context.setOpen(newOpen)
    onClick?.(e)
  }

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>
    const originalOnClick = child.props.onClick
    
    return React.cloneElement(child, {
      ...child.props,
      ...props,
      ref: ref,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation()
        const newOpen = !context.open
        context.setOpen(newOpen)
        originalOnClick?.(e)
      },
    } as any)
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "end" | "center"
    radius?: string
  }
>(({ className, align = "end", radius, style, children, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext)
  if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu")

  if (!context.open) return null

  return (
    <div
      ref={ref}
      className={classNames(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-full bg-white text-[#12295B] shadow-lg",
        align === "start" && "left-0",
        align === "end" && "right-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        "mt-1",
        className
      )}
      style={{
        ...style,
        borderRadius: radius ? `var(--radius, ${radius})` : undefined,
      }}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext)
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    context?.setOpen(false)
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={classNames(
        "relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-sm outline-none transition-colors hover:bg-gray-100 first:rounded-t-full last:rounded-b-full",
        className
      )}
      {...props}
    />
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
}

