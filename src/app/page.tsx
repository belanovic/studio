
import { QuizContainer } from "@/components/quiz/QuizContainer";
import { Toaster } from "@/components/ui/toaster"; // For potential future toast notifications

export default function KulturniKrugPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-2 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-foreground selection:bg-primary selection:text-primary-foreground">
      <div className="relative z-10 w-full">
        <QuizContainer />
      </div>
      <Toaster />
    </main>
  );
}
