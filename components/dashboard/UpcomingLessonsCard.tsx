import { Calendar } from "lucide-react";
import type { UpcomingLesson } from "@/types/dashboard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type UpcomingLessonsCardProps = {
  lessons: UpcomingLesson[];
};

export function UpcomingLessonsCard({ lessons }: UpcomingLessonsCardProps) {
  return (
    <Card padding="none" className="px-5 py-4">
      <h2 className="font-serif text-lg tracking-tight text-foreground">
        Prihajajoče lekcije
      </h2>

      <ul className="mt-3.5 flex flex-col gap-3.5">
        {lessons.map((lesson) => (
          <li key={lesson.id} className="flex items-start gap-2.5">
            <Calendar
              className="mt-0.5 h-4 w-4 shrink-0 text-muted"
              strokeWidth={1.6}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="font-medium leading-snug text-foreground">
                {lesson.title}
              </p>
              <p className="mt-0.5 text-sm leading-snug text-muted">
                {lesson.program}
              </p>
              <p className="text-sm leading-snug text-muted">{lesson.schedule}</p>
            </div>
          </li>
        ))}
      </ul>

      <Button variant="outline" className="mt-4 w-full">
        Vsi urniki
      </Button>
    </Card>
  );
}
