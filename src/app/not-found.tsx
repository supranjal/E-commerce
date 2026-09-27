import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-6 bg-sacred-50">
      <div className="w-16 h-16 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-700">
        <Sparkles className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-saffron-700">
          Error 404
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-sacred-950">
          Sacred Specimen Not Found
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          The Rudraksha page or certificate URL you are looking for has been relocated or does not exist.
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="primary" asChild>
          <Link href="/" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Storefront
          </Link>
        </Button>
      </div>
    </div>
  );
}
