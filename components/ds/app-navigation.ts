const dsAppBrand = {
  href: "/demo/dashboard",
  logoSrc: "/logo.svg",
  logoAlt: "Logo công ty",
  name: "MSM Portal",
  description: "EVNNPC NPSC",
} as const

const dsAppRootBreadcrumb = {
  label: dsAppBrand.name,
  href: dsAppBrand.href,
} as const

export { dsAppBrand, dsAppRootBreadcrumb }
