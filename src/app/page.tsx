
import { QuizContainer } from "@/components/quiz/QuizContainer";
import { Toaster } from "@/components/ui/toaster"; // For potential future toast notifications

export default function KulturniKrugPage() {
  return (
    <main className="h-[400px] w-full flex flex-col items-center justify-center p-2 bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950 text-foreground selection:bg-primary selection:text-primary-foreground overflow-y-auto">
      <div className="relative z-10 w-full">
        <QuizContainer />
      </div>
      <Toaster />
    </main>
  );
}
