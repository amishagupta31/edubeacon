import Button from "./ui/Button";

export default function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-line bg-warm-white/95 p-3 backdrop-blur-md md:hidden">
      <Button href="/sponsor" variant="secondary" className="flex-1">
        Sponsor
      </Button>
      <Button href="/#register" variant="primary" className="flex-1">
        Register Now
      </Button>
    </div>
  );
}
