import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Progress } from "@/components/ui/Progress";

export const metadata: Metadata = {
  title: "Pregled",
};

export default function PregledPage() {
  return (
    <>
      <PageHeader
        title="Pregled"
        subtitle="Začasna vsebina — v naslednji nalogi bo tukaj celoten pregled učilnice."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <p className="ui-label">Dobrodošli</p>
          <h2 className="mt-3 font-serif text-2xl tracking-tight text-foreground">
            Tvoja spletna učilnica je pripravljena.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            To je temelj aplikacije: skupna lupina, tipografija in vizualni
            jezik. Vsebina pregleda bo dodana v naslednjem koraku.
          </p>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="ui-label">Osnutek sistema</p>
              <h2 className="mt-3 program-title">Temelj vizualnega jezika</h2>
            </div>
            <Badge variant="success">V pripravi</Badge>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Kartice, značke in napredek uporabljajo iste žetone, ki jih bodo
            prevzele tudi naslednje strani.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Progress value={28} label="Napredek temelja" className="flex-1" />
            <span className="text-sm text-muted">28%</span>
          </div>
        </Card>
      </div>
    </>
  );
}
