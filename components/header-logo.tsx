import Link from "next/link";
import Image from "next/image";

export const HeaderLogo = () => {
  return (
    <Link href="/">
        <Image src="/logo-rollbank.svg" alt="Logo" height={28} width={258} />
    </Link>
  );
};
