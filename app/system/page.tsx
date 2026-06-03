import { EnterprisePatternsSection } from "./_components/enterprise-patterns-section"
import { OverviewSection } from "./_components/overview-section"
import { PrimitivesSection } from "./_components/primitives-section"
import { StatesSection } from "./_components/states-section"
import { TableSection } from "./_components/table-section"

export default function SystemPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6">
        <OverviewSection />
        <PrimitivesSection />
        <EnterprisePatternsSection />
        <StatesSection />
        <TableSection />
      </div>
    </main>
  )
}
