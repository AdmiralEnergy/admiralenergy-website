import Image from "next/image";

type BrandLockupProps = {
  context: "header" | "footer";
};

export default function BrandLockup({ context }: BrandLockupProps) {
  const isFooter = context === "footer";

  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center ${isFooter ? "gap-3.5" : "gap-3"}`}>
      <span
        className={`relative block shrink-0 overflow-hidden rounded-xl bg-admiral-white ring-1 ring-admiral-gold/40 ${
          isFooter ? "h-14 w-14 shadow-md" : "h-11 w-11 shadow-sm"
        }`}
      >
        <Image
          src="/logos/ae-icon-512.png"
          alt=""
          width={512}
          height={512}
          sizes={isFooter ? "86px" : "68px"}
          priority={!isFooter}
          className={`absolute left-1/2 max-w-none -translate-x-1/2 object-contain ${
            isFooter ? "-top-1 h-[86px] w-[86px]" : "-top-0.5 h-[68px] w-[68px]"
          }`}
        />
      </span>

      <span
        className={`${isFooter ? "flex text-[1.2rem]" : "hidden text-[0.95rem] sm:flex"} flex-col font-serif font-bold uppercase leading-[0.88] tracking-[0.1em] text-admiral-white`}
      >
        <span>Admiral</span>
        <span>Energy</span>
      </span>
    </span>
  );
}
