const dsColors = {
  operationalOrange: "#ff7a5d",
} as const

const dsStatusColorClasses = {
  pending: {
    badge: "border-[#ff7a5d] bg-[#ff7a5d] text-white",
    dot: "bg-white",
  },
} as const

export { dsColors, dsStatusColorClasses }
