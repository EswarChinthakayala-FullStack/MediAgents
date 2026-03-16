import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded border text-xs/relaxed font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#3ecf8e]/40 focus-visible:border-[#3ecf8e]/60 active:translate-y-px disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary — Supabase green
        default:
          "bg-[#3ecf8e] border-[#3ecf8e] text-[#0a2d1f] font-semibold hover:bg-[#4fd9a0] hover:border-[#4fd9a0] shadow-sm shadow-[#3ecf8e]/20",

        // Outline — dark surface, subtle border
        outline:
          "bg-[#1a1a1a] border-[#2a2a2a] text-[#ccc] hover:bg-[#222] hover:border-[#333] hover:text-white dark:bg-[#111] dark:border-[#2a2a2a] dark:text-[#999] dark:hover:bg-[#1a1a1a] dark:hover:text-white",

        // Secondary — slightly lifted dark
        secondary:
          "bg-[#1f1f1f] border-[#2a2a2a] text-[#e5e5e5] hover:bg-[#2a2a2a] hover:border-[#333] hover:text-white",

        // Ghost — no border, no bg
        ghost:
          "border-transparent text-[#888] hover:bg-[#1a1a1a] hover:text-[#e5e5e5] dark:hover:bg-[#1a1a1a]",

        // Destructive — muted red on dark
        destructive:
          "bg-red-950/40 border-red-900/40 text-red-400 hover:bg-red-900/50 hover:border-red-800/60 hover:text-red-300 focus-visible:ring-red-500/30",

        // Danger solid
        "destructive-solid":
          "bg-red-600 border-red-600 text-white hover:bg-red-500 hover:border-red-500",

        // Link
        link:
          "border-transparent text-[#3ecf8e] underline-offset-4 hover:underline hover:text-[#4fd9a0]",

        // Muted — dimmed text, minimal presence
        muted:
          "border-transparent text-[#555] hover:text-[#888] hover:bg-[#1a1a1a]",
      },
      size: {
        xs:      "h-5 gap-1 rounded px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
        sm:      "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        default: "h-7 gap-1.5 px-3 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg:      "h-9 gap-2 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 [&_svg:not([class*='size-'])]:size-4",
        xl:      "h-10 gap-2 px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-4",
        "icon-xs": "size-5 rounded[&_svg:not([class*='size-'])]:size-2.5",
        "icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
        icon:      "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-9 [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants }